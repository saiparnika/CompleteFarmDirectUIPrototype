import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';

import Splash from './screens/auth/Splash';
import Login from './screens/auth/Login';
import RoleSelect from './screens/auth/RoleSelect';

import FarmerDashboard from './screens/farmer/Dashboard';
import AddProduct from './screens/farmer/AddProduct';
import FarmerProducts from './screens/farmer/Products';
import FarmerOrders from './screens/farmer/Orders';
import FarmerOrderDetail from './screens/farmer/OrderDetail';
import FarmerInsights from './screens/farmer/Insights';
import FarmerProfile from './screens/farmer/Profile';

import BuyerHome from './screens/buyer/Home';
import Marketplace from './screens/buyer/Marketplace';
import ProductDetail from './screens/buyer/ProductDetail';
import Cart from './screens/buyer/Cart';
import Checkout from './screens/buyer/Checkout';
import Confirmation from './screens/buyer/Confirmation';
import Tracking from './screens/buyer/Tracking';
import Review from './screens/buyer/Review';
import FarmerProfileBuyer from './screens/buyer/FarmerProfile';
import BulkRequirement from './screens/buyer/BulkRequirement';
import BulkMatch from './screens/buyer/BulkMatch';
import BuyerOrders from './screens/buyer/Orders';

import AdminDashboard from './screens/admin/Dashboard';
import AdminFarmers from './screens/admin/Farmers';
import AdminProducts from './screens/admin/Products';
import AdminOrders from './screens/admin/Orders';
import AdminAnalytics from './screens/admin/Analytics';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/role-select" element={<RoleSelect />} />

          {/* Farmer */}
          <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/add-product" element={<AddProduct />} />
            <Route path="/farmer/products" element={<FarmerProducts />} />
            <Route path="/farmer/orders" element={<FarmerOrders />} />
            <Route path="/farmer/orders/:id" element={<FarmerOrderDetail />} />
            <Route path="/farmer/insights" element={<FarmerInsights />} />
            <Route path="/farmer/profile" element={<FarmerProfile />} />
          </Route>

          {/* Buyer */}
          <Route element={<ProtectedRoute allowedRoles={['buyer', 'bulk_buyer']} />}>
            <Route path="/buyer/home" element={<BuyerHome />} />
            <Route path="/buyer/marketplace" element={<Marketplace />} />
            <Route path="/buyer/product/:id" element={<ProductDetail />} />
            <Route path="/buyer/cart" element={<Cart />} />
            <Route path="/buyer/checkout" element={<Checkout />} />
            <Route path="/buyer/confirmation" element={<Confirmation />} />
            <Route path="/buyer/tracking" element={<Tracking />} />
            <Route path="/buyer/review" element={<Review />} />
            <Route path="/buyer/farmer-profile/:id" element={<FarmerProfileBuyer />} />
            <Route path="/buyer/bulk" element={<BulkRequirement />} />
            <Route path="/buyer/bulk-match" element={<BulkMatch />} />
            <Route path="/buyer/orders" element={<BuyerOrders />} />
            <Route path="/buyer/favorites" element={<BuyerHome />} />
            <Route path="/buyer/profile" element={<FarmerProfileBuyer />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/farmers" element={<AdminFarmers />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
