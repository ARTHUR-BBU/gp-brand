'use strict';

module.exports = {
  kind: 'collectionType',
  collectionName: 'categories',
  info: {
    singularName: 'category',
    pluralName: 'categories',
    displayName: '珍珠品类',
    description: '海水珠、淡水珠、巴洛克等珍珠分类',
  },
  options: {
    draftAndPublish: true,
  },
  attributes: {
    title: {
      type: 'string',
      required: true,
    },
    subtitle: {
      type: 'string',
    },
    slug: {
      type: 'uid',
      targetField: 'title',
      required: true,
    },
    description: {
      type: 'richtext',
    },
    hero_image: {
      type: 'media',
      multiple: false,
      allowedTypes: ['images'],
    },
    grid_span: {
      type: 'enumeration',
      enum: ['half', 'full', 'wide'],
      default: 'half',
    },
    sort_order: {
      type: 'integer',
      default: 0,
    },
  },
};
