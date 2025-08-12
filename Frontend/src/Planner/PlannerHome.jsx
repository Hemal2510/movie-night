import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import CreateGroup from "./CreateGroup";
import JoinGroupDialog from "./JoinGroupDialog";

const PlannerHome = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  const [groups, setGroups] = useState([
    {
      id: "grp-23842",
      name: "Movie Buffs",
      admin: "Hemal V",
      description: "Weekend binge group for Tamil and Malayalam thrillers",
      image: "",
    },
    {
      id: "grp-42910",
      name: "ChillZone",
      admin: "Aarav J.",
      description: "Just chill, vote, and stream!",
      image: "",
    },
  ]);

  // 🟡 Function to add a new group (called from CreateGroup dialog)
  const handleCreateGroup = (newGroup) => {
    const uniqueId = `grp-${Math.floor(Math.random() * 90000 + 10000)}`;
    const newEntry = {
      ...newGroup,
      id: uniqueId,
      admin: "You", // You can set real admin info here
    };
    setGroups((prev) => [...prev, newEntry]);
  };

  return (
    <motion.div
      className="min-h-screen text-white"
      style={{
        backgroundImage: "url('/assests/home.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-black/70 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/home")}
        >
          🍿 Movie Night
        </h1>
        <nav className="flex gap-6 items-center text-base">
          {["Home", "Discover", "Watchlist", "Favourite", "Planner"].map(
            (label) => (
              <button
                key={label}
                onClick={() => navigate(`/${label.toLowerCase()}`)}
                className="hover:text-yellow-400 transition-colors duration-200"
              >
                {label}
              </button>
            )
          )}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-8 h-8 bg-white rounded-full shadow cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black">
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.setItem("loggedIn", "false");
                      navigate("/login");
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate("/login")}>
                    Login
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate("/login", { state: { tab: "register" } })
                    }
                  >
                    Register
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>

      {/* Content */}
      <div className="px-6 py-10 min-h-screen bg-black/70">
        <h2 className="text-4xl font-bold text-center mb-10 text-yellow-400">
          🗓️ Movie Planner
        </h2>

        {groups.length === 0 ? (
          <div className="text-center space-y-6 mt-20">
            <p className="text-2xl text-gray-300">You are not in any groups.</p>
            <div className="flex justify-center gap-6">
              <CreateGroup onSubmit={handleCreateGroup} />
              <JoinGroupDialog />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl">
              {groups.map((group, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-[480px] bg-black/60 border border-yellow-400 rounded-xl p-4 shadow-lg flex flex-col justify-between h-64"
                >
                  <div>
                    <h3 className="text-xl font-bold">{group.name}</h3>
                    <p className="text-l text-gray-600">Admin: {group.admin}</p>
                    <p className="text-l text-gray-600">Group ID: {group.id}</p>
                    {group.description && (
                      <p className="italic text-gray-500 mt-2">
                        "{group.description}"
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => navigate(`/planner/group/${group.id}`)}
                    className="mt-auto bg-yellow-400 text-black w-full hover:bg-yellow-200"
                  >
                    View Group
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Button Row */}
            <div className="flex justify-center gap-6 mt-10">
              <CreateGroup onSubmit={handleCreateGroup} />
              <JoinGroupDialog />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlannerHome;
