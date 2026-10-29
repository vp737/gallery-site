'use client'

import Image from 'next/image'
import {useRef, useState} from 'react'

import type {ContactLink, GalleryItem} from '@/lib/sanity/types'

import ZoomView from './ZoomView'

type GalleryProps = {
  title: string | null
  items: GalleryItem[]
  // Used in the zoom view for items without their own contact link
  defaultContactLink: ContactLink | null
}

// Matches the columns below: 1 column, 2 from sm, 3 from lg, capped by max-w-[1200px]
const TILE_SIZES = '(min-width: 1200px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
const EAGER_COUNT = 3

export default function Gallery({title, items, defaultContactLink}: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  // The tile that opened the zoom view, so focus can go back to it on close
  const openerRef = useRef<HTMLButtonElement | null>(null)

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8 sm:py-24">
      {title && (
        <h2 className="mb-8 text-3xl font-semibold tracking-tight sm:mb-12 sm:text-4xl">{title}</h2>
      )}

      {items.length === 0 ? (
        <p className="py-16 text-center text-foreground/60">No images yet. Check back soon!</p>
      ) : (
        <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8">
          {items.map((item, index) => {
            const publicId = item.image?.publicId

            return (
              <li key={item._id} className="mb-6 break-inside-avoid lg:mb-8">
                <button
                  type="button"
                  onClick={(event) => {
                    openerRef.current = event.currentTarget
                    setSelectedIndex(index)
                  }}
                  aria-label={`View details for ${item.title ?? 'untitled image'}`}
                  className="group block w-full cursor-zoom-in rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                >
                  <div className="overflow-hidden rounded-md bg-foreground/5">
                    {publicId ? (
                      <Image
                        src={publicId}
                        alt={item.alt ?? ''}
                        width={item.width}
                        height={item.height}
                        sizes={TILE_SIZES}
                        loading={index < EAGER_COUNT ? 'eager' : 'lazy'}
                        className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    ) : (
                      <div style={{aspectRatio: `${item.width} / ${item.height}`}} />
                    )}
                  </div>
                  <div className="mt-3">
                    {item.title && <p className="font-semibold">{item.title}</p>}
                    {item.size && <p className="mt-0.5 text-sm text-foreground/60">{item.size}</p>}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <ZoomView
        items={items}
        index={selectedIndex}
        defaultContactLink={defaultContactLink}
        onNavigate={setSelectedIndex}
        onClose={() => {
          setSelectedIndex(null)
          openerRef.current?.focus()
        }}
      />
    </div>
  )
}
