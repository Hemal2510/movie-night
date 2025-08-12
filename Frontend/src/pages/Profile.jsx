"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { urls } from "@/lib/api";

function MovieCard({
                       movie,
                       onAddToWatchlist,
                       onRemoveFromWatchlist,
                       onAddToFavourites,
                       onRemoveFromFavourites,
                       index,
                   }) {
    const ref = useRef(null);
    const inView = useInView(ref, { triggerOnce: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-4 py-2 border-b border-yellow-400 cursor-pointer"
        >
            <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="w-16 h-24 rounded object-cover shadow-md"
            />
            <div className="flex-1">
                <h4 className="text-lg font-semibold">{movie.title}</h4>
                <p className="text-yellow-400 text-sm">
                    ⭐ {movie.vote_average?.toFixed(1)}
                </p>
                <div className="flex space-x-3 mt-2">
                    {movie.inWatchlist ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFromWatchlist(movie.id);
                            }}
                            className="bg-yellow-400 text-black hover:bg-yellow-500"
                        >
                            Remove from Watchlist
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToWatchlist(movie.id);
                            }}
                            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                        >
                            Add to Watchlist
                        </Button>
                    )}

                    {movie.inFavourites ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFromFavourites(movie.id);
                            }}
                            className="bg-yellow-400 text-black hover:bg-yellow-500"
                        >
                            Remove from Favourites
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToFavourites(movie.id);
                            }}
                            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                        >
                            Add to Favourites
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const token = user?.token || "";

    // Profile states
    const [username, setUsername] = useState("");
    const [editingUsername, setEditingUsername] = useState(false);
    const [usernameInput, setUsernameInput] = useState("");
    const [uid, setUid] = useState("");
    const [email, setEmail] = useState("");

    // Movies & groups from backend
    const [favourites, setFavourites] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [groups, setGroups] = useState([]);

    const [loading, setLoading] = useState(true);
    const [savingUsername, setSavingUsername] = useState(false);

    // Fetch profile & lists
    useEffect(() => {
        if (!token) return;

        const fetchProfileData = async () => {
            try {
                setLoading(true);
                // Fetch user profile info
                const { data } = await axios.get(urls.profile, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Profile API response data:", data);

                const profile = data.profile || data;  // Fallback if profile key is missing

                setUsername(profile?.name || "");
                setUsernameInput(profile?.name || "");
                setUid(profile?.uid || "");
                setEmail(profile?.email || "");

                // Fetch watchlist, favourites & groups concurrently
                const [watchlistRes, favsRes, groupsRes] = await Promise.all([
                    axios.get(urls.watchlist, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(urls.favourites, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(urls.groups, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                const favouritesData = favsRes.data.favourites || [];
                const watchlistData = watchlistRes.data.watchlist || [];
                const groupsData = groupsRes.data.groups || [];

                // Create sets for quick lookup
                const favIds = new Set(favouritesData.map((m) => m.id));
                const watchIds = new Set(watchlistData.map((m) => m.id));

                // Add flags
                const watchlistWithFlags = watchlistData.map((movie) => ({
                    ...movie,
                    inFavourites: favIds.has(movie.id),
                    inWatchlist: true,
                }));

                const favouritesWithFlags = favouritesData.map((movie) => ({
                    ...movie,
                    inWatchlist: watchIds.has(movie.id),
                    inFavourites: true,
                }));

                setWatchlist(watchlistWithFlags);
                setFavourites(favouritesWithFlags);
                setGroups(groupsData);
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [token]);

    // Save username update
    const saveUsername = async () => {
        if (!usernameInput.trim()) return;
        try {
            setSavingUsername(true);
            await axios.put(
                urls.profile,
                { name: usernameInput.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsername(usernameInput.trim());
            setEditingUsername(false);
        } catch (error) {
            console.error("Failed to update username", error);
        } finally {
            setSavingUsername(false);
        }
    };

    // Handlers with checks to avoid duplicates
    const addToWatchlist = async (id) => {
        try {
            await axios.post(
                urls.watchlist,
                { movieId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const movieInFavs = favourites.find((m) => m.id === id);
            const movieInWatchlist = watchlist.find((m) => m.id === id);
            if (movieInFavs && !movieInWatchlist) {
                setWatchlist((wl) => [...wl, { ...movieInFavs, inWatchlist: true }]);
                setFavourites((favs) =>
                    favs.map((m) => (m.id === id ? { ...m, inWatchlist: true } : m))
                );
            }
        } catch (error) {
            console.error("Failed to add to watchlist", error);
        }
    };

    const removeFromWatchlist = async (id) => {
        try {
            await axios.delete(`${urls.watchlist}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWatchlist((wl) => wl.filter((m) => m.id !== id));
            setFavourites((favs) =>
                favs.map((m) => (m.id === id ? { ...m, inWatchlist: false } : m))
            );
        } catch (error) {
            console.error("Failed to remove from watchlist", error);
        }
    };

    const addToFavourites = async (id) => {
        try {
            await axios.post(
                urls.favourites,
                { movieId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const movieInWatchlist = watchlist.find((m) => m.id === id);
            const movieInFavourites = favourites.find((m) => m.id === id);

            if (movieInWatchlist && !movieInFavourites) {
                setFavourites((fav) => [...fav, { ...movieInWatchlist, inFavourites: true }]);
                setWatchlist((wlist) =>
                    wlist.map((m) => (m.id === id ? { ...m, inFavourites: true } : m))
                );
            }
        } catch (error) {
            console.error("Failed to add to favourites", error);
        }
    };

    const removeFromFavourites = async (id) => {
        try {
            await axios.delete(`${urls.favourites}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavourites((fav) => fav.filter((m) => m.id !== id));
            setWatchlist((wlist) =>
                wlist.map((m) => (m.id === id ? { ...m, inFavourites: false } : m))
            );
        } catch (error) {
            console.error("Failed to remove from favourites", error);
        }
    };

    if (loading)
        return (
            <div className="text-white p-8 text-center">Loading profile...</div>
        );

    return (
        <div className="min-h-screen bg-black text-white max-w-5xl mx-auto p-6 space-y-8">
            {/* Top: User Details */}
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                    <img
                        src={user?.profileImage || "https://i.pravatar.cc/150"}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
                    />
                    <button
                        className="absolute bottom-0 right-0 bg-yellow-400 text-black rounded-full p-1 hover:bg-yellow-500"
                        title="Change Profile Picture"
                    >
                        ✎
                    </button>
                </div>
                {!editingUsername ? (
                    <div className="flex items-center space-x-3">
                        <h2 className="text-3xl font-bold">{username}</h2>
                        <button
                            onClick={() => {
                                setUsernameInput(username);
                                setEditingUsername(true);
                            }}
                            className="text-yellow-400 hover:underline"
                            title="Edit Username"
                        >
                            ✎
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <input
                            className="border border-yellow-400 rounded px-2 py-1 bg-black text-yellow-400"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                        />
                        <Button
                            variant="default"
                            className="bg-yellow-400 text-black hover:bg-yellow-500"
                            onClick={saveUsername}
                            disabled={savingUsername}
                        >
                            {savingUsername ? "Saving..." : "Save"}
                        </Button>
                        <Button
                            variant="outline"
                            className="border-yellow-400 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                            onClick={() => {
                                setEditingUsername(false);
                                setUsernameInput(username);
                            }}
                            disabled={savingUsername}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
                <p className="text-yellow-400">UID: {uid}</p>
                <p className="text-yellow-400">Email: {email}</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="favourites" className="w-full">
                <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto border-b border-yellow-400">
                    <TabsTrigger className="text-yellow-400" value="favourites">
                        Favourites
                    </TabsTrigger>
                    <TabsTrigger className="text-yellow-400" value="watchlist">
                        Watchlist
                    </TabsTrigger>
                    <TabsTrigger className="text-yellow-400" value="groups">
                        Groups
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="favourites">
                    <Card className="bg-gray-900 border-yellow-400 max-h-96 overflow-y-auto">
                        <CardContent className="p-4 space-y-2">
                            {favourites.length === 0 ? (
                                <p>No favourites yet.</p>
                            ) : (
                                favourites.map((movie, index) => (
                                    <MovieCard
                                        key={movie.id}
                                        movie={movie}
                                        index={index}
                                        onAddToWatchlist={addToWatchlist}
                                        onRemoveFromWatchlist={removeFromWatchlist}
                                        onAddToFavourites={addToFavourites}
                                        onRemoveFromFavourites={removeFromFavourites}
                                    />
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="watchlist">
                    <Card className="bg-gray-900 border-yellow-400 max-h-96 overflow-y-auto">
                        <CardContent className="p-4 space-y-2">
                            {watchlist.length === 0 ? (
                                <p>No watchlist movies yet.</p>
                            ) : (
                                watchlist.map((movie, index) => (
                                    <MovieCard
                                        key={movie.id}
                                        movie={movie}
                                        index={index}
                                        onAddToWatchlist={addToWatchlist}
                                        onRemoveFromWatchlist={removeFromWatchlist}
                                        onAddToFavourites={addToFavourites}
                                        onRemoveFromFavourites={removeFromFavourites}
                                    />
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="groups">
                    <div className="max-h-96 overflow-y-auto space-y-4 px-4">
                        {groups.length === 0 ? (
                            <p>You are not part of any groups.</p>
                        ) : (
                            groups.map((group) => (
                                <motion.div
                                    key={group.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="bg-black/60 border border-yellow-400 rounded-xl p-4 shadow-lg flex flex-col justify-between"
                                    style={{ minHeight: "150px" }}
                                >
                                    <div>
                                        <h3 className="text-xl font-bold">{group.name}</h3>
                                        <p className="text-yellow-400">Admin: {group.admin}</p>
                                        {group.description && (
                                            <p className="italic text-yellow-300 mt-2">
                                                "{group.description}"
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="border-yellow-400 text-yellow-400 mt-4 hover:bg-yellow-400 hover:text-black"
                                    >
                                        View Group
                                    </Button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Taste Insights */}
            <Card className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-black">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Your Taste Insights</h3>
                    <p>
                        You seem to love <strong>Sci-Fi</strong>, <strong>Action</strong>, and{" "}
                        <strong>Drama</strong> movies. Keep exploring!
                    </p>
                </CardContent>
            </Card>

            {/* Bottom Actions */}
            <div className="flex justify-center space-x-4 pt-4 border-t border-yellow-400">
                <Button
                    variant="outline"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    onClick={() => alert("Change password feature coming soon!")}
                >
                    Change Password
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => alert("Delete account coming soon!")}
                >
                    Delete Account
                </Button>
                <Button
                    variant="secondary"
                    className="bg-yellow-400 text-black hover:bg-yellow-500"
                    onClick={logout}
                >
                    Logout
                </Button>
            </div>
        </div>
    );
}
