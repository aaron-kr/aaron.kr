// app/api/preview/route.ts
//
// Entry point for WP admin "Preview" / "View Post" links on drafts,
// scheduled, and private posts. WP's public REST API only returns
// published content, so those posts 404 on the normal frontend routes —
// this route authenticates back to WP with an application password,
// confirms the post exists, enables Next Draft Mode, and redirects to
// the real post path. Once Draft Mode is on, lib/wordpress.ts's
// getPostBySlug(..., { preview: true }) takes over for the actual render.
//
// Configured from mu-plugins/aaron-kr-api.php's aaron_kr_headless_preview_link(),
// which only builds links to this route when AARON_KR_PREVIEW_SECRET is set.

import { NextRequest, NextResponse } from 'next/server'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPostByIdForPreview, wpLinkToPath } from '@/lib/wordpress'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const idParam = searchParams.get('id')

  const expected = process.env.WP_PREVIEW_SECRET
  if (!expected || secret !== expected) {
    return new NextResponse('Invalid preview token', { status: 401 })
  }

  const id = idParam ? parseInt(idParam, 10) : NaN
  if (isNaN(id) || id <= 0) {
    return new NextResponse('Missing or invalid post id', { status: 400 })
  }

  const post = await getPostByIdForPreview(id)
  if (!post) {
    return new NextResponse('Post not found (check WP_PREVIEW_USER / WP_PREVIEW_APP_PASSWORD)', { status: 404 })
  }

  const dm = await draftMode()
  dm.enable()

  redirect(wpLinkToPath(post.link))
}
