"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  FileText,
  Mic,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import Card from "../ui/Card";

// Types
type ContentType = "attraction" | "event" | "article";

interface ContentItem {
  id: string;
  title: string;
  category: ContentType;
  image: string;
  tags: string[];
  link: string;
  slug: string;
  location?: string;
  rating?: string;
  peopleRating?: string;
  description?: string;
  duration?: string;
  numberVisitors?: string;
}

interface HeroSectionProps {
  onAttractionClick?: (attractionId: string) => void;
}

// Helper functions
const getCategoryIcon = (category: ContentType) => {
  const icons = {
    attraction: <MapPin size={18} />,
    event: <Calendar size={18} />,
    article: <FileText size={18} />,
  };
  return icons[category];
};

// Carousel Row Component
interface CarouselRowProps {
  items: ContentItem[];
  direction: "left" | "right";
  duration?: string;
}

const CarouselRow: React.FC<CarouselRowProps> = ({
  items,
  direction,
  duration = "90s",
}) => {
  const animationClass =
    direction === "left" ? "animate-scroll-left" : "animate-scroll-right";
  const rowRef = useRef<HTMLDivElement>(null);

  // Triple the items for seamless infinite scroll
  const tripledItems = [...items, ...items, ...items];

  // Handle horizontal scroll with mouse wheel
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const handleWheel = (e: WheelEvent) => {
      // Only handle native horizontal scroll (deltaX) from mice with side/tilt wheels
      // This allows users to scroll down the page normally with vertical scroll
      if (e.deltaX !== 0) {
        e.preventDefault();
        row.scrollLeft += e.deltaX;
      }
    };

    row.addEventListener("wheel", handleWheel, { passive: false });
    return () => row.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={rowRef}
      className="relative w-full overflow-x-auto overflow-y-hidden pb-6 carousel-row [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        className={`flex gap-5 w-max ${animationClass}`}
        style={
          {
            "--duration": duration,
            backfaceVisibility: "hidden",
            perspective: "1000px",
          } as React.CSSProperties
        }
      >
        {tripledItems.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex-shrink-0">
            <Card
              title={item.title}
              image={item.image}
              category={item.category}
              location={item.location || ""}
              rating={item.rating || ""}
              peopleRating={item.peopleRating || ""}
              description={item.description || ""}
              duration={item.duration || ""}
              numberVisitors={item.numberVisitors || ""}
              tags={item.tags}
              slug={item.slug}
              variant="minimal"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HeroSearchV2({ onAttractionClick }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<ContentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestionRows, setSuggestionRows] = useState<ContentItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  // 🔹 Fetch featured content (for suggestions, when not searching)
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const [attractionsRes, eventsRes, articlesRes] = await Promise.all([
          fetch("http://localhost:5000/api/attractions"),
          fetch("http://localhost:5000/api/events"),
          fetch("http://localhost:5000/api/articles"),
        ]);

        const [attractions, events, articles] = await Promise.all([
          attractionsRes.json(),
          eventsRes.json(),
          articlesRes.json(),
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapToItems = (arr: any[], type: ContentType): ContentItem[] =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          arr.map((item: any) => ({
            id: `${type}-${item.id}`,
            title: item.title || item.name || "Untitled",
            category: type,
            image: item.image?.url || "/placeholder.jpg",
            tags: Array.isArray(item.highlights)
              ? item.highlights.map((h: any) => h.title)
              : [],
            link: `/${type}s/${item.slug || item.id}`,
            slug: item.slug || item.id,
            location: item.locations?.[0]?.title || "",
            rating: item.rating?.toString() || "",
            peopleRating: item.peopleRating?.toString() || "",
            description: item.shortDescription || "",
            duration: item.duration || "",
            numberVisitors: item.numberVisitors?.toString() || "",
          }));

        const merged = [
          ...mapToItems(attractions, "attraction"),
          ...mapToItems(events, "event"),
          ...mapToItems(articles, "article"),
        ];

        // Random order
        const shuffled = merged.sort(() => Math.random() - 0.5);
        setSuggestionRows(shuffled);
      } catch (err) {
        console.error("Failed to fetch suggestion rows", err);
      }
    };
    fetchSuggestions();
  }, []);

  // 🔹 Query Pinecone when typing
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setFilteredData([]);
        setIsSearching(false);
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:5000/api/search-embeddings",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: searchQuery }),
          },
        );
        const { matches } = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatted: ContentItem[] = matches.map((m: any) => ({
          id: m.id,
          title: m.metadata.title,
          category: m.metadata.category as ContentType,
          image: m.metadata.image || "/placeholder.jpg",
          tags: m.metadata.tags || [],
          link: m.metadata.link,
          slug: m.metadata.slug || m.id,
          location: m.metadata.location || "",
          rating: m.metadata.rating || "",
          peopleRating: m.metadata.peopleRating || "",
          description: m.metadata.description || "",
          duration: m.metadata.duration || "",
          numberVisitors: m.metadata.numberVisitors || "",
        }));

        setFilteredData(formatted);
        setIsSearching(true);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const debounce = setTimeout(fetchResults, 400);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // 🔹 Group results by category
  const groupedResults = filteredData.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<ContentType, ContentItem[]>,
  );

  // Split suggestions into three rows
  const row1 = suggestionRows.slice(0, 9);
  const row2 = suggestionRows.slice(9, 18);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 🔍 Search Bar */}
      <div className="relative z-40 pb-2 px-4">
        <div className="max-w-8xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="flex items-center rounded-3xl px-5 bg-gradient-to-r from-[#E8EFEE]/50 to-[#E8EFEE]/20 shadow-md gap-2 hover:shadow-xl">
              <Search
                className="text-black"
                size={30}
                strokeWidth={1}
                aria-hidden="true"
              />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for castles, mountains, cities, experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                className="pl-2 pr-6 py-7 !text-base bg-transparent border-hidden focus-visible:ring-0 rounded-3xl transition-all duration-300 text-[#2c3e50] placeholder:text-rg-black-50 placeholder:text-base"
              />
              <div className="flex items-center gap-3">
                {searchQuery && (
                  <X
                    onClick={() => setSearchQuery("")}
                    className="cursor-pointer text-rg-primary-red hover:text-gray-600"
                    size={30}
                    strokeWidth={1}
                    aria-label="Clear search"
                  />
                )}
                <Mic size={30} strokeWidth={1} className="text-black w-6 h-6" />
                <MapPin
                  size={30}
                  strokeWidth={1}
                  className="text-black w-6 h-6"
                />
                <SlidersHorizontal
                  size={30}
                  strokeWidth={1}
                  className="text-black w-6 h-6"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 🔎 Search Results */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 px-4 pb-10"
          >
            <div className="max-w-6xl mx-auto">
              {Object.entries(groupedResults).map(([category, items]) => (
                <div key={category} className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    {getCategoryIcon(category as ContentType)}
                    <h3 className="text-[#2c3e50] capitalize">{category}s</h3>
                    <Badge className="bg-[#16a085] text-white">
                      {items.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <Card
                        key={item.id}
                        title={item.title}
                        image={item.image}
                        category={item.category}
                        location={item.location || ""}
                        rating={item.rating || ""}
                        peopleRating={item.peopleRating || ""}
                        description={item.description || ""}
                        duration={item.duration || ""}
                        numberVisitors={item.numberVisitors || ""}
                        tags={item.tags}
                        slug={item.slug}
                        variant="minimal"
                      />
                    ))}
                  </div>
                </div>
              ))}
              {filteredData.length === 0 && searchQuery && (
                <div className="text-center py-16">
                  <p className="text-[#2c3e50]/60 text-lg">
                    No results found for "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✨ Infinite Carousel (idle state) */}
      {!isSearching && suggestionRows.length > 0 && (
        <div className="relative">
          {/* Row 1 - scrolls left */}
          <CarouselRow items={row1} direction="left" duration="380s" />

          {/* Row 2 - scrolls right */}
          <CarouselRow items={row2} direction="right" duration="380s" />
        </div>
      )}
    </div>
  );
}
