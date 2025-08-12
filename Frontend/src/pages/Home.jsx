import React, { useEffect, useState } from "react";
import axios from "axios";
import { urls } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
   DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const [trending, setTrending] = useState([]); // 🔄 Store trending movies
  const [selectedMovie, setSelectedMovie] = useState(null); // 🎬 Modal movie
  const [showDialog, setShowDialog] = useState(false); // 🔒 Login dialog state
  const { isLoggedIn, logout } = useAuth();
  const { user } = useAuth();
  const token = user?.token
  const [watchlist, setWatchlist] = useState([]);
const [favourites, setFavourites] = useState([]);

  
  
  



  // Genre list (same as Discover)
const genreOptions = [
  { label: "Action", value: "28" },
  { label: "Adventure", value: "12" },
  { label: "Animation", value: "16" },
  { label: "Comedy", value: "35" },
  { label: "Crime", value: "80" },
  { label: "Documentary", value: "99" },
  { label: "Drama", value: "18" },
  { label: "Family", value: "10751" },
  { label: "Fantasy", value: "14" },
  { label: "History", value: "36" },
  { label: "Horror", value: "27" },
  { label: "Music", value: "10402" },
  { label: "Mystery", value: "9648" },
  { label: "Romance", value: "10749" },
  { label: "Science Fiction", value: "878" },
  { label: "TV Movie", value: "10770" },
  { label: "Thriller", value: "53" },
  { label: "War", value: "10752" },
  { label: "Western", value: "37" },
];

// Favourites/Watchlist logic
const [refreshToggle, setRefreshToggle] = useState(false);

const isInWatchlist = (id) => watchlist.some((m) => m && m.id === id);
const isInFavourites = (id) => favourites.some((m) => m && m.id === id);



// Toggle watchlist 

