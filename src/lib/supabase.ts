import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project-id")
);

// Graceful client instance
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Upload a file to Supabase Storage bucket 'portfolio-assets'.
 * If Supabase is not configured, converts file to a base64 data URL so admin can preview/test locally.
 */
export async function uploadMedia(
  file: File,
  folder: "avatars" | "projects" | "certificates"
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    // Local preview fallback using DataURL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: reader.result as string, error: null });
      };
      reader.onerror = () => {
        resolve({ url: null, error: "Gagal membaca file lokal" });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const rawExt = file.name.split(".").pop() || "jpg";
    const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const contentType = file.type || `image/${fileExt === "jpg" ? "jpeg" : fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-assets")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
        contentType,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return { url: null, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("portfolio-assets")
      .getPublicUrl(fileName);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan upload";
    return { url: null, error: message };
  }
}
