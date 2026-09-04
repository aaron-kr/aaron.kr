// components/PreviewBanner.tsx
// Shown above a post when viewed via Next Draft Mode (i.e. through
// /api/preview from a WP "Preview" link). Makes it obvious this is an
// unpublished/scheduled view, not what the public sees. Inline styles —
// deliberately independent of globals.css so it can never be hidden by a
// site restyle and always renders even if this component is new.

import { draftMode } from 'next/headers'
import type { WPPost } from '@/types/wordpress'

export default async function PreviewBanner({ post }: { post: WPPost }) {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null

  const status = post.status ?? 'unpublished'

  return (
    <div
      style={{
        position: 'sticky', top: 0, zIndex: 999,
        background: '#78350f', color: '#fef3c7',
        padding: '.5rem 1rem', fontSize: '.85rem',
        textAlign: 'center', fontFamily: 'system-ui, sans-serif',
      }}
    >
      Preview mode — viewing a <strong>{status}</strong> post, not visible to the public.
    </div>
  )
}
