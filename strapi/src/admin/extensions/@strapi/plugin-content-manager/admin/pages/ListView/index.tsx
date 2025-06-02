import React from 'react';
import { useCMListViewLayout } from '@strapi/plugin-content-manager/admin/hooks';
import { useParams } from 'react-router-dom';
import ListView from '@strapi/plugin-content-manager/admin/pages/ListView';

const CustomListView = (props) => {
  const { slug } = useParams();
  const { layout } = useCMListViewLayout();

  // Inject custom column once
  const customLayout = React.useMemo(() => {
    const alreadyInjected = layout.content.find(col => col.name === '__open');
    if (alreadyInjected) return layout;

    return {
      ...layout,
      content: [
        ...layout.content,
        {
          name: '__open',
          fieldSchema: { type: 'string' },
          metadatas: {
            label: 'Open',
            searchable: false,
            sortable: false,
          },
        },
      ],
    };
  }, [layout]);

  // Reformat rows to include a URL for the "open" column
  const customProps = {
    ...props,
    layout: customLayout,
    rows: props.rows?.map((row) => ({
      ...row,
      __open: `/content-manager/collectionType/${slug}/${row.id}`,
    })),
  };

  return <ListView {...customProps} />;
};

export default CustomListView;
