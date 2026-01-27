import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from 'components/ProtectedRoute';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - ecommerce
const ProductsPage = Loadable(lazy(() => import('pages/products')));
const ProductFormPage = Loadable(lazy(() => import('pages/products/form')));
const StockPage = Loadable(lazy(() => import('pages/stock')));
const StockFormPage = Loadable(lazy(() => import('pages/stock/form')));
const OrdersPage = Loadable(lazy(() => import('pages/orders')));
const CategoriesPage = Loadable(lazy(() => import('pages/categories')));
const CategoryFormPage = Loadable(lazy(() => import('pages/categories/form')));
const BrandsPage = Loadable(lazy(() => import('pages/brands')));
const BrandFormPage = Loadable(lazy(() => import('pages/brands/form')));
const SizesPage = Loadable(lazy(() => import('pages/sizes')));
const SizeFormPage = Loadable(lazy(() => import('pages/sizes/form')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
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
      children: [
        {
          index: true,
          element: <ProductsPage />
        },
        {
          path: 'new',
          element: <ProductFormPage />
        },
        {
          path: ':id/edit',
          element: <ProductFormPage />
        }
      ]
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
      children: [
        {
          index: true,
          element: <CategoriesPage />
        },
        {
          path: 'new',
          element: <CategoryFormPage />
        },
        {
          path: ':id/edit',
          element: <CategoryFormPage />
        }
      ]
    },
    {
      path: 'brands',
      children: [
        {
          index: true,
          element: <BrandsPage />
        },
        {
          path: 'new',
          element: <BrandFormPage />
        },
        {
          path: ':id/edit',
          element: <BrandFormPage />
        }
      ]
    },
    {
      path: 'sizes',
      children: [
        {
          index: true,
          element: <SizesPage />
        },
        {
          path: 'new',
          element: <SizeFormPage />
        },
        {
          path: ':id/edit',
          element: <SizeFormPage />
        }
      ]
    },
    {
      path: 'stock',
      children: [
        {
          index: true,
          element: <StockPage />
        },
        {
          path: 'new',
          element: <StockFormPage />
        },
        {
          path: ':id/edit',
          element: <StockFormPage />
        }
      ]
    }
  ]
};

export default MainRoutes;
