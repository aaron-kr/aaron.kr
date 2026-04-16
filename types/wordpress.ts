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

  reading_time_minutes?: number
  excerpt_plain?: string

  featured_image_urls?: {
    full:         string | null
    large:        string | null
    medium_large: string | null
    medium:       string | null
    alt:          string
  }

  author_card?: {
    name:        string
    slug:        string
    description: string
    url:         string
    avatar:      string
  }

  category_list?: Array<{ id: number; name: string; slug: string }>
  tag_list?:      Array<{ id: number; name: string; slug: string }>

  seo?: {
    title:       string
    description: string
    canonical:   string
    no_index:    boolean
    og_image:    string
  }

  research_meta?: {
    venue: string; year: string; doi: string
    pdf_url: string; award: string; coauthors: string
  }

  talk_meta?: {
    event: string; event_date: string; location: string
    slides_url: string; video_url: string; language: string
  }

  testimonial_meta?: {
    person_name: string; person_title: string; person_org: string
    rating: string; language: string; context: string
  }

  portfolio_meta?: {
    client: string; year: string; tools: string; project_url: string
  }

  naver_blog_url?:  string | null
  korean_post_url?: string | null
  korean_title?:    string | null

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
  description: string
  meta?: { category_image_url?: string }
}

export interface WPTag {
  id: number; count: number; name: string; slug: string
}
