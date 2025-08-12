import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";  // Import your AuthContext hook

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { user } = useAuth();  // Get logged-in user from AuthContext
    const token = user?.token;   // Assume user object has token from login

    const [watchlist, setWatchlist] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setWatchlist([]);
            setFavourites([]);
            return;
        }

        const fetchLists = async () => {
            setLoading(true);
            try {
                const [watchlistRes, favsRes] = await Promise.all([
                    axios.get("/api/watchlist", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("/api/favourites", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setWatchlist(watchlistRes.data.watchlist || []);
                setFavourites(favsRes.data.favourites || []);
            } catch (err) {
                console.error("Error fetching lists", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLists();
    }, [token]);

    const addToWatchlist = async (movie) => {
        if (!token) return;
        await axios.post(
            "/api/watchlist",
            { movie },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setWatchlist((wl) => [...wl, movie]);
    };

    const removeFromWatchlist = async (movieId) => {
        if (!token) return;
        await axios.delete(`/api/watchlist/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist((wl) => wl.filter((m) => m.id !== movieId));
    };

    const addToFavourites = async (movie) => {
        if (!token) return;
        await axios.post(
            "/api/favourites",
            { movie },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavourites((fav) => [...fav, movie]);
    };

    const removeFromFavourites = async (movieId) => {
        if (!token) return;
        await axios.delete(`/api/favourites/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
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
