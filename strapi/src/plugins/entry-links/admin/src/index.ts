// import type { StrapiAdminPlugin } from '@strapi/strapi/admin';
// import OpenCell from './components/OpenCell';

// const plugin: StrapiAdminPlugin = {
//   id: 'entry-links',
//   initializer: () => null,
//   isReady: true,
//   name: 'entry-links',

//   register(app) {
//     console.log('[entry-links] Plugin registered ✅');

//     app.registerHook('CM/pages/ListView/mutate-layout', ({ layout }) => {
//       const alreadyInjected = layout.content.some((col) => col.name === '__open');

//       if (!alreadyInjected) {
//         console.log(`[entry-links] Injecting column for UID: ${layout.uid}`);

//         layout.content.push({
//           name: '__open',
//           fieldSchema: { type: 'string' },
//           metadatas: {
//             label: 'Open',
//             searchable: false,
//             sortable: false,
//           },
//         });
//       }

//       return layout;
//     });

//     app.registerHook('CM/pages/ListView/mutate-rows', ({ rows, layout }) => {
//       return rows.map((row) => {
//         const id = row.id || row._id;
//         return {
//           ...row,
//           __open: `/content-manager/collectionType/${layout.uid}/${id}`,
//         };
//       });
//     });

//     app.registerComponent({
//       name: 'CellContent',
//       pluginId: 'content-manager',
//       type: 'customField',
//       component: OpenCell,
//       match: (props) => props.columnName === '__open',
//     });
//   },
// };

// export default plugin;
