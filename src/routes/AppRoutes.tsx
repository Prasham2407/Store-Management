import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Layout from "../components/Layout";
import Login from "../pages/Login";
import SKUPage from "../pages/SKU";

// Lazy-loaded pages
const Store = lazy(() => import("../pages/Store"));
const Planning = lazy(() => import("../pages/Planning"));
const Charts = lazy(() => import("../pages/Charts"));

// Protected Route wrapper
const ProtectedLayout = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Layout />;
};

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/store" element={<Store />} />
          <Route path="sku" element={<SKUPage />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="*" element={<Navigate to="/store" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
