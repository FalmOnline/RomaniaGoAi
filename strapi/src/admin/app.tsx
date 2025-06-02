// import type { StrapiApp } from '@strapi/strapi/admin';
// import ListRow from './extensions/@strapi/plugin-content-manager/admin/components/ListRow';


// export default {
//   config: {
//     locales: [
//       // 'ar',
//       // 'fr',
//       // 'cs',
//       // 'de',
//       // 'dk',
//       // 'es',
//       // 'he',
//       // 'id',
//       // 'it',
//       // 'ja',
//       // 'ko',
//       // 'ms',
//       // 'nl',
//       // 'no',
//       // 'pl',
//       // 'pt-BR',
//       // 'pt',
//       // 'ru',
//       // 'sk',
//       // 'sv',
//       // 'th',
//       // 'tr',
//       // 'uk',
//       // 'vi',
//       // 'zh-Hans',
//       // 'zh',
//     ],
//   },
//   bootstrap(app: StrapiApp) {
//     console.log(app);
//   },
//   // register(app: StrapiApp) {
//   //   app.registerComponent({
//   //     name: 'ListRow',
//   //     pluginId: 'content-manager',
//   //     component: ListRow,
//   //   });
//   // },
// };

import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [], // Add any locales you want here
  },

  bootstrap(app: StrapiApp) {
    console.log('✅ Strapi admin panel started');
  },

  // ❌ No register() method — it breaks on v5.4.0
};

