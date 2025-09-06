import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Backup from "./pages/Backup";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { AuthProvider } from "./context/auth";
import Protected from "./components/auth/Protected";
import { DataProvider } from "./context/data";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<AppLayout />}>
                <Route index element={<Protected><Dashboard /></Protected>} />
                <Route path="products" element={<Protected><Products /></Protected>} />
                <Route path="categories" element={<Protected roles={["owner","manager"]}><Categories /></Protected>} />
                <Route path="suppliers" element={<Protected roles={["owner","manager"]}><Suppliers /></Protected>} />
                <Route path="purchases" element={<Protected roles={["owner","manager"]}><Purchases /></Protected>} />
                <Route path="sales" element={<Protected><Sales /></Protected>} />
                <Route path="reports" element={<Protected roles={["owner","manager"]}><Reports /></Protected>} />
                <Route path="users" element={<Protected roles={["owner","manager"]}><Users /></Protected>} />
                <Route path="backup" element={<Protected roles={["owner","manager"]}><Backup /></Protected>} />
                <Route path="settings" element={<Protected roles={["owner","manager"]}><Settings /></Protected>} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
