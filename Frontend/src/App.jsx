import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Discover from "@/pages/Discover";
import Watchlist from "./pages/WatchList";
import Favourite from "./pages/Favourite";
import Profile from "./pages/Profile";
import PlannerHome from "@/Planner/PlannerHome";
import ProtectedRoute from "./components_movie/ProtectedRoute";


function App() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/discover" element={<Discover />} />

        {/* Protected Pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/favourite" element={<Favourite />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/planner" element={<PlannerHome />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
