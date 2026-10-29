import Image from 'next/image'

import {getPageData} from '@/lib/sanity/getPageData'

export default async function Hero() {
  const {hero} = await getPageData()
  if (!hero) return null

  const {headline, subheadline, backgroundImage, buttonText, buttonLink} = hero
  const publicId = backgroundImage?.publicId

  return (
    <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-neutral-950 px-4 py-24 text-white sm:px-8">
      {publicId && (
        <>
          <Image
            src={publicId}
            alt=""
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/50 to-black/30"
          />
        </>
      )}

      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        {headline && (
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl lg:text-7xl">
            {headline}
          </h1>
        )}
        {subheadline && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-pretty text-white/85 sm:mt-6 sm:text-lg lg:text-xl">
            {subheadline}
          </p>
        )}
        {buttonText && buttonLink && (
          // A plain <a> so "#section" links use the global smooth scrolling
          <a
            href={buttonLink}
            className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:mt-10 sm:px-8 sm:text-base"
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  )
}
