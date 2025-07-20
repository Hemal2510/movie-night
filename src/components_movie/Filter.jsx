// 🔧 FiltersSidebar.jsx — Stylish Multi-Select Filters with Chips & Sliders

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FaFilter } from "react-icons/fa";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { FaGlobe, FaStar, FaCalendarAlt, FaTheaterMasks } from "react-icons/fa";

// 🎭 Genre Options
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

// 🌐 Language Options
const languageOptions = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Tamil", value: "ta" },
  { label: "Telugu", value: "te" },
  { label: "Malayalam", value: "ml" },
  { label: "Kannada", value: "kn" },
];




// 📺 OTT Platforms (India)
const ottOptions = [
  { label: "Netflix", value: "8" },
  { label: "Prime Video", value: "119" },
  { label: "Jio Hotstar", value: "2336" },
  { label: "Zee5", value: "372" },
  { label: "SonyLIV", value: "237" },
  { label: "Aha", value: "532"},
  { label: "Sun Nxt", value: "309"},
];




const FiltersSidebar = ({ filters, onChange }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedOtt, setSelectedOtt] = useState([]);

  // ✅ Handle Genre Chip Toggle
  const toggleGenre = (value) => {
    const updated = selectedGenres.includes(value)
      ? selectedGenres.filter((v) => v !== value)
      : [...selectedGenres, value];
    setSelectedGenres(updated);
    onChange("genre", updated.join(","));
  };

  // ✅ Handle Language Chip Toggle
  const toggleLanguage = (value) => {
    const updated = selectedLanguages.includes(value)
      ? selectedLanguages.filter((v) => v !== value)
      : [...selectedLanguages, value];
    setSelectedLanguages(updated);
    onChange("language", updated.join(","));
  };
  
  
  // ✅ Handle OTT Chip Toggle
  const toggleOtt = (value) => {
  const updated = selectedOtt.includes(value)
    ? selectedOtt.filter((v) => v !== value)
    : [...selectedOtt, value];
  setSelectedOtt(updated);
  onChange("ott", updated.join(","));
};

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black flex gap-2 items-center rounded-xl">
          <FaFilter /> Filters
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="bg-black text-white w-[300px] sm:w-[350px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-yellow-400 text-lg font-bold">🎯 Filter Movies</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-8">
          {/* 🎬 Genre Filter */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold">
              <FaTheaterMasks /> Genre
            </label>
            <div className="flex flex-wrap gap-2">
              {genreOptions.map((genre) => (
                <button
                  key={genre.value}
                  onClick={() => toggleGenre(genre.value)}
                  className={`px-3 py-1 rounded-full text-sm border transition duration-200 ${selectedGenres.includes(genre.value)
                    ? "bg-yellow-400 text-black"
                    : "border-yellow-400 text-yellow-400"}`}
                >
                  {genre.label}
                </button>
              ))}
            </div>
          </div>

          {/* 🌐 Language Filter */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold">
              <FaGlobe /> Language
            </label>
            <div className="flex flex-wrap gap-2">
              {languageOptions.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => toggleLanguage(lang.value)}
                  className={`px-3 py-1 rounded-full text-sm border transition duration-200 ${selectedLanguages.includes(lang.value)
                    ? "bg-yellow-400 text-black"
                    : "border-yellow-400 text-yellow-400"}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* 📺 OTT Platforms */}
<div>
  <label className="flex items-center gap-2 mb-2 font-semibold">
    <FaGlobe /> OTT Platforms
  </label>
  <div className="flex flex-wrap gap-2">
    {ottOptions.map((platform) => (
      <button
        key={platform.value}
        onClick={() => toggleOtt(platform.value)}
        className={`px-3 py-1 rounded-full text-sm border transition duration-200 ${
          selectedOtt.includes(platform.value)
            ? "bg-yellow-400 text-black"
            : "border-yellow-400 text-yellow-400"
        }`}
      >
        {platform.label}
      </button>
    ))}
  </div>
</div>

{/* ⭐ Min Rating Slider */}
<div>
  <label className="flex items-center gap-2 mb-2 font-semibold">
    <FaStar className="text-yellow-400" /> Min Rating
  </label>

  <Slider
    min={0}
    max={10}
    step={0.5}
    value={[filters.rating ? parseFloat(filters.rating) : 0]}
    onValueChange={(val) => onChange("rating", val[0])}
    className="relative flex w-full touch-none select-none items-center"
  >
    {/* Background track */}
    <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-800">
      {/* Golden filled portion */}
      <Slider.Range className="absolute h-full bg-yellow-400" />
    </Slider.Track>

    {/* Draggable thumb */}
    <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-yellow-300 bg-red-400 shadow transition hover:shadow-yellow-500" />
  </Slider>

  <p className="text-sm mt-1 text-gray-300">Selected: {filters.rating || 0}</p>
</div>



         {/* 📅 Year Dropdown */}
<div>
  <label className="flex items-center gap-2 mb-2 font-semibold  ">
    <FaCalendarAlt /> Release Year
  </label>
  <select
    value={filters.year}
    onChange={(e) => onChange("year", e.target.value)}
    className="w-full bg-black text-yellow-400 rounded-lg p-2"
  >
    <option value="">All</option>
    {Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 2025 - i).map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
</div>

        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersSidebar;