import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Hero')
        .id('hero')
        .schemaType('hero')
        .child(S.document().schemaType('hero').documentId('hero')),
      S.listItem()
        .title('Gallery')
        .id('gallery')
        .schemaType('gallery')
        .child(S.document().schemaType('gallery').documentId('gallery')),
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .schemaType('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('galleryItem').title('Gallery items'),
    ])
