// ✅ Imports
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { urls } from "@/lib/api";
import { motion, useInView } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import FiltersSidebar from "@/components_movie/Filter";
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
  DialogHeader

} from "@/components/ui/dialog";

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

const isInWatchlist = (id) => {
  const list = JSON.parse(localStorage.getItem("watchlist") || "[]");
  return list.some((m) => m.id === id);
};


const isInFavourites = (id) => {
  const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
  return favs.some((m) => m.id === id);
};


// Child component for each movie card
const MovieCard = ({
  movie,
  index,
  onClick,
  isLoggedIn,
  onLoginPrompt,
  toggleFavourites,
  toggleWatchlist,
  isInFavourites,
  isInWatchlist,
}) => {
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { triggerOnce: true, margin: "-100px" });
  const cappedIndex = index % 6;
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isCardInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: cappedIndex*0.07 }}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-xl overflow-hidden shadow-lg bg-black/60 cursor-pointer"
      onClick={() => onClick(movie)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold">{movie.title}</h3>
        <p className="text-yellow-400 text-sm">⭐ {movie.vote_average?.toFixed(1)}</p>
      </div>
      <div className="flex justify-between items-center mt-2 px-2">
  <Button
    variant="ghost"
    size="sm"
    className="text-xs text-yellow-400"
    onClick={(e) => {
      e.stopPropagation();
      isLoggedIn ? toggleWatchlist(movie) : onLoginPrompt();
    }}
  >
    {isInWatchlist(movie.id) ? "★ Watchlist" : "+ Watchlist"}
  </Button>
  <Button
    variant="ghost"
    size="sm"
    className="text-xs text-yellow-400"
    onClick={(e) => {
      e.stopPropagation();
      isLoggedIn ? toggleFavourites(movie) : onLoginPrompt();
    }}
  >
    {isInFavourites(movie.id) ? "❤️ Favourite" : "+ Favourite"}
  </Button>
</div>

    </motion.div>
  );
};


const Discover = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ genre: "", language: "", rating: "", year: "", ott: "" });
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const navigate = useNavigate();
  // LocalStorage helpers
const getLocalList = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const saveLocalList = (key, list) => localStorage.setItem(key, JSON.stringify(list));
const [refreshToggle, setRefreshToggle] = useState(false);

const [showDialog, setShowDialog] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);


