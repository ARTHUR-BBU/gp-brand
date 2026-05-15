'use strict';

module.exports = {
  kind: 'singleType',
  collectionName: 'craftsmanship',
  info: {
    singularName: 'craftsmanship',
    pluralName: 'craftsmanships',
    displayName: '工艺页配置',
    description: '珠层精萃页面内容与技术参数',
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
    intro_text: {
      type: 'richtext',
    },
    inspection_points: {
      type: 'string',
    },
  },
};
