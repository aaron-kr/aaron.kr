// types/wordpress.ts

export interface WPPost {
  id: number
  slug: string
  date: string
  modified: string
  link: string
  type: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  featured_media: number
  categories: number[]
  tags: number[]
  author: number

  // ── Custom fields added by aaron-kr-api.php mu-plugin ──────────────────────
  reading_time_minutes?: number
  excerpt_plain?: string

  featured_image_urls?: {
    full:   string | null
    large:  string | null
    medium: string | null
    alt:    string
  }

  author_card?: {
    name:        string
    slug:        string
    description: string
    url:         string
    avatar:      string
    twitter:     string
  }

  category_list?: Array<{ id: number; name: string; slug: string }>
  tag_list?:      Array<{ id: number; name: string; slug: string }>

  research_meta?: {
    venue: string; year: string; doi: string
    pdf_url: string; award: string; coauthors: string
  }

  talk_meta?: {
    event: string; event_date: string; location: string
    slides_url: string; video_url: string; language: string
  }

  // ── Standard _embed fields (fallback) ────────────────────────────────────
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
      media_details?: {
        sizes?: {
          medium?: { source_url: string }
          large?:  { source_url: string }
          full?:   { source_url: string }
        }
      }
    }>
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string; taxonomy: string }>>
  }
}

export interface WPCategory {
  id: number; count: number; name: string; slug: string; parent: number
}
