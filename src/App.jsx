import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Discover from "@/pages/Discover";
import Watchlist from "./pages/WatchList";
import Favourite from "./pages/Favourite";
import Profile from "./pages/Profile";

// Later you'll add: Discover, Watchlist, Planner
// import Discover from "@/pages/Discover";
// import Watchlist from "@/pages/Watchlist";
// import Planner from "@/pages/Planner";

function App() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} /> {/* ✅ Moved inside */}
         <Route path="/discover" element={<Discover />} />
         <Route path="/watchlist" element={<Watchlist/>} />
         <Route path="/favourite" element={<Favourite/>} />
          <Route path="/profile" element={<Profile/>} />
      </Routes>
    </main>
  );
}

export default App;
