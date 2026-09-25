import { createClient, SupabaseClient } from "@supabase/supabase-js";

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Clean url in case user pasted endpoint with /rest/v1 or trailing slash
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

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
 * Requires a valid Supabase project configuration.
 */
export async function uploadMedia(
  file: File,
  folder: "avatars" | "projects" | "certificates"
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      url: null,
      error:
        "Supabase belum terhubung! Silakan isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di file .env.local dengan kredensial proyek Supabase Anda.",
    };
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
      return {
        url: null,
        error: `Gagal upload ke Supabase Storage: ${uploadError.message}. Pastikan bucket 'portfolio-assets' sudah dibuat di Supabase Dashboard (Storage) dan diset Public.`,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from("portfolio-assets")
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      return { url: null, error: "Gagal mendapatkan URL publik dari Supabase Storage." };
    }

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan upload ke Supabase Storage";
    return { url: null, error: message };
  }
}

/**
 * Diagnostic helper to check connection to Supabase database and storage
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  tableProfileOk: boolean;
  storageOk: boolean;
  message: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      tableProfileOk: false,
      storageOk: false,
      message:
        "Supabase URL atau Anon Key belum diatur di .env.local (masih berupa nilai placeholder).",
    };
  }

  let tableProfileOk = false;
  let storageOk = false;

  try {
    const { error: tableError } = await supabase
      .from("profile")
      .select("id, bio, avatar_url")
      .limit(1);

    tableProfileOk = !tableError;

    // Test direct access to bucket 'portfolio-assets'
    const { error: storageError } = await supabase.storage
      .from("portfolio-assets")
      .list("", { limit: 1 });

    storageOk = !storageError;

    if (tableProfileOk && storageOk) {
      return {
        connected: true,
        tableProfileOk: true,
        storageOk: true,
        message: "Koneksi Supabase 100% Berhasil! Tabel 'profile' & Storage Bucket 'portfolio-assets' aktif.",
      };
    } else if (!tableProfileOk) {
      return {
        connected: true,
        tableProfileOk: false,
        storageOk,
        message:
          "Terkoneksi ke Supabase, namun skema tabel 'profile' belum sesuai (kolom bio/avatar_url belum ada). Silakan jalankan skrip SQL di Supabase SQL Editor.",
      };
    } else {
      return {
        connected: true,
        tableProfileOk: true,
        storageOk: false,
        message:
          "Terkoneksi ke Supabase & tabel 'profile' siap! Namun bucket 'portfolio-assets' belum dibuat di menu Storage (atau jalankan skrip SQL di SQL Editor).",
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menghubungi Supabase";
    return {
      connected: false,
      tableProfileOk: false,
      storageOk: false,
      message: `Error koneksi Supabase: ${msg}`,
    };
  }
}
