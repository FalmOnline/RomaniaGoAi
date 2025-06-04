import slugify from 'slugify';

const updateTags = async ({ strapi }: { strapi: any }) => {
  console.log('🟢 Running updateTags script...');

  const tags = await strapi.entityService.findMany('api::tag.tag', {
    fields: ['id', 'title', 'category'],
    limit: 500,
  });

  for (const tag of tags) {
    const displayTitle = `${tag.title} [${tag.category}]`;
    const slug = slugify(tag.title, { lower: true });

    await strapi.entityService.update('api::tag.tag', tag.id, {
      data: { displayTitle, slug },
    });

    console.log(`✅ Updated: ${displayTitle}`);
  }

  console.log(`✅ All tags processed (${tags.length})`);
};

export default updateTags;
