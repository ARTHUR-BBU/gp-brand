'use strict';

module.exports = {
  kind: 'collectionType',
  collectionName: 'services',
  info: {
    singularName: 'service',
    pluralName: 'services',
    displayName: '服务项目',
    description: '品牌服务（定制、售后保养等）',
  },
  options: {
    draftAndPublish: true,
  },
  attributes: {
    title: {
      type: 'string',
      required: true,
    },
    slug: {
      type: 'uid',
      targetField: 'title',
      required: true,
    },
    description: {
      type: 'richtext',
    },
    icon: {
      type: 'string',
    },
    cta_text: {
      type: 'string',
    },
    sort_order: {
      type: 'integer',
      default: 0,
    },
  },
};
