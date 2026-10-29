import {createElement} from 'react'
import {defineField, defineType} from 'sanity'

import {cloudinaryThumbnailUrl} from './cloudinaryImage'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Gallery item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'cloudinaryImage',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the image for screen readers',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      description: 'e.g. 24 × 36 in',
    }),
    defineField({
      name: 'contactLink',
      title: 'Contact link',
      type: 'contactLink',
      description: 'Leave empty to use the default contact link',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      size: 'size',
      publicId: 'image.publicId',
      alt: 'alt',
    },
    prepare({title, size, publicId, alt}) {
      return {
        title,
        subtitle: size,
        media: publicId
          ? createElement('img', {
              src: cloudinaryThumbnailUrl(publicId),
              alt: alt ?? '',
              style: {width: '100%', height: '100%', objectFit: 'cover'},
            })
          : undefined,
      }
    },
  },
})
