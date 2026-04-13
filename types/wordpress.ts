// types/wordpress.ts
// Types for the WordPress REST API v2

export interface WPPost {
  id: number
  slug: string
  date: string
  modified: string
  link: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  featured_media: number
  categories: number[]
  tags: number[]
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
      media_details?: {
        sizes?: {
          medium?: { source_url: string }
          large?: { source_url: string }
          full?: { source_url: string }
        }
      }
    }>
    'wp:term'?: Array<
      Array<{
        id: number
        name: string
        slug: string
        taxonomy: string
      }>
    >
  }
  // ACF fields (if Advanced Custom Fields plugin is active)
  acf?: Record<string, unknown>
}

export interface WPCategory {
  id: number
  count: number
  name: string
  slug: string
  parent: number
}

export interface WPMedia {
  id: number
  source_url: string
  alt_text: string
  media_details: {
    width: number
    height: number
    sizes: Record<string, { source_url: string; width: number; height: number }>
  }
}
