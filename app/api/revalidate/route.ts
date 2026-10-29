import {revalidateTag} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

type WebhookPayload = {_type?: string}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json(
      {message: 'SANITY_REVALIDATE_SECRET is not set on the server'},
      {status: 500},
    )
  }

  // Also waits for Sanity's Content Lake to catch up, so the refetch sees the new content
  const {isValidSignature, body} = await parseBody<WebhookPayload>(req, secret)
  if (!isValidSignature) {
    return NextResponse.json({message: 'Invalid signature'}, {status: 401})
  }

  // expire: 0 so the next visit fetches fresh content instead of being served the stale copy once
  revalidateTag('sanity', {expire: 0})

  return NextResponse.json({revalidated: true, type: body?._type ?? null})
}
