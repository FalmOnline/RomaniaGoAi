'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Calendar, FileText, Mic, SlidersHorizontal, X, Sparkles } from 'lucide-react'
import { Input } from './../ui/input'
import { Badge } from './../ui/badge'
import { ImageWithFallback } from './../ui/ImageWithFallback'

type ContentType = 'attraction' | 'event' | 'article'

interface ContentItem {
  id: string
  title: string
  category: ContentType
  image: string
  tags: string[]
  link?: string
}

interface DragState {
  isDragging: boolean
  startX: number
  scrollLeft: number
  rowIndex: number
  hasMoved: boolean
}

interface HeroSectionProps {
  onAttractionClick?: (attractionId: string) => void
}

/* ---------------- Helpers ---------------- */

const getCategoryIcon = (category: ContentType) => {
  switch (category) {
    case 'attraction': return <MapPin className="w-4 h-4" />
    case 'event': return <Calendar className="w-4 h-4" />
    case 'article': return <FileText className="w-4 h-4" />
  }
}

const getCategoryColor = (category: ContentType) => {
  switch (category) {
    case 'attraction': return 'bg-[#16a085] text-white'
    case 'event': return 'bg-[#f5a623] text-white'
    case 'article': return 'bg-[#8b1538] text-white'
  }
}

/* ------------- Reusable Card ------------- */

type CardProps = {
  item: ContentItem
  className?: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent) => void
}

const Card: React.FC<CardProps> = ({ item, className, style, onClick }) => (
  <motion.a
    href={item.link}
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#2c3e50]/5 hover:scale-105 hover:-translate-y-2 cursor-pointer ${className ?? ''}`}
    style={style}
  >
    <div className="relative h-48">
      <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
      <div className="absolute top-3 right-3">
        <Badge className={`${getCategoryColor(item.category)} shadow-lg border-0`}>
          {getCategoryIcon(item.category)}
          <span className="ml-1 capitalize">{item.category}</span>
        </Badge>
      </div>
    </div>
    <div className="p-5">
      <h4 className="mb-3 text-[#2c3e50] hover:text-[#8b1538] transition-colors">{item.title}</h4>
      <div className="flex flex-wrap gap-2">
        {item.tags.map(tag => (
          <Badge key={tag} variant="outline" className="text-xs border-[#2c3e50]/20 text-[#2c3e50]/70 hover:bg-[#f4e6e8] transition-colors">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  </motion.a>
)

/* --------------- Component ---------------- */

export default function HeroSearch({ onAttractionClick }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState<ContentItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [suggestionRows, setSuggestionRows] = useState<ContentItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Carousel state
  const [scrollPositions, setScrollPositions] = useState<[number, number, number]>([0, 0, 0])
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  // layout constants
  const cardWidth = 320
  const gapWidth = 24
  const cardWithGap = cardWidth + gapWidth

  /* ------------ Fetch featured content ------------ */
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const [attractionsRes, eventsRes, articlesRes] = await Promise.all([
          fetch('http://localhost:5000/api/attractions'),
          fetch('http://localhost:5000/api/events'),
          fetch('http://localhost:5000/api/articles'),
        ])

        const [attractions, events, articles] = await Promise.all([
          attractionsRes.json(),
          eventsRes.json(),
          articlesRes.json(),
        ])

        const mapToItems = (arr: any[], type: ContentType): ContentItem[] =>
          (arr || []).map((item: any) => ({
            id: `${type}-${item.id}`,
            title: item.title || item.name || 'Untitled',
            category: type,
            image: item.image?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${item.image.url}`
              : '/placeholder.jpg',
            tags: Array.isArray(item.highlights) ? item.highlights.map((h: any) => h.title) : [],
            link: `/${type}s/${item.slug || item.id}`,
          }))

        const merged = [
          ...mapToItems(attractions, 'attraction'),
          ...mapToItems(events, 'event'),
          ...mapToItems(articles, 'article'),
        ]

        // shuffle for variety
        const shuffled = [...merged].sort(() => Math.random() - 0.5)
        setSuggestionRows(shuffled)
      } catch (err) {
        console.error('Failed to fetch suggestion rows', err)
      }
    }
    fetchSuggestions()
  }, [])

  /* ---------------- Pinecone search ---------------- */
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setFilteredData([])
        setIsSearching(false)
        return
      }
      try {
        const response = await fetch('http://localhost:5000/api/search-embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery }),
        })
        const { matches } = await response.json()

        const formatted = (matches || []).map((m: any) => ({
          id: m.id,
          title: m.metadata.title,
          category: m.metadata.category as ContentType,
          image: m.metadata.image || '/placeholder.jpg',
          tags: m.metadata.tags || [],
          link: m.metadata.link,
        }))

        setFilteredData(formatted)
        setIsSearching(true)
      } catch (err) {
        console.error('Search error:', err)
      }
    }

    const debounce = setTimeout(fetchResults, 400)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  const groupedResults = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {} as Record<ContentType, ContentItem[]>)
  }, [filteredData])

  /* --------- Carousel: build row content --------- */
  const getRowContent = (rowIndex: number) => {
    // spread items across rows for a magazine feel
    const items = suggestionRows.filter((_, idx) => idx % 3 === rowIndex)
    // duplicate a few for smoother long rows if needed
    return items.concat(items.slice(0, Math.max(0, 6 - items.length)))
  }

  /* ------------- Auto-scroll (ping-pong) ------------- */
  useEffect(() => {
    if (isUserInteracting || suggestionRows.length === 0) return

    const speeds = [0.6, 0.4, 0.8] // per row
    const dir: (1 | -1)[] = [1, -1, 1] // right / left

    let raf = 0
    const tick = () => {
      setScrollPositions(prev => {
        const next = [...prev] as [number, number, number]

        for (let i = 0; i < 3; i++) {
          const rowItems = getRowContent(i)
          const trackWidth = rowItems.length * cardWithGap
          const viewport = typeof window !== 'undefined' ? Math.min(window.innerWidth, 1200) : 1024 // rough cap
          const max = Math.max(trackWidth - viewport, 0)

          let p = next[i] + speeds[i] * dir[i]
          if (p <= 0) { p = 0; dir[i] = 1 }
          if (p >= max) { p = max; dir[i] = -1 }
          next[i] = p
        }
        return next
      })
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestionRows.length, isUserInteracting])

  /* ---------------- Drag handlers ---------------- */
  const handleMouseDown = (e: React.MouseEvent, rowIndex: number) => {
    setIsUserInteracting(true)
    setDragState({
      isDragging: true,
      startX: e.pageX,
      scrollLeft: scrollPositions[rowIndex],
      rowIndex,
      hasMoved: false,
    })
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState?.isDragging) return
    const walk = (e.pageX - dragState.startX) * 2
    if (Math.abs(walk) > 5 && !dragState.hasMoved) {
      setDragState(prev => (prev ? { ...prev, hasMoved: true } : prev))
    }

    const newPos = dragState.scrollLeft - walk // negative because we translateX(-pos)
    setScrollPositions(prev => {
      const next = [...prev] as [number, number, number]
      next[dragState.rowIndex] = Math.max(0, newPos)
      return next
    })
  }

  const handleMouseUp = () => {
    if (dragState) {
      setTimeout(() => {
        setDragState(null)
        setTimeout(() => setIsUserInteracting(false), 800)
      }, 80)
    }
  }

  const handleTouchStart = (e: React.TouchEvent, rowIndex: number) => {
    setIsUserInteracting(true)
    const touch = e.touches[0]
    setDragState({
      isDragging: true,
      startX: touch.pageX,
      scrollLeft: scrollPositions[rowIndex],
      rowIndex,
      hasMoved: false,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragState?.isDragging) return
    const touch = e.touches[0]
    const walk = (touch.pageX - dragState.startX) * 2
    if (Math.abs(walk) > 5 && !dragState.hasMoved) {
      setDragState(prev => (prev ? { ...prev, hasMoved: true } : prev))
    }
    const newPos = dragState.scrollLeft - walk
    setScrollPositions(prev => {
      const next = [...prev] as [number, number, number]
      next[dragState.rowIndex] = Math.max(0, newPos)
      return next
    })
  }

  const handleTouchEnd = () => {
    if (dragState) {
      setTimeout(() => {
        setDragState(null)
        setTimeout(() => setIsUserInteracting(false), 800)
      }, 80)
    }
  }

  /* ------------- Row using the Card component ------------- */
  const renderGalleryRow = (rowIndex: number) => {
    const rowContent = getRowContent(rowIndex)
    const isDraggingThisRow = dragState?.rowIndex === rowIndex && dragState?.isDragging

    return (
      <div
        key={rowIndex}
        className={`overflow-hidden mb-8`}
        onMouseDown={(e) => handleMouseDown(e, rowIndex)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={(e) => handleTouchStart(e, rowIndex)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`${isDraggingThisRow ? 'cursor-grabbing' : 'cursor-grab'} select-none flex`}
          style={{
            transform: `translateX(${-scrollPositions[rowIndex]}px)`,
            transition: isDraggingThisRow ? 'none' : 'transform 0.1s ease-out',
            gap: `${gapWidth}px`,
          }}
        >
          {/* repeat content a few times to ensure long track */}
          {[...Array(4)].map((_, copyIndex) => (
            <React.Fragment key={copyIndex}>
              {rowContent.map((item, index) => (
                <Card
                  key={`row-${rowIndex}-${copyIndex}-${item.id}-${index}`}
                  item={item}
                  className={`${isDraggingThisRow ? '' : 'hover:scale-105 hover:-translate-y-2'} flex-none`}
                  style={{ width: `${cardWidth}px` }}
                  onClick={(e) => {
                    if (isDraggingThisRow || dragState?.hasMoved) {
                      e.preventDefault()
                      return
                    }
                    // optional: specific click behavior
                    if (item.category === 'attraction' && onAttractionClick) onAttractionClick(item.id)
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-[#faf7f2] relative overflow-hidden">
      {/* Search Bar */}
      <div className="relative z-10 pb-10 px-4">
        <div className="max-w-8xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="flex items-center rounded-3xl px-5 bg-gradient-to-r from-[#E8EFEE]/50 to-[#E8EFEE]/20 shadow-md gap-2 hover:shadow-xl">
              <Search className="text-black" size={30} strokeWidth={1} aria-hidden="true" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for castles, mountains, cities, experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-2 pr-6 py-7 !text-base bg-transparent border-hidden focus-visible:ring-0 rounded-3xl transition-all duration-300 text-[#2c3e50] placeholder:text-rg-black-50 placeholder:text-base"
              />
              <div className='flex items-center gap-3'>
                {searchQuery && (
                  <X
                    onClick={() => setSearchQuery("")}
                    className="cursor-pointer text-rg-primary-red hover:text-gray-600"
                    size={30} strokeWidth={1}
                    aria-label="Clear search"
                  />
                )}
                <Mic size={30} strokeWidth={1} className="text-black w-6 h-6" />
                <MapPin size={30} strokeWidth={1} className="text-black w-6 h-6" />
                <SlidersHorizontal size={30} strokeWidth={1} className="text-black w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search Results */}
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
                    <Badge className="bg-[#16a085] text-white">{items.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                      <Card key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
              {filteredData.length === 0 && searchQuery && (
                <div className="text-center py-16">
                  <p className="text-[#2c3e50]/60 text-lg">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions: 3 auto-scrolling rows */}
      {!isSearching && (
        <div className="relative py-10 max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6 text-gray-700">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold">Suggestions for you</h3>
          </div>
          {renderGalleryRow(0)}
          {renderGalleryRow(1)}
          {renderGalleryRow(2)}
        </div>
      )}
    </div>
  )
}