useEffect(() => {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  setIsLoggedIn(loggedIn);
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



const toggleFavourites = (movie) => {
  const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
  const exists = favs.find((m) => m.id === movie.id);
  const updated = exists
    ? favs.filter((m) => m.id !== movie.id)
    : [...favs, movie];
  localStorage.setItem("favourites", JSON.stringify(updated));
  setRefreshToggle((prev) => !prev); // trigger UI update
};




const toggleWatchlist = (movie) => {
  const list = JSON.parse(localStorage.getItem("watchlist") || "[]");
  const exists = list.find((m) => m.id === movie.id);
  const updated = exists
    ? list.filter((m) => m.id !== movie.id)
    : [...list, movie];

  localStorage.setItem("watchlist", JSON.stringify(updated));
  setRefreshToggle((prev) => !prev); // ✅ Trigger re-render
};





  // For Search BAR
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeout = useRef(null);

  // Modal + Trailer State
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Handle Movie Click (open modal)
  const handleMovieClick = async (movie) => {
    try {
      setSelectedMovie(null); // clear before loading

      const providerRes = await axios.get(urls.watchProviders(movie.id));
      const providers = providerRes.data?.results?.IN?.flatrate || [];

      const ottNames = providers.map((p) => p.provider_name);

      setSelectedMovie({ ...movie, ott: ottNames });
    } catch (err) {
      console.error("Error fetching watch providers:", err);
      setSelectedMovie({ ...movie, ott: [] });
    }
  };

  const handleFilterChange = (key, value) => {
    setPage(1);
    setMovies([]);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Main fetch
  useEffect(() => {
  const fetchMovies = async () => {
    try {
      setAnimationTrigger(false);

      // ✅ Search Query Logic (unchanged from your side)
      if (searchQuery.trim() !== "") {
        clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(async () => {
          try {
            const res = await axios.get(urls.search(searchQuery));
            let searchResults = res.data?.results || [];

            // 🔍 Apply filters manually
            const genreArr = filters.genre ? filters.genre.split(",") : [];
            const langArr = filters.language ? filters.language.split(",") : [];
            const ottArr = filters.ott ? filters.ott.split(",") : [];
            const rating = filters.rating;
            const year = filters.year;

            searchResults = searchResults.filter((movie) => {
              const matchGenre = genreArr.length
                ? movie.genre_ids?.some((id) => genreArr.includes(String(id)))
                : true;

              const matchLang = langArr.length
                ? langArr.includes(movie.original_language)
                : true;

              const matchYear = year ? movie.release_date?.startsWith(year) : true;
              const matchRating = rating ? movie.vote_average >= rating : true;

              return matchGenre && matchLang && matchYear && matchRating;
            });

            // 🔎 OTT filtering
            if (ottArr.length) {
              const movieWithOtt = await Promise.all(
                searchResults.map(async (m) => {
                  try {
                    const res = await axios.get(urls.watchProviders(m.id));
                    const providers = res.data?.results?.IN?.flatrate || [];
                    const providerIds = providers.map((p) => String(p.provider_id));
                    const matchesOtt = ottArr.some((id) => providerIds.includes(id));
                    return matchesOtt ? m : null;
                  } catch {
                    return null;
                  }
                })
              );

              searchResults = movieWithOtt.filter(Boolean);
            }

            // ✅ Final deduplication and sort
            const uniqueMovies = Array.from(
              new Map(searchResults.map((m) => [m.id, m])).values()
            );
            uniqueMovies.sort((a, b) => b.popularity - a.popularity);

            setMovies(uniqueMovies);
            setAnimationTrigger(true);
          } catch (err) {
            console.error("Search error:", err);
          }
        }, 500);

        return;
      }

      // ✅ DISCOVER API mode
      const noFilters =
        !filters.genre &&
        !filters.language &&
        !filters.rating &&
        !filters.year &&
        !filters.ott;

      if (noFilters) {
        const indianLangs = ["hi", "ta", "te", "ml", "kn"];
        const indianPromises = indianLangs.map((lang) =>
          axios.get(urls.discover(`with_original_language=${lang}&page=${page}`))
        );
        const globalPromise = axios.get(
          urls.discover(`sort_by=popularity.desc&page=${page}`)
        );
        const responses = await Promise.all([...indianPromises, globalPromise]);

        const indianMovies = responses
          .slice(0, indianLangs.length)
          .flatMap((res) => res.data?.results || []);
        const globalMovies = responses[indianLangs.length].data?.results || [];

        const mixedMovies = [];
        const maxLen = Math.max(indianMovies.length, globalMovies.length);
        for (let i = 0; i < maxLen; i++) {
          if (globalMovies[i]) mixedMovies.push(globalMovies[i]);
          if (indianMovies[i]) mixedMovies.push(indianMovies[i]);
        }

        const uniqueMovies = Array.from(
          new Map(mixedMovies.map((m) => [m.id, m])).values()
        );

        setMovies((prev) =>
          page === 1 ? uniqueMovies : [...prev, ...uniqueMovies]
        );
      } else {
        const genreArr = filters.genre ? filters.genre.split(",") : [];
        const langArr = filters.language ? filters.language.split(",") : [];
        const rating = filters.rating;
        const year = filters.year;
        const ottArr = filters.ott ? filters.ott.split(",") : [];

        const queries = [];
        const genreList = genreArr.length ? genreArr : [""];
        const langList = langArr.length ? langArr : [""];
        const ottList = ottArr.length ? ottArr : [""];

        for (const g of genreList) {
          for (const l of langList) {
            for (const o of ottList) {
              let query = "";
              if (g) query += `with_genres=${g}`;
              if (l) query += `${query ? "&" : ""}with_original_language=${l}`;
              if (o)
                query += `${query ? "&" : ""}with_watch_providers=${o}&watch_region=IN`;
              queries.push(query);
            }
          }
        }

        const fullQueries = queries.map((q) => {
          let fullQuery = `sort_by=popularity.desc&page=${page}&${q}`;
          if (rating) fullQuery += `&vote_average.gte=${rating}`;
          if (year) fullQuery += `&primary_release_year=${year}`;
          return fullQuery;
        });

        const responses = await Promise.all(
          fullQueries.map((q) => axios.get(urls.discover(q)))
        );

        const allResults = responses.flatMap((res) => res.data?.results || []);

        const deduplicated = Array.from(
          new Map(allResults.map((m) => [m.id, m])).values()
        );

        const seenIds = new Set(movies.map((m) => m.id));
        const newUniqueMovies = deduplicated.filter((m) => !seenIds.has(m.id));
        newUniqueMovies.forEach((m) => seenIds.add(m.id));
        newUniqueMovies.sort((a, b) => b.popularity - a.popularity);

        setMovies((prev) =>
          page === 1 ? newUniqueMovies : [...prev, ...newUniqueMovies]
        );
      }

      setTimeout(() => setAnimationTrigger(true), 100);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    }
  };

  fetchMovies();
  return () => clearTimeout(searchTimeout.current);
}, [page, filters, searchQuery]);

  // Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="min-h-screen text-white relative"
      style={{
        backgroundImage: "url('/assests/home.jpg')",
        backgroundSize: "100% auto",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-black/70 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/home")}>
          🍿 Movie Night
        </h1>
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
          onClick={() => {
            localStorage.setItem("loggedIn", "false");
            setIsLoggedIn(false); // ✅ updates UI without refresh
          }}
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

      {/* Main Content Area */}
      <div className="px-6 pt-10 pb-20 bg-black/60 min-h-screen">
        <h2 className="text-4xl font-bold text-center mb-10">Discover Movies 🎬</h2>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Input
            type="text"
            placeholder="Search movies..."
            className="w-full max-w-md rounded-xl bg-white text-black"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
              setMovies([]);
            }}
          />

          <FiltersSidebar filters={filters} onChange={handleFilterChange} />
        </div>

        {/* Movie Cards Container */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8">
          {movies.map((movie, index) => (
            <MovieCard
  key={movie.id}
  movie={movie}
  index={index}
  onClick={handleMovieClick}
  isLoggedIn={true} // or check localStorage.getItem("user")
  onLoginPrompt={() => toast.error("Please login first")}
  toggleFavourites={toggleFavourites}
  toggleWatchlist={toggleWatchlist}
  isInFavourites={isInFavourites}
  isInWatchlist={isInWatchlist}
/>

          ))}
        </div>
      </div>

      {/* Movie Info + Trailer Modal */}
      <Dialog open={!!selectedMovie} onOpenChange={() => setSelectedMovie(null)}>
  <DialogContent className="max-w-4xl bg-zinc-900 text-white p-6 rounded-xl border-zinc-900">
    {selectedMovie ? (
      <>
        <DialogHeader>
          <DialogTitle className="text-2xl mb-2 text-yellow-400">
            {selectedMovie.title}
          </DialogTitle>
        </DialogHeader>

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
            <div className="flex flex-col gap-4 md:w-1/3 ">
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

export default Discover;
