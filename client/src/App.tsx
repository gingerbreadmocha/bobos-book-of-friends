import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { CatPage } from "./pages/CatPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { MyCatsPage } from "./pages/MyCatsPage";
import { CreateCatPage } from "./pages/CreateCatPage";
import { UserProvider } from "./context/user-provider";

function Layout() {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row bg-amber-50">
      <Sidebar />
      {/* `main` is the scroll container; centering lives on an inner wrapper
          so overflowing content (e.g. the tall create-cat form) scrolls edge to
          edge instead of producing phantom whitespace below the page. */}
      <main className="flex-1 min-h-0 md:h-full">
        <div className="flex min-h-full items-center justify-center p-0 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/cat" replace />} />
            <Route path="/cat" element={<CatPage />} />
            <Route path="/cat/:catId" element={<CatPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/mycats" element={<MyCatsPage />} />
            <Route path="/create-cat" element={<CreateCatPage />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
