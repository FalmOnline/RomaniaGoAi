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
  Sparkles,
} from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../ui/ImageWithFallback";

interface DragState {
  isDragging: boolean;
  startX: number;
  scrollLeft: number;
  rowIndex: number;
  hasMoved: boolean; // Add this to track if actual dragging occurred
}

interface HeroSectionProps {
  onAttractionClick?: (attractionId: string) => void;
}

// Get shuffled content for each row to create variety
const getRowContent = (rowIndex: number) => {
  if (loading || allContent.length === 0) return [];

  const startOffset = rowIndex * 4;
  const rotated = [
    ...allContent.slice(startOffset),
    ...allContent.slice(0, startOffset),
  ];
  return rotated;
};

export default function HeroSearchV2({ onAttractionClick }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<ContentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [scrollPositions, setScrollPositions] = useState([0, 0, 0]);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
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

        const mapToItems = (arr: any[], type: ContentType) =>
          arr.map((item: any) => {
            console.log(item.image.url);
            console.log(process.env.NEXT_PUBLIC_STRAPI_URL);

            return {
              id: `${type}-${item.id}`,
              title: item.title || item.name || "Untitled",
              category: type,
              image: item.image?.url
                ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${item.image.url}`
                : "/placeholder.jpg",
              tags: Array.isArray(item.highlights)
                ? item.highlights.map((h: any) => h.title)
                : [],
              link: `/${type}s/${item.slug || item.id}`,
            };
          });

        const merged = [
          ...mapToItems(attractions, "attraction"),
          ...mapToItems(events, "event"),
          ...mapToItems(articles, "article"),
        ];

        // random order
        const shuffled = merged.sort(() => Math.random() - 0.5);
        console.log(shuffled);

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

        const formatted = matches.map((m: any) => ({
          id: m.id,
          title: m.metadata.title,
          category: m.metadata.category as ContentType,
          image: m.metadata.image || "/placeholder.jpg",
          tags: m.metadata.tags || [],
          link: m.metadata.link,
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

  // 🔹 Card Renderer
  const renderCard = (item: ContentItem) => (
    <motion.a
      href={item.link}
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#2c3e50]/5 hover:scale-105 hover:-translate-y-2 cursor-pointer basis-60 shrink-0"
    >
      <div className="relative h-48">
        <ImageWithFallback
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge
            className={`${getCategoryColor(item.category)} shadow-lg border-0`}
          >
            {getCategoryIcon(item.category)}
            <span className="ml-1 capitalize">{item.category}</span>
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <h4 className="mb-3 text-[#2c3e50] hover:text-[#8b1538] transition-colors">
          {item.title}
        </h4>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs border-[#2c3e50]/20 text-[#2c3e50]/70 hover:bg-[#f4e6e8] transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </motion.a>
  );

  const renderGalleryRow = (rowIndex: number) => {
    const rowContent = getRowContent(rowIndex);
    const isDraggingThisRow =
      dragState?.rowIndex === rowIndex && dragState?.isDragging;

    return (
      <div
        key={rowIndex}
        className={`flex items-center mb-8 ${isDraggingThisRow ? "cursor-grabbing" : "cursor-grab"} select-none`}
        style={{
          transform: `translateX(${scrollPositions[rowIndex]}px)`,
          transition: isDraggingThisRow ? "none" : "transform 0.1s ease-out",
        }}
        onMouseDown={(e) => handleMouseDown(e, rowIndex)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={(e) => handleTouchStart(e, rowIndex)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Create 5 copies to ensure seamless circular effect - this gives us enough buffer */}
        {[...Array(5)].map((_, copyIndex) => (
          <React.Fragment key={copyIndex}>
            {rowContent.map((item, index) => (
              <motion.div
                key={`row-${rowIndex}-${copyIndex}-${item.id}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: rowIndex * 0.2 + index * 0.05 }}
                className={`flex-shrink-0 bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#2c3e50]/5 ${
                  isDraggingThisRow
                    ? ""
                    : "hover:scale-105 hover:-translate-y-2 cursor-pointer"
                }`}
                style={{
                  width: `${cardWidth}px`,
                  marginRight: `${gapWidth}px`,
                }}
                onClick={(e) => {
                  console.log(
                    "Card div clicked, isDragging:",
                    isDraggingThisRow,
                    "hasMoved:",
                    dragState?.hasMoved,
                  );
                  handleCardClick(item, e);
                }}
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={`${getCategoryColor(item.category)} shadow-lg border-0`}
                    >
                      {getCategoryIcon(item.category)}
                      <span className="ml-1 capitalize">{item.category}</span>
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h4
                    className="mb-3 text-[#2c3e50] cursor-pointer hover:text-[#8b1538] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent double triggering
                      console.log("Title clicked:", item.title);
                      handleCardClick(item, e);
                    }}
                  >
                    {item.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-[#2c3e50]/20 text-[#2c3e50]/70 hover:bg-[#f4e6e8] transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] relative overflow-hidden">
      {/* 🔍 Search Bar */}
      <div className="relative z-10 pb-10 px-4">
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
                    {items.map(renderCard)}
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

      {/* ✨ Suggestion Rows (idle state) */}
      {!isSearching && (
        <div className="relative py-10 mx-auto space-y-12">
          <div className="relative py-10">
            <div className="space-y-0">
              {/* Carousel */}
              <div
                className="flex overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] 
                [&::-webkit-scrollbar]:hidden  ${isDraggingThisRow ? 'animate-none' : 'animate-spin'} motion-safe:animate-[_20s_linear_infinite]"
              >
                {/* Row 1 - scrolls left slowly */}
                {/* Group 1*/}
                <div className="flex gap-4">
                  {suggestionRows.slice(0, 9).map(renderCard)}
                </div>
                {/* Group 2*/}
                <div className="flex gap-4">
                  {suggestionRows.slice(0, 9).map(renderCard)}
                </div>
              </div>

              {/* Row 2 - scrolls right slowly */}
              <div className="overflow-hidden">
                {suggestionRows.slice(10, 19).map(renderCard)}
              </div>

              {/* Row 3 - scrolls left slightly faster */}
              <div className="overflow-hidden">
                {suggestionRows.slice(20, 29).map(renderCard)}
              </div>
            </div>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestionRows.slice(0, 9).map(renderCard)}
          </div> */}
        </div>
      )}
    </div>
  );
}
