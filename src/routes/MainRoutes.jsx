import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// render - ecommerce
const ProductsPage = Loadable(lazy(() => import('pages/products')));
const StockPage = Loadable(lazy(() => import('pages/stock')));
const OrdersPage = Loadable(lazy(() => import('pages/orders')));
const CategoriesPage = Loadable(lazy(() => import('pages/categories')));
const BrandsPage = Loadable(lazy(() => import('pages/brands')));
const SizesPage = Loadable(lazy(() => import('pages/sizes')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'products',
      element: <ProductsPage />
    },
    {
      path: 'stock',
      element: <StockPage />
    },
    {
      path: 'orders',
      element: <OrdersPage />
    },
    {
      path: 'categories',
      element: <CategoriesPage />
    },
    {
      path: 'brands',
      element: <BrandsPage />
    },
    {
      path: 'sizes',
      element: <SizesPage />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
