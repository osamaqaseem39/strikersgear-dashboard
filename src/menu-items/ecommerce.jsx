// assets
import {
  ShoppingOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';

// icons
const icons = {
  ShoppingOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagOutlined,
  OrderedListOutlined,
};

// ==============================|| MENU ITEMS - ECOMMERCE ||============================== //

const ecommerce = {
  id: 'group-ecommerce',
  title: 'E-Commerce',
  type: 'group',
  children: [
    {
      id: 'products',
      title: 'Products',
      type: 'item',
      url: '/products',
      icon: icons.ShoppingOutlined,
      breadcrumbs: false,
    },
    {
      id: 'stock',
      title: 'Stock Management',
      type: 'item',
      url: '/stock',
      icon: icons.InboxOutlined,
      breadcrumbs: false,
    },
    {
      id: 'orders',
      title: 'Orders',
      type: 'item',
      url: '/orders',
      icon: icons.ShoppingCartOutlined,
      breadcrumbs: false,
    },
    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/categories',
      icon: icons.AppstoreOutlined,
      breadcrumbs: false,
    },
    {
      id: 'brands',
      title: 'Brands',
      type: 'item',
      url: '/brands',
      icon: icons.TagOutlined,
      breadcrumbs: false,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      type: 'item',
      url: '/sizes',
      icon: icons.OrderedListOutlined,
      breadcrumbs: false,
    },
  ],
};

export default ecommerce;
