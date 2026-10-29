import { type SchemaTypeDefinition } from 'sanity'

import {cloudinaryImage} from './cloudinaryImage'
import {contactLink} from './contactLink'
import {gallery} from './gallery'
import {galleryItem} from './galleryItem'
import {hero} from './hero'
import {siteSettings} from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [cloudinaryImage, contactLink, hero, galleryItem, gallery, siteSettings],
}
