import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Example: load lists on mount
  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      try {
        const [watchlistRes, favsRes] = await Promise.all([
          axios.get("/api/watchlist"),
          axios.get("/api/favourites"),
        ]);
        setWatchlist(watchlistRes.data);
        setFavourites(favsRes.data);
      } catch (err) {
        console.error("Error fetching lists", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  // Add/remove functions that update backend & state
  const addToWatchlist = async (movie) => {
    await axios.post("/api/watchlist", { movie });
    setWatchlist((wl) => [...wl, movie]);
  };

  const removeFromWatchlist = async (movieId) => {
    await axios.delete(`/api/watchlist/${movieId}`);
    setWatchlist((wl) => wl.filter((m) => m.id !== movieId));
  };

  const addToFavourites = async (movie) => {
    await axios.post("/api/favourites", { movie });
    setFavourites((fav) => [...fav, movie]);
  };

  const removeFromFavourites = async (movieId) => {
    await axios.delete(`/api/favourites/${movieId}`);
    setFavourites((fav) => fav.filter((m) => m.id !== movieId));
  };

  return (
    <UserContext.Provider
      value={{
        watchlist,
        favourites,
        loading,
        addToWatchlist,
        removeFromWatchlist,
        addToFavourites,
        removeFromFavourites,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
