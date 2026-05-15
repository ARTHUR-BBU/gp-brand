'use strict';

module.exports = {
  kind: 'collectionType',
  collectionName: 'collections',
  info: {
    singularName: 'collection',
    pluralName: 'collections',
    displayName: '系列作品',
    description: '品牌珠宝系列（Iris、Precious Shine、Legacy 等）',
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
      enum: ['small', 'large', 'full'],
      default: 'small',
    },
    sort_order: {
      type: 'integer',
      default: 0,
    },
    featured: {
      type: 'boolean',
      default: false,
    },
  },
};
