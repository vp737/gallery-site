import {defineField, defineType} from 'sanity'

export const contactLink = defineType({
  name: 'contactLink',
  title: 'Contact link',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          {title: 'Email', value: 'email'},
          {title: 'URL', value: 'url'},
        ],
        layout: 'radio',
      },
      initialValue: 'email',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
      hidden: ({parent}) => parent?.linkType !== 'email',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'url',
    }),
  ],
})
