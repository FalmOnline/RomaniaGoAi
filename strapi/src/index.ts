
// This file is used to import the script to update the titleDisplay and slug in Tags.
// import updateTags from '../myscripts/update-tags';


export const exportedObject = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};


//This code is used to update displayTitle and slug in Tags using the file myscripts/update-tags.ts
// export default {
//   register() {},

//   async bootstrap({ strapi }: { strapi: any }) {
//     console.log('⚙️ Bootstrap started...');
//     try {
//       await updateTags({ strapi });
//     } catch (err) {
//       console.error('❌ Error while updating tags:', err);
//     }
//   },
// };