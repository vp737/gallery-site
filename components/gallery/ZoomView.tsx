'use client'

import {useEffect, useId, useRef, useState, useSyncExternalStore} from 'react'
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchContentRef,
} from 'react-zoom-pan-pinch'

import {cloudinaryUrl} from '@/lib/cloudinary/url'
import type {ContactLink, GalleryItem} from '@/lib/sanity/types'

const MIN_SCALE = 1
const MAX_SCALE = 4
const BUTTON_STEP = 0.5
const ANIMATION_MS = 200

type ZoomViewProps = {
  items: GalleryItem[]
  index: number | null
  defaultContactLink: ContactLink | null
  onNavigate: (index: number) => void
  // Fires after the dialog has closed, however it was closed (×, Esc or backdrop)
  onClose: () => void
}

export default function ZoomView({
  items,
  index,
  defaultContactLink,
  onNavigate,
  onClose,
}: ZoomViewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pointerDownOnBackdrop = useRef(false)
  const titleId = useId()
  const [zoomedId, setZoomedId] = useState<string | null>(null)

  const item = index === null ? null : items[index]
  const isOpen = item != null
  const isZoomed = item != null && zoomedId === item._id

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [isOpen])

  const close = () => dialogRef.current?.close()

  const go = (delta: number) => {
    if (index === null) return
    onNavigate((index + delta + items.length) % items.length)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isZoomed || items.length < 2) return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(1)
    }
  }

  const contactHref = item
    ? (contactHrefFor(item.contactLink, item.title) ?? contactHrefFor(defaultContactLink, item.title))
    : null

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      // Only close when both press and release happen on the backdrop, so a pan that ends outside the image doesn't close it
      onPointerDown={(event) => {
        pointerDownOnBackdrop.current = event.target === event.currentTarget
      }}
      onClick={(event) => {
        if (pointerDownOnBackdrop.current && event.target === event.currentTarget) close()
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-4 text-white backdrop:bg-black/90 sm:p-8"
    >
      {item && (
        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col overflow-hidden rounded-lg bg-neutral-950 lg:flex-row">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-2 right-2 z-10 flex size-10 items-center justify-center rounded-full bg-black/60 text-2xl leading-none hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-white"
          >
            <span aria-hidden="true">×</span>
          </button>

          <div className="relative min-h-0 flex-3 bg-black lg:w-[70%] lg:flex-none">
            <ZoomableImage
              key={item._id}
              item={item}
              onZoomedChange={(zoomed) => setZoomedId(zoomed ? item._id : null)}
            />

            {items.length > 1 && (
              <>
                <NavButton direction="previous" onClick={() => go(-1)} />
                <NavButton direction="next" onClick={() => go(1)} />
              </>
            )}
          </div>

          <div className="min-h-0 flex-2 overflow-y-auto p-4 sm:p-6 lg:flex-1 lg:pt-14">
            {items.length > 1 && (
              <p className="text-sm text-white/60 tabular-nums" aria-live="polite">
                {index! + 1} / {items.length}
              </p>
            )}
            <h2 id={titleId} className="mt-2 pr-10 text-2xl font-semibold tracking-tight lg:pr-0">
              {item.title ?? 'Untitled'}
            </h2>
            {item.size && <p className="mt-1 text-white/70">{item.size}</p>}
            {item.description && (
              <p className="mt-4 leading-relaxed whitespace-pre-line text-white/85">
                {item.description}
              </p>
            )}
            {contactHref && (
              <a
                href={contactHref}
                {...(contactHref.startsWith('mailto:')
                  ? {}
                  : {target: '_blank', rel: 'noopener noreferrer'})}
                className="mt-6 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
              >
                Contact for more info
              </a>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}

function ZoomableImage({
  item,
  onZoomedChange,
}: {
  item: GalleryItem
  onZoomedChange: (zoomed: boolean) => void
}) {
  const transformRef = useRef<ReactZoomPanPinchContentRef>(null)
  const [scale, setScale] = useState(1)
  const reducedMotion = usePrefersReducedMotion()
  const animationTime = reducedMotion ? 0 : ANIMATION_MS
  const publicId = item.image?.publicId

  if (!publicId) {
    return <div className="flex h-full items-center justify-center text-white/60">No image</div>
  }

  return (
    <div className="flex h-full flex-col">
      <TransformWrapper
        ref={transformRef}
        minScale={MIN_SCALE}
        maxScale={MAX_SCALE}
        smooth={!reducedMotion}
        doubleClick={{mode: 'toggle', animationTime}}
        zoomAnimation={{disabled: reducedMotion, animationTime}}
        autoAlignment={{animationTime, velocityAlignmentTime: animationTime}}
        velocityAnimation={{disabled: reducedMotion}}
        onTransform={(_, state) => {
          setScale(state.scale)
          onZoomedChange(state.scale > MIN_SCALE + 0.01)
        }}
      >
        <TransformComponent
          wrapperClass="min-h-0 flex-1 cursor-grab active:cursor-grabbing"
          wrapperStyle={{width: '100%'}}
          contentStyle={{width: '100%', height: '100%'}}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- a single large Cloudinary image, zoomed by transform */}
          <img
            src={cloudinaryUrl(publicId, 2400)}
            alt={item.alt ?? ''}
            draggable={false}
            className="size-full object-contain select-none"
          />
        </TransformComponent>
      </TransformWrapper>

      <div className="flex items-center justify-center gap-1 border-t border-white/10 p-2">
        <ToolbarButton
          label="Zoom out"
          disabled={scale <= MIN_SCALE}
          onClick={() => transformRef.current?.zoomOut(BUTTON_STEP, animationTime)}
        >
          −
        </ToolbarButton>
        <span className="w-14 text-center text-sm text-white/80 tabular-nums" aria-live="polite">
          {Math.round(scale * 100)}%
        </span>
        <ToolbarButton
          label="Zoom in"
          disabled={scale >= MAX_SCALE}
          onClick={() => transformRef.current?.zoomIn(BUTTON_STEP, animationTime)}
        >
          +
        </ToolbarButton>
        <ToolbarButton
          label="Reset zoom"
          disabled={scale <= MIN_SCALE}
          onClick={() => transformRef.current?.resetTransform(animationTime)}
          className="ml-2 px-3 text-sm"
        >
          Reset
        </ToolbarButton>
      </div>
    </div>
  )
}

function ToolbarButton({
  label,
  className = 'w-10 text-xl',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {label: string}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex h-10 items-center justify-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40 disabled:hover:bg-transparent ${className}`}
      {...props}
    />
  )
}

function NavButton({direction, onClick}: {direction: 'previous' | 'next'; onClick: () => void}) {
  const isPrevious = direction === 'previous'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrevious ? 'Previous image' : 'Next image'}
      className={`absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-2xl hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-white ${isPrevious ? 'left-2' : 'right-2'}`}
    >
      <span aria-hidden="true">{isPrevious ? '‹' : '›'}</span>
    </button>
  )
}

function contactHrefFor(link: ContactLink | null, title: string | null) {
  if (!link) return null
  if (link.linkType === 'url') return link.url || null
  if (!link.email) return null
  return `mailto:${link.email}?subject=${encodeURIComponent(`Enquiry: ${title ?? ''}`)}`
}

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(reducedMotionQuery)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  )
}
