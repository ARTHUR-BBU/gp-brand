'use strict';

module.exports = {
  kind: 'singleType',
  collectionName: 'homepage',
  info: {
    singularName: 'homepage',
    pluralName: 'homepages',
    displayName: '首页配置',
    description: '首页 Hero、品牌故事、Bento Grid 内容',
  },
  options: {
    draftAndPublish: true,
  },
  attributes: {
    hero_title: {
      type: 'string',
      required: true,
    },
    hero_subtitle: {
      type: 'string',
    },
    hero_image: {
      type: 'media',
      multiple: false,
      allowedTypes: ['images'],
    },
    brand_title: {
      type: 'string',
    },
    brand_text: {
      type: 'richtext',
    },
    brand_image: {
      type: 'media',
      multiple: false,
      allowedTypes: ['images'],
    },
    bento_title: {
      type: 'string',
    },
  },
};