const toggleWatchlist = async (movie) => {
  if (!isLoggedIn) {
    setShowDialog(true);
    return;
  }

  try {
    const exists = watchlist.some((m) => m.id === movie.id);

    if (exists) {
      await axios.delete(`${urls.watchlist}/${movie.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist((prev) => prev.filter((m) => m.id !== movie.id));
    } else {
      await axios.post(
        urls.watchlist,
        { movie },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchlist((prev) => [...prev, movie]);
    }
  } catch (error) {
    console.error("Failed to update watchlist:", error);
  }
};

//Toggle Favourite 


const toggleFavourites = async (movie) => {
  if (!isLoggedIn) {
    setShowDialog(true);
    return;
  }

  try {
    const exists = favourites.some((m) => m.id === movie.id);

    if (exists) {
      await axios.delete(`${urls.favourites}/${movie.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavourites((prev) => prev.filter((m) => m.id !== movie.id));
    } else {
      await axios.post(
        urls.favourites,
        { movie },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavourites((prev) => [...prev, movie]);
    }
  } catch (error) {
    console.error("Failed to update favourites:", error);
  }
};

useEffect(() => {
  if (isLoggedIn && token) {
    const fetchLists = async () => {
      try {
        const [watchlistRes, favouritesRes] = await Promise.all([
          axios.get(urls.watchlist, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(urls.favourites, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setWatchlist(watchlistRes.data.watchlist || []);
        setFavourites(favouritesRes.data.favourites || []);
      } catch (err) {
        console.error("Failed to fetch watchlist or favourites", err);
      }
    };
    fetchLists();
  } else {
    setWatchlist([]);
    setFavourites([]);
  }
}, [isLoggedIn, token]);



  const navigate = useNavigate();

  // 📡 Fetch trending movies on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(urls.trending);
        setTrending(res.data.results.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      }
    };
    fetchTrending();
  }, []);
const handleProtectedRoute = (route) => {
  if (route === "/discover" || route === "/home") {
    navigate(route);
    return;
  }
  if (isLoggedIn) {
    navigate(route);
  } else {
    setShowDialog(true);
  }
};


  return (
    <motion.div
      className="min-h-screen bg-black text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/assests/home.jpg')" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* 🧭 Navbar with login-aware route protection */}
      <header className="flex justify-between items-center px-6 py-4 bg-black/70 backdrop-blur-sm shadow-md">
        <h1 className="text-2xl font-bold">🍿 Movie Night</h1>
        <nav className="flex gap-6 items-center text-base">
          {[
            { label: "Home", route: "/home" },
            { label: "Discover", route: "/discover" },
            { label: "Watchlist", route: "/watchlist" },
            { label: "Favourites",route: "/favourite"},
            { label: "Planner", route: "/planner" },
          ].map(({ label, route }) => (
            <button
              key={label}
              onClick={() => handleProtectedRoute(route)}
              className="hover:text-yellow-400 transition-colors duration-200"
            >
              {label}
            </button>
          ))}
         <DropdownMenu>
  <DropdownMenuTrigger>
    <div className="w-8 h-8 bg-white rounded-full shadow cursor-pointer" />
  </DropdownMenuTrigger>
  <DropdownMenuContent className="bg-white text-black">
    {isLoggedIn ? (
      <>
        <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
        <DropdownMenuItem
          onClick={logout}
        >
          Logout
        </DropdownMenuItem>
      </>
    ) : (
      <>
        <DropdownMenuItem onClick={() => navigate("/login")}>Login</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/login", { state: { tab: "register" } })}>Register</DropdownMenuItem>
      </>
    )}
  </DropdownMenuContent>
</DropdownMenu>

        </nav>
      </header>

      {/* 🦸‍♂️ Hero CTA Section */}
      <section className="text-center px-4 pt-20 pb-10 bg-black/60">
        <motion.h2
          className="text-4xl md:text-6xl font-extrabold drop-shadow-lg"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Plan Your Perfect Movie Night 🎬
        </motion.h2>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Discover trending films, create a watchlist, and vote with friends.
        </p>
        <Button
          className="mt-10 px-6 py-4 text-lg rounded-xl bg-yellow-500 hover:bg-yellow-400 transition-colors"
          onClick={() => handleProtectedRoute("/discover")}
        >
          Get Started →
        </Button>
      </section>

      {/* 🔥 Trending Movies Grid */}
      <section className="px-6 pt-8 pb-10 bg-black bg-opacity-80">
        <h3 className="text-3xl font-semibold mb-6 text-center">
          🔥 Trending This Week
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {trending.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.05 }}
              className="relative min-w-[150px] max-w-[150px] cursor-pointer"
             onClick={() => setSelectedMovie(movie)}

            >
              <img
  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
  alt={movie.title}
  className="rounded-lg shadow-md"
/>

              <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-0.5 text-xs font-bold rounded">
                ⭐ {movie.vote_average.toFixed(1)}
              </div>
              <p className="mt-2 text-sm text-center">{movie.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💡 Feature Highlights (now interactive) */}
      <section className="py-16 px-6 bg-[#141414]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: "🎬", title: "Discover", route: "/discover", desc: "Find trending OTT films" },
            { icon: "✅", title: "Watchlist", route: "/watchlist", desc: "Save and organize picks" },
            { icon: "❤️", title: "Favorite",route:"/favourite",desc:"Saves favorite movies "},
            { icon: "🗳️", title: "Vote", route: "/planner", desc: "Decide with your group" },
            
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white/10 rounded-xl shadow-md hover:bg-yellow-500/10 transition cursor-pointer"
              onClick={() => handleProtectedRoute(item.route)}
            >
              <h4 className="text-2xl mb-2">{item.icon} {item.title}</h4>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🎬 Movie Description Modal */}
      
<Dialog open={!!selectedMovie} onOpenChange={() => setSelectedMovie(null)}>
  <DialogContent className="max-w-4xl bg-zinc-900 text-white p-6 rounded-xl border-zinc-900">
    {selectedMovie ? (
      <>
        <DialogTitle className="text-2xl mb-2 text-yellow-400">
          {selectedMovie.title}
        </DialogTitle>

        <div className="flex flex-col md:flex-row gap-6">
          {/* 🎬 Poster */}
          {selectedMovie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
              alt={selectedMovie.title}
              className="w-full md:w-1/3 h-80 object-contain rounded-lg"
            />
          )}

          {/* ℹ️ Info + Buttons Right Side */}
          <div className="flex-1 flex flex-col md:flex-row justify-between gap-6">
            {/* 📖 Info Section */}
            <div className="space-y-4 md:w-2/3">
              <p>{selectedMovie.overview || "No description available."}</p>

              {/* 📺 OTT Providers */}
              {selectedMovie.ott?.length > 0 ? (
                <div className="mt-4">
                  <p className="font-bold text-3xl text-yellow-300 mb-1">📺 Available On:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedMovie.ott.map((provider) => (
                      <li key={provider} className="text-white font-medium">
                        ✅ {provider}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-400 mt-4">📵 No OTT info available</p>
              )}

              {/* ⭐ Rating & 📅 Release */}
              <p className="text-3xl text-yellow-400">
                ⭐ {selectedMovie.vote_average?.toFixed(1)}
              </p>
              <p className="text-l text-gray-400">
                📅 {selectedMovie.release_date || "Unknown"}
              </p>

              {/* 🎭 Genre Chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedMovie.genre_ids?.map((id) => {
                  const genre = genreOptions.find((g) => g.value === String(id));
                  return (
                    <span
                      key={id}
                      className="px-2 py-1 rounded-full text-sm bg-yellow-600 text-black font-semibold"
                    >
                      {genre?.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* ❤️ Watchlist & Favourite Buttons */}
            <div className="flex flex-col gap-4 md:w-1/3">
              <Button
                variant="ghost"
                className="w-full text-yellow-400"
                onClick={() => toggleFavourites(selectedMovie)}
              >
                {isInFavourites(selectedMovie.id)
                  ? "Remove from Favourites"
                  : "Add to Favourites"}
              </Button>
              <Button
                variant="ghost"
                className="w-full text-yellow-400"
                onClick={() => toggleWatchlist(selectedMovie)}
              >
                {isInWatchlist(selectedMovie.id)
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"}
              </Button>
            </div>
          </div>
        </div>
      </>
    ) : null}
  </DialogContent>
</Dialog>


      {/* 🔒 Login Required Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-black text-white border-white max-w-sm">
          <DialogTitle>Please Login</DialogTitle>
          <DialogDescription className="text-gray-300">
            You need to login to use this feature.
          </DialogDescription>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              className="text-black"
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600"
              onClick={() => navigate("/login")}
            >
              Login Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Home;  