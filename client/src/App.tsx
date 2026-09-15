import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { CatPage } from "./pages/CatPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { MyCatsPage } from "./pages/MyCatsPage";
import { CreateCatPage } from "./pages/CreateCatPage";

function Layout() {
  return (
    <div className="flex h-dvh bg-amber-50">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center p-0 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/cat" replace />} />
          <Route path="/cat" element={<CatPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/mycats" element={<MyCatsPage />} />
          <Route path="/create-cat" element={<CreateCatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
