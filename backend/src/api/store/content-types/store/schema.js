'use strict';

module.exports = {
  kind: 'collectionType',
  collectionName: 'stores',
  info: {
    singularName: 'store',
    pluralName: 'stores',
    displayName: '门店',
    description: 'GP 珈珮精品店与品牌中心',
  },
  options: {
    draftAndPublish: true,
  },
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    address: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    latitude: {
      type: 'float',
    },
    longitude: {
      type: 'float',
    },
    store_type: {
      type: 'enumeration',
      enum: ['flagship', 'boutique', 'counter'],
      default: 'boutique',
    },
    is_active: {
      type: 'boolean',
      default: true,
    },
  },
};
