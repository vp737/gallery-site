import 'server-only'

import {dataset, projectId} from '@/sanity/env'

const endpoint = `https://${projectId}.api.sanity.io/v2023-08-01/graphql/${dataset}/default`

type GraphQLResponse<T> = {
  data?: T
  errors?: {message: string}[]
}

export async function sanityGraphql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({query, variables}),
  })

  // Sanity returns GraphQL errors as JSON with a 4xx status, so parse before checking res.ok
  const json = (await res.json().catch(() => null)) as GraphQLResponse<T> | null

  if (json?.errors?.length) {
    const messages = json.errors.map((error) => error.message).join('; ')
    throw new Error(`Sanity GraphQL error: ${messages}`)
  }

  if (!res.ok || !json?.data) {
    throw new Error(`Sanity GraphQL request failed: ${res.status} ${res.statusText}`)
  }

  return json.data
}
