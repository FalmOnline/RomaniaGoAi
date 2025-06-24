// import { getTranslation } from './utils/getTranslation';
// import { PLUGIN_ID } from './pluginId';
// import { Initializer } from './components/Initializer';
// import { PluginIcon } from './components/PluginIcon';

// export default {
//   register(app: any) {
//     app.addMenuLink({
//       to: `plugins/${PLUGIN_ID}`,
//       icon: PluginIcon,
//       intlLabel: {
//         id: `${PLUGIN_ID}.plugin.name`,
//         defaultMessage: PLUGIN_ID,
//       },
//       Component: async () => {
//         const { App } = await import('./pages/App');

//         return App;
//       },
//     });

//     app.registerPlugin({
//       id: PLUGIN_ID,
//       initializer: Initializer,
//       isReady: false,
//       name: PLUGIN_ID,
//     });
//   },

//   async registerTrads({ locales }: { locales: string[] }) {
//     return Promise.all(
//       locales.map(async (locale) => {
//         try {
//           const { default: data } = await import(`./translations/${locale}.json`);

//           return { data, locale };
//         } catch {
//           return { data: {}, locale };
//         }
//       })
//     );
//   },
// };

// If you were using JSX, rename this file to index.tsx. 
// Otherwise, you can keep it as index.ts and use React.createElement (shown below).

import React from 'react';

const plugin = {
  register(app: any) {
    app.registerHook(
      'Admin/CM/pages/ListView/inject-column-in-table',
      ({ displayedHeaders }: any) => {
        return [
          {
            key: 'openInTab',
            name: 'Open',
            metadatas: { label: '', sortable: false },
            Cell: ({ rowId, layout }: any) => {
              const url = `/content-manager/collectionType/${layout.uid}/${rowId}`;

              // A plain <a> tag with a “link” emoji.
              return React.createElement(
                'a',
                {
                  href: url,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  title: 'Open in new tab',
                  style: {
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    lineHeight: '16px',
                    textAlign: 'center',
                    fontSize: '16px',
                  },
                },
                '🔗'
              );
            },
          },
          ...displayedHeaders,
        ];
      }
    );
  },

  bootstrap() {},

  async registerTrads() {
    return {};
  },
};

export default plugin;
