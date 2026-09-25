export interface Profile {
  id?: string | number;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatar_url: string;
  resume_url: string;
  whatsapp_number: string;
  email: string;
  location: string;
  github_url: string;
  linkedin_url: string;
  instagram_url?: string;
  formspree_id?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string;
  demo_url?: string;
  github_url?: string;
  category?: string;
  featured?: boolean;
  metrics?: string;
  created_at?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url?: string;
  image_url: string;
  skills?: string[];
  created_at?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  type: string;
  location: string;
  description: string;
  highlights: string[];
  technologies: string[];
}
