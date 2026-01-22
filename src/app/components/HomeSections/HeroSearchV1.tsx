// 'use client'

// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Search, MapPin, Calendar, FileText, Mic, SlidersHorizontal, X } from 'lucide-react';
// import { Input } from './../ui/input';
// import { Badge } from './../ui/badge';
// import { ImageWithFallback } from './../ui/ImageWithFallback';

// type ContentType = 'attraction' | 'event' | 'article'

// interface ContentItem {
//   id: string
//   title: string
//   category: ContentType
//   image: string
//   tags: string[]
// }

// interface DragState {
//   isDragging: boolean
//   startX: number
//   scrollLeft: number
//   rowIndex: number
//   hasMoved: boolean // Add this to track if actual dragging occurred
// }

// interface HeroSectionProps {
//   onAttractionClick?: (attractionId: string) => void
// }

// const mockData: ContentItem[] = [
//   {
//     id: '1',
//     title: 'Bran Castle',
//     category: 'attraction',
//     image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
//     tags: ['historic', 'culture', 'mountains']
//   },
//   {
//     id: '2',
//     title: 'Carpathian Mountains Hiking',
//     category: 'event',
//     image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
//     tags: ['mountains', 'adventure', 'nature']
//   },
//   {
//     id: '3',
//     title: 'Traditional Romanian Cuisine Guide',
//     category: 'article',
//     image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
//     tags: ['culture', 'food', 'traditions']
//   },
//   {
//     id: 'peles-castle',
//     title: 'Peles Castle',
//     category: 'attraction',
//     image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400&h=300&fit=crop',
//     tags: ['historic', 'architecture', 'royal']
//   },
//   {
//     id: '5',
//     title: 'Brasov Medieval Festival',
//     category: 'event',
//     image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop',
//     tags: ['culture', 'festival', 'family']
//   },
//   {
//     id: '6',
//     title: 'Danube Delta Wildlife',
//     category: 'attraction',
//     image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
//     tags: ['nature', 'wildlife', 'diversity']
//   },
//   {
//     id: '7',
//     title: 'Romanian Folk Music Heritage',
//     category: 'article',
//     image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
//     tags: ['culture', 'music', 'traditions']
//   },
//   {
//     id: '8',
//     title: 'Sibiu Christmas Market',
//     category: 'event',
//     image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
//     tags: ['winter', 'family', 'traditions']
//   },
//   {
//     id: '9',
//     title: 'Transfagarasan Highway',
//     category: 'attraction',
//     image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
//     tags: ['scenic', 'driving', 'mountains']
//   },
//   {
//     id: '10',
//     title: 'Cluj-Napoca Jazz Festival',
//     category: 'event',
//     image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
//     tags: ['music', 'culture', 'urban']
//   },
//   {
//     id: '11',
//     title: 'Merry Cemetery Sapanta',
//     category: 'attraction',
//     image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
//     tags: ['unique', 'culture', 'art']
//   },
//   {
//     id: '12',
//     title: 'Traditional Romanian Crafts',
//     category: 'article',
//     image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
//     tags: ['handmade', 'traditions', 'art']
//   }
// ]

// // Get shuffled content for each row to create variety
// const getRowContent = (rowIndex: number) => {
//   const shuffled = [...mockData]
//   // Create different starting points for each row
//   const startOffset = rowIndex * 4
//   return [...shuffled.slice(startOffset), ...shuffled.slice(0, startOffset)]
// }

// const getCategoryIcon = (category: ContentType) => {
//   switch (category) {
//     case 'attraction':
//       return <MapPin className="w-4 h-4" />
//     case 'event':
//       return <Calendar className="w-4 h-4" />
//     case 'article':
//       return <FileText className="w-4 h-4" />
//   }
// }

// const getCategoryColor = (category: ContentType) => {
//   switch (category) {
//     case 'attraction':
//       return 'bg-[#16a085] text-white'
//     case 'event':
//       return 'bg-[#f5a623] text-white'
//     case 'article':
//       return 'bg-[#8b1538] text-white'
//   }
// }

// export default function HeroSection({ onAttractionClick }: HeroSectionProps) {
//   const [searchQuery, setSearchQuery] = useState('')
//   const [filteredData, setFilteredData] = useState<ContentItem[]>([])
//   const [isSearching, setIsSearching] = useState(false)
//   const [scrollPositions, setScrollPositions] = useState([0, 0, 0])
//   const [dragState, setDragState] = useState<DragState | null>(null)
//   const [isUserInteracting, setIsUserInteracting] = useState(false)

//   // Calculate the width of one complete set of items (card width + gap)
//   const cardWidth = 320 // Card width
//   const gapWidth = 24 // Gap between cards
//   const cardWithGap = cardWidth + gapWidth
//   const itemsPerSet = mockData.length
//   const singleSetWidth = cardWithGap * itemsPerSet

//   // Auto-scroll effect for three rows with seamless circular loop
//   useEffect(() => {
//     if (!isSearching && !isUserInteracting) {
//       const interval = setInterval(() => {
//         setScrollPositions(prev => prev.map((pos, index) => {
//           let speed
//           let direction
          
//           // Set different speeds and directions for each row (slower speeds)
//           switch (index) {
//             case 0:
//               speed = 0.5 // Slower
//               direction = -1 // Left
//               break
//             case 1:
//               speed = 0.3 // Even slower
//               direction = 1 // Right
//               break
//             case 2:
//               speed = 0.7 // Slightly faster but still slower than before
//               direction = -1 // Left
//               break
//             default:
//               speed = 0.5
//               direction = -1
//           }
          
//           let newPos = pos + (speed * direction)
          
//           // Seamless circular reset - ensure smooth transition
//           if (direction === -1) {
//             // Moving left
//             if (newPos <= -singleSetWidth) {
//               newPos = 0 // Reset to start seamlessly
//             }
//           } else {
//             // Moving right
//             if (newPos >= singleSetWidth) {
//               newPos = 0 // Reset to start seamlessly
//             }
//           }
          
//           return newPos
//         }))
//       }, 16) // ~60fps for smooth animation
//       return () => clearInterval(interval)
//     }
//   }, [isSearching, isUserInteracting, singleSetWidth])

//   // Search filtering
//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredData([])
//       setIsSearching(false)
//     } else {
//       setIsSearching(true)
//       const filtered = mockData.filter(item =>
//         item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
//       )
//       setFilteredData(filtered)
//     }
//   }, [searchQuery])

//   const groupedResults = filteredData.reduce((acc, item) => {
//     if (!acc[item.category]) {
//       acc[item.category] = []
//     }
//     acc[item.category].push(item)
//     return acc
//   }, {} as Record<ContentType, ContentItem[]>)

//   // Handle card click
//   const handleCardClick = (item: ContentItem, event: React.MouseEvent) => {
//     // Prevent click if we've detected dragging movement
//     if (dragState?.hasMoved) {
//       console.log('Click prevented due to drag movement')
//       return
//     }

//     console.log('Card clicked:', item.title, item.category, item.id)
    
//     if (item.category === 'attraction' && onAttractionClick) {
//       console.log('Calling onAttractionClick with ID:', item.id)
//       onAttractionClick(item.id)
//     } else {
//       // Handle other types (events, articles) here in the future
//       console.log(`${item.category} page not implemented yet`)
//     }
//   }

//   // Drag handlers with improved click detection
//   const handleMouseDown = (e: React.MouseEvent, rowIndex: number) => {
//     console.log('Mouse down on row', rowIndex)
//     setIsUserInteracting(true)
//     setDragState({
//       isDragging: true,
//       startX: e.pageX,
//       scrollLeft: scrollPositions[rowIndex],
//       rowIndex,
//       hasMoved: false
//     })
//     e.preventDefault()
//   }

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!dragState || !dragState.isDragging) return
    
//     e.preventDefault()
//     const x = e.pageX
//     const walk = (x - dragState.startX) * 2 // Multiply by 2 for faster scroll
    
//     // If moved more than 5 pixels, consider it a drag
//     if (Math.abs(walk) > 5 && !dragState.hasMoved) {
//       setDragState(prev => prev ? { ...prev, hasMoved: true } : null)
//       console.log('Drag movement detected')
//     }
    
//     let newPosition = dragState.scrollLeft + walk
    
//     // Apply circular wrapping
//     if (newPosition <= -singleSetWidth) {
//       newPosition = 0
//     } else if (newPosition >= singleSetWidth) {
//       newPosition = 0
//     }
    
//     setScrollPositions(prev => {
//       const newPositions = [...prev]
//       newPositions[dragState.rowIndex] = newPosition
//       return newPositions
//     })
//   }

//   const handleMouseUp = () => {
//     console.log('Mouse up, hasMoved:', dragState?.hasMoved)
//     if (dragState) {
//       // Don't reset drag state immediately to allow click detection
//       setTimeout(() => {
//         setDragState(null)
//         // Resume auto-scroll after a short delay
//         setTimeout(() => {
//           setIsUserInteracting(false)
//         }, 1000)
//       }, 100) // Small delay to allow click handler to check hasMoved
//     }
//   }

//   // Touch handlers for mobile
//   const handleTouchStart = (e: React.TouchEvent, rowIndex: number) => {
//     setIsUserInteracting(true)
//     const touch = e.touches[0]
//     setDragState({
//       isDragging: true,
//       startX: touch.pageX,
//       scrollLeft: scrollPositions[rowIndex],
//       rowIndex,
//       hasMoved: false
//     })
//   }

//   const handleTouchMove = (e: React.TouchEvent) => {
//     if (!dragState || !dragState.isDragging) return
    
//     const touch = e.touches[0]
//     const x = touch.pageX
//     const walk = (x - dragState.startX) * 2
    
//     // If moved more than 5 pixels, consider it a drag
//     if (Math.abs(walk) > 5 && !dragState.hasMoved) {
//       setDragState(prev => prev ? { ...prev, hasMoved: true } : null)
//     }
    
//     let newPosition = dragState.scrollLeft + walk
    
//     // Apply circular wrapping
//     if (newPosition <= -singleSetWidth) {
//       newPosition = 0
//     } else if (newPosition >= singleSetWidth) {
//       newPosition = 0
//     }
    
//     setScrollPositions(prev => {
//       const newPositions = [...prev]
//       newPositions[dragState.rowIndex] = newPosition
//       return newPositions
//     })
//   }

//   const handleTouchEnd = () => {
//     if (dragState) {
//       setTimeout(() => {
//         setDragState(null)
//         setTimeout(() => {
//           setIsUserInteracting(false)
//         }, 1000)
//       }, 100)
//     }
//   }

//   // Global mouse events
//   useEffect(() => {
//     const handleGlobalMouseMove = (e: MouseEvent) => {
//       if (!dragState || !dragState.isDragging) return
      
//       e.preventDefault()
//       const x = e.pageX
//       const walk = (x - dragState.startX) * 2
      
//       // If moved more than 5 pixels, consider it a drag
//       if (Math.abs(walk) > 5 && !dragState.hasMoved) {
//         setDragState(prev => prev ? { ...prev, hasMoved: true } : null)
//       }
      
//       let newPosition = dragState.scrollLeft + walk
      
//       // Apply circular wrapping
//       if (newPosition <= -singleSetWidth) {
//         newPosition = 0
//       } else if (newPosition >= singleSetWidth) {
//         newPosition = 0
//       }
      
//       setScrollPositions(prev => {
//         const newPositions = [...prev]
//         newPositions[dragState.rowIndex] = newPosition
//         return newPositions
//       })
//     }

//     const handleGlobalMouseUp = () => {
//       if (dragState) {
//         setTimeout(() => {
//           setDragState(null)
//           setTimeout(() => {
//             setIsUserInteracting(false)
//           }, 1000)
//         }, 100)
//       }
//     }

//     if (dragState?.isDragging) {
//       document.addEventListener('mousemove', handleGlobalMouseMove)
//       document.addEventListener('mouseup', handleGlobalMouseUp)
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleGlobalMouseMove)
//       document.removeEventListener('mouseup', handleGlobalMouseUp)
//     }
//   }, [dragState, singleSetWidth])

//   const renderGalleryRow = (rowIndex: number) => {
//     const rowContent = getRowContent(rowIndex)
//     const isDraggingThisRow = dragState?.rowIndex === rowIndex && dragState?.isDragging
    
//     return (
//       <div 
//         key={rowIndex}
//         className={`flex items-center mb-8 ${isDraggingThisRow ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
//         style={{
//           transform: `translateX(${scrollPositions[rowIndex]}px)`,
//           transition: isDraggingThisRow ? 'none' : 'transform 0.1s ease-out',
//         }}
//         onMouseDown={(e) => handleMouseDown(e, rowIndex)}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onTouchStart={(e) => handleTouchStart(e, rowIndex)}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//       >
//         {/* Create 5 copies to ensure seamless circular effect - this gives us enough buffer */}
//         {[...Array(5)].map((_, copyIndex) => (
//           <React.Fragment key={copyIndex}>
//             {rowContent.map((item, index) => (
//               <motion.div
//                 key={`row-${rowIndex}-${copyIndex}-${item.id}-${index}`}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: (rowIndex * 0.2) + (index * 0.05) }}
//                 className={`flex-shrink-0 bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#2c3e50]/5 ${
//                   isDraggingThisRow ? '' : 'hover:scale-105 hover:-translate-y-2 cursor-pointer'
//                 }`}
//                 style={{
//                   width: `${cardWidth}px`,
//                   marginRight: `${gapWidth}px`,
//                 }}
//                 onClick={(e) => {
//                   console.log('Card div clicked, isDragging:', isDraggingThisRow, 'hasMoved:', dragState?.hasMoved)
//                   handleCardClick(item, e)
//                 }}
//               >
//                 <div className="relative h-48">
//                   <ImageWithFallback
//                     src={item.image}
//                     alt={item.title}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute top-3 right-3">
//                     <Badge className={`${getCategoryColor(item.category)} shadow-lg border-0`}>
//                       {getCategoryIcon(item.category)}
//                       <span className="ml-1 capitalize">{item.category}</span>
//                     </Badge>
//                   </div>
//                 </div>
//                 <div className="p-5">
//                   <h4 
//                     className="mb-3 text-[#2c3e50] cursor-pointer hover:text-[#8b1538] transition-colors"
//                     onClick={(e) => {
//                       e.stopPropagation() // Prevent double triggering
//                       console.log('Title clicked:', item.title)
//                       handleCardClick(item, e)
//                     }}
//                   >
//                     {item.title}
//                   </h4>
//                   <div className="flex flex-wrap gap-2">
//                     {item.tags.map(tag => (
//                       <Badge key={tag} variant="outline" className="text-xs border-[#2c3e50]/20 text-[#2c3e50]/70 hover:bg-[#f4e6e8] transition-colors">
//                         {tag}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </React.Fragment>
//         ))}
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-[#faf7f2] relative overflow-hidden geometric-bg">
//       {/* Decorative Geometric Shapes */}
//       <div className="absolute inset-0 pointer-events-none">
//         {/* Large Hexagon - Top Left */}
//         <div className="absolute top-20 left-10 w-32 h-32 rotate-12 opacity-20">
//           <div className="w-full h-full bg-[#e8f4f8] rounded-2xl transform rotate-45"></div>
//         </div>
        
//         {/* Diamond - Top Right */}
//         <div className="absolute top-32 right-20 w-6 h-6 bg-[#2c3e50] transform rotate-45 opacity-30"></div>
        
//         {/* Pink Diamond - Bottom Left */}
//         <div className="absolute bottom-40 left-32 w-8 h-8 bg-[#f4e6e8] transform rotate-45 opacity-40"></div>
        
//         {/* Small Diamonds scattered */}
//         <div className="absolute top-60 left-1/4 w-4 h-4 bg-[#2c3e50] transform rotate-45 opacity-20"></div>
//         <div className="absolute top-80 right-1/3 w-3 h-3 bg-[#2c3e50] transform rotate-45 opacity-25"></div>
//         <div className="absolute bottom-60 right-20 w-5 h-5 bg-[#2c3e50] transform rotate-45 opacity-30"></div>
        
//         {/* Large Geometric Shape - Right Side */}
//         <div className="absolute top-40 right-0 w-64 h-64 opacity-10">
//           <div className="w-full h-full bg-gradient-to-br from-[#f7dc6f] to-[#f5a623] rounded-full transform translate-x-32"></div>
//         </div>
//       </div>

//       {/* Header */}
//       <div className="relative z-10 pb-10 px-4">
//         <div className="max-w-8xl mx-auto text-center">

//           {/* Search Bar */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="relative max-w-4xl mx-auto"
//           >
//             <div className="flex items-center rounded-3xl px-5 bg-gradient-to-r from-[#E8EFEE]/50 to-[#E8EFEE]/20 shadow-md gap-2 hover:shadow-xl">
//               <Search className="text-black" size={30} strokeWidth={1} aria-hidden="true" />
//               <Input
//                 type="text"
//                 placeholder="Search for castles, mountains, cities, experiences..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-2 pr-6 py-7 !text-base bg-transparent border-hidden focus-visible:ring-0 rounded-3xl transition-all duration-300 text-[#2c3e50] placeholder:text-rg-black-50 placeholder:text-base"
//               />
//               <div className='flex items-center gap-3'>
//                       {/* Show clear button only if text exists */}
//       {/* {searchQuery && (
//         <button
//           onClick={() => setSearchQuery("")}
//           className="text-black hover:text-gray-600 focus:outline-none text-xl"
//           aria-label="Clear search"
//         >
//           ✕
//         </button>
//       )} */}

//       {searchQuery && (
//   <X
//     onClick={() => setSearchQuery("")}
//     className="cursor-pointer text-rg-primary-red hover:text-gray-600"
//     size={28} strokeWidth={1}
//     aria-label="Clear search"
//   />
// )}
//                 <Mic className="text-black w-6 h-6" size={24} strokeWidth={1} aria-hidden="true" />
//                 <MapPin className="text-black w-6 h-6" size={24} strokeWidth={1} aria-hidden="true" />
//                 <SlidersHorizontal className="text-black w-6 h-6" size={24} strokeWidth={1} aria-hidden="true" />
//               </div>

//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Search Results */}
//       <AnimatePresence>
//         {isSearching && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="relative z-10 px-4 pb-10"
//           >
//             <div className="max-w-6xl mx-auto">
//               {Object.entries(groupedResults).map(([category, items]) => (
//                 <motion.div
//                   key={category}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                   className="mb-10"
//                 >
//                   <div className="flex items-center gap-3 mb-6">
//                     {getCategoryIcon(category as ContentType)}
//                     <h3 className="text-[#2c3e50] capitalize">{category}s</h3>
//                     <Badge className="bg-[#16a085] text-white">{items.length}</Badge>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {items.map((item, index) => (
//                       <motion.div
//                         key={item.id}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.1 }}
//                         className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#2c3e50]/5 hover:scale-105 hover:-translate-y-2 cursor-pointer"
//                         onClick={(e) => handleCardClick(item, e)}
//                       >
//                         <div className="relative h-48">
//                           <ImageWithFallback
//                             src={item.image}
//                             alt={item.title}
//                             className="w-full h-full object-cover"
//                           />
//                           <div className="absolute top-3 right-3">
//                             <Badge className={`${getCategoryColor(item.category)} shadow-lg border-0`}>
//                               {getCategoryIcon(item.category)}
//                               <span className="ml-1 capitalize">{item.category}</span>
//                             </Badge>
//                           </div>
//                         </div>
//                         <div className="p-5">
//                           <h4 className="mb-3 text-[#2c3e50] hover:text-[#8b1538] transition-colors">{item.title}</h4>
//                           <div className="flex flex-wrap gap-2">
//                             {item.tags.map(tag => (
//                               <Badge key={tag} variant="outline" className="text-xs border-[#2c3e50]/20 text-[#2c3e50]/70 hover:bg-[#f4e6e8] transition-colors">
//                                 {tag}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </motion.div>
//               ))}
//               {filteredData.length === 0 && searchQuery && (
//                 <div className="text-center py-16">
//                   <p className="text-[#2c3e50]/60 text-lg">
//                     No results found for "{searchQuery}"
//                   </p>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Three-Row Gallery - Only show when not searching */}
//       {!isSearching && (
//         <div className="relative py-10">
//           <div className="space-y-0">
//             {/* Row 1 - scrolls left slowly */}
//             <div className="overflow-hidden">
//               {renderGalleryRow(0)}
//             </div>
            
//             {/* Row 2 - scrolls right slowly */}
//             <div className="overflow-hidden">
//               {renderGalleryRow(1)}
//             </div>
            
//             {/* Row 3 - scrolls left slightly faster */}
//             <div className="overflow-hidden">
//               {renderGalleryRow(2)}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


// ------------ VARIANT 2 ---------------------



// 'use client'

// import React, { useState, useEffect, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Search, MapPin, Calendar, FileText, Mic, SlidersHorizontal, X, Sparkles } from 'lucide-react'
// import { Input } from './../ui/input'
// import { Badge } from './../ui/badge'
// import { ImageWithFallback } from './../ui/ImageWithFallback'

// type ContentType = 'attraction' | 'event' | 'article'

// interface ContentItem {
//   id: string
//   title: string
//   category: ContentType
//   image: string
//   tags: string[]
//   link?: string
// }

// interface HeroSectionProps {
//   onAttractionClick?: (attractionId: string) => void
// }

// // Helper: icons by category
// const getCategoryIcon = (category: ContentType) => {
//   switch (category) {
//     case 'attraction': return <MapPin className="w-4 h-4" />
//     case 'event': return <Calendar className="w-4 h-4" />
//     case 'article': return <FileText className="w-4 h-4" />
//   }
// }

// // Helper: badge colors by category
// const getCategoryColor = (category: ContentType) => {
//   switch (category) {
//     case 'attraction': return 'bg-[#16a085] text-white'
//     case 'event': return 'bg-[#f5a623] text-white'
//     case 'article': return 'bg-[#8b1538] text-white'
//   }
// }

// export default function HeroSearch({ onAttractionClick }: HeroSectionProps) {
//   const [searchQuery, setSearchQuery] = useState('')
//   const [filteredData, setFilteredData] = useState<ContentItem[]>([])
//   const [isSearching, setIsSearching] = useState(false)
//   const [suggestions, setSuggestions] = useState<string[]>([])
//   const inputRef = useRef<HTMLInputElement>(null)
//   const [focused, setFocused] = useState(false)

//   // Fetch dynamic suggestions
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/suggestions')
//         const data = await res.json()
//         setSuggestions(data)
//       } catch (err) {
//         console.error('Failed to fetch suggestions', err)
//       }
//     }
//     fetchSuggestions()
//   }, [])

//   // Query Pinecone when typing
//   useEffect(() => {
//     const fetchResults = async () => {
//       if (!searchQuery.trim()) {
//         setFilteredData([])
//         setIsSearching(false)
//         return
//       }
//       try {
//         const response = await fetch('http://localhost:5000/api/search-embeddings', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ query: searchQuery }),
//         })
//         const { matches } = await response.json()

//         const formatted = matches.map((m: any) => ({
//           id: m.id,
//           title: m.metadata.title,
//           category: m.metadata.category as ContentType,
//           image: m.metadata.image || '/placeholder.jpg',
//           tags: m.metadata.tags || [],
//           link: m.metadata.link,
//         }))

//         setFilteredData(formatted)
//         setIsSearching(true)
//       } catch (err) {
//         console.error('Search error:', err)
//       }
//     }

//     const debounce = setTimeout(fetchResults, 400) // debounce typing
//     return () => clearTimeout(debounce)
//   }, [searchQuery])

//   // Group results by category
//   const groupedResults = filteredData.reduce((acc, item) => {
//     if (!acc[item.category]) acc[item.category] = []
//     acc[item.category].push(item)
//     return acc
//   }, {} as Record<ContentType, ContentItem[]>)

//   return (
//     <div className="min-h-screen bg-[#faf7f2] relative overflow-hidden">
//       {/* 🔍 Search Bar */}
//       <div className="relative z-10 pb-10 px-4">
//         <div className="max-w-8xl mx-auto text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="relative max-w-4xl mx-auto"
//           >
//             <div className="flex items-center rounded-3xl px-5 bg-gradient-to-r from-[#E8EFEE]/50 to-[#E8EFEE]/20 shadow-md gap-2 hover:shadow-xl">
//               <Search className="text-black" size={30} strokeWidth={1} aria-hidden="true" />
//               <Input
//                 ref={inputRef}
//                 type="text"
//                 placeholder="Search for castles, mountains, cities, experiences..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onFocus={() => setFocused(true)}
//                 onBlur={() => setTimeout(() => setFocused(false), 200)}
//                 className="pl-2 pr-6 py-7 !text-base bg-transparent border-hidden focus-visible:ring-0 rounded-3xl transition-all duration-300 text-[#2c3e50] placeholder:text-rg-black-50 placeholder:text-base"
//               />
//               <div className='flex items-center gap-3'>
//                 {searchQuery && (
//                   <X
//                     onClick={() => setSearchQuery("")}
//                     className="cursor-pointer text-rg-primary-red hover:text-gray-600"
//                     size={28} strokeWidth={1}
//                     aria-label="Clear search"
//                   />
//                 )}
//                 <Mic className="text-black w-6 h-6" />
//                 <MapPin className="text-black w-6 h-6" />
//                 <SlidersHorizontal className="text-black w-6 h-6" />
//               </div>
//             </div>
//           </motion.div>

//           {/* 💡 Suggestions */}
//           {focused && suggestions.length > 0 && (
//             <div className="mt-3 rounded-2xl border border-gray-200 bg-white/95 p-4 text-left shadow-xl backdrop-blur max-w-2xl mx-auto">
//               <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                 <Sparkles className="h-4 w-4" />
//                 Try:
//               </div>
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {suggestions.map((s, i) => (
//                   <button
//                     key={i}
//                     onMouseDown={(e) => e.preventDefault()}
//                     onClick={() => setSearchQuery(s)}
//                     className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
//                   >
//                     {s}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 🔎 Search Results */}
//       <AnimatePresence>
//         {isSearching && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="relative z-10 px-4 pb-10"
//           >
//             <div className="max-w-6xl mx-auto">
//               {Object.entries(groupedResults).map(([category, items]) => (
//                 <motion.div
//                   key={category}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                   className="mb-10"
//                 >
//                   <div className="flex items-center gap-3 mb-6">
//                     {getCategoryIcon(category as ContentType)}
//                     <h3 className="text-[#2c3e50] capitalize">{category}s</h3>
//                     <Badge className="bg-[#16a085] text-white">{items.length}</Badge>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {items.map((item, index) => (
//                       <motion.a
//                         href={item.link || "#"}
//                         key={item.id}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.05 }}
//                         className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#2c3e50]/5 hover:scale-105 hover:-translate-y-2 cursor-pointer"
//                       >
//                         <div className="relative h-48">
//                           <ImageWithFallback
//                             src={item.image}
//                             alt={item.title}
//                             className="w-full h-full object-cover"
//                           />
//                           <div className="absolute top-3 right-3">
//                             <Badge className={`${getCategoryColor(item.category)} shadow-lg border-0`}>
//                               {getCategoryIcon(item.category)}
//                               <span className="ml-1 capitalize">{item.category}</span>
//                             </Badge>
//                           </div>
//                         </div>
//                         <div className="p-5">
//                           <h4 className="mb-3 text-[#2c3e50] hover:text-[#8b1538] transition-colors">{item.title}</h4>
//                           <div className="flex flex-wrap gap-2">
//                             {item.tags.map(tag => (
//                               <Badge key={tag} variant="outline" className="text-xs border-[#2c3e50]/20 text-[#2c3e50]/70 hover:bg-[#f4e6e8] transition-colors">
//                                 {tag}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                       </motion.a>
//                     ))}
//                   </div>
//                 </motion.div>
//               ))}
//               {filteredData.length === 0 && searchQuery && (
//                 <div className="text-center py-16">
//                   <p className="text-[#2c3e50]/60 text-lg">No results found for "{searchQuery}"</p>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 🎞 Idle state gallery here (keep your existing auto-scroll rows) */}
//       {!isSearching && (
//         <div className="relative py-10">
//           {/* You can reuse your renderGalleryRow(0/1/2) logic here */}
//           <p className="text-center text-gray-500">✨ Gallery rows go here (from Strapi latest items)</p>
//         </div>
//       )}
//     </div>
//   )
// }




// ------------------- VARIANTA 3 ---------------------

// 'use client'

// import React, { useState, useEffect, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Search, MapPin, Calendar, FileText, Mic, SlidersHorizontal, X, Sparkles } from 'lucide-react'
// import { Input } from './../ui/input'
// import { Badge } from './../ui/badge'
// import { ImageWithFallback } from './../ui/ImageWithFallback'

// type ContentType = 'attraction' | 'event' | 'article'

// interface ContentItem {
//   id: string
//   title: string
//   category: ContentType
//   image: string
//   tags: string[]
//   link?: string
// }

// interface HeroSectionProps {
//   onAttractionClick?: (attractionId: string) => void
// }

// // Category → Icon
// const getCategoryIcon = (category: ContentType) => {
//   switch (category) {
//     case 'attraction': return <MapPin className="w-4 h-4" />
//     case 'event': return <Calendar className="w-4 h-4" />
//     case 'article': return <FileText className="w-4 h-4" />
//   }
// }

// // Category → Color
// const getCategoryColor = (category: ContentType) => {
//   switch (category) {
//     case 'attraction': return 'bg-[#16a085] text-white'
//     case 'event': return 'bg-[#f5a623] text-white'
//     case 'article': return 'bg-[#8b1538] text-white'
//   }
// }

// export default function HeroSearch({ onAttractionClick }: HeroSectionProps) {
//   const [searchQuery, setSearchQuery] = useState('')
//   const [filteredData, setFilteredData] = useState<ContentItem[]>([])
//   const [isSearching, setIsSearching] = useState(false)
//   const [suggestionRows, setSuggestionRows] = useState<ContentItem[]>([])
//   const inputRef = useRef<HTMLInputElement>(null)
//   const [focused, setFocused] = useState(false)

//   // 🔹 Fetch featured content (for suggestions, when not searching)
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       try {
//         const [attractionsRes, eventsRes, articlesRes] = await Promise.all([
//           fetch('http://localhost:5000/api/attractions'),
//           fetch('http://localhost:5000/api/events'),
//           fetch('http://localhost:5000/api/articles'),
//         ])

//         const [attractions, events, articles] = await Promise.all([
//           attractionsRes.json(),
//           eventsRes.json(),
//           articlesRes.json(),
//         ])

//         const mapToItems = (arr: any[], type: ContentType) =>
//           arr.map((item: any) => ({
//             id: `${type}-${item.id}`,
//             title: item.title,
//             category: type,
//             image: item.image?.url || '/placeholder.jpg',
//             tags: item.highlights?.map((h: any) => h.name) || [],
//             link: `/${type}s/${item.slug || item.id}`,
//           }))

//         setSuggestionRows([
//           ...mapToItems(attractions, 'attraction'),
//           ...mapToItems(events, 'event'),
//           ...mapToItems(articles, 'article'),
//         ])
//       } catch (err) {
//         console.error('Failed to fetch suggestion rows', err)
//       }
//     }
//     fetchSuggestions()
//   }, [])

//   // 🔹 Query Pinecone when typing
//   useEffect(() => {
//     const fetchResults = async () => {
//       if (!searchQuery.trim()) {
//         setFilteredData([])
//         setIsSearching(false)
//         return
//       }
//       try {
//         const response = await fetch('http://localhost:5000/api/search-embeddings', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ query: searchQuery }),
//         })
//         const { matches } = await response.json()

//         const formatted = matches.map((m: any) => ({
//           id: m.id,
//           title: m.metadata.title,
//           category: m.metadata.category as ContentType,
//           image: m.metadata.image || '/placeholder.jpg',
//           tags: m.metadata.tags || [],
//           link: m.metadata.link,
//         }))

//         setFilteredData(formatted)
//         setIsSearching(true)
//       } catch (err) {
//         console.error('Search error:', err)
//       }
//     }

//     const debounce = setTimeout(fetchResults, 400)
//     return () => clearTimeout(debounce)
//   }, [searchQuery])

//   // 🔹 Group results by category
//   const groupedResults = filteredData.reduce((acc, item) => {
//     if (!acc[item.category]) acc[item.category] = []
//     acc[item.category].push(item)
//     return acc
//   }, {} as Record<ContentType, ContentItem[]>)

//   // 🔹 Card Renderer
//   const renderCard = (item: ContentItem) => (
//     <motion.a
//       href={item.link}
//       key={item.id}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#2c3e50]/5 hover:scale-105 hover:-translate-y-2 cursor-pointer"
//     >
//       <div className="relative h-48">
//         <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
//         <div className="absolute top-3 right-3">
//           <Badge className={`${getCategoryColor(item.category)} shadow-lg border-0`}>
//             {getCategoryIcon(item.category)}
//             <span className="ml-1 capitalize">{item.category}</span>
//           </Badge>
//         </div>
//       </div>
//       <div className="p-5">
//         <h4 className="mb-3 text-[#2c3e50] hover:text-[#8b1538] transition-colors">{item.title}</h4>
//         <div className="flex flex-wrap gap-2">
//           {item.tags.map(tag => (
//             <Badge key={tag} variant="outline" className="text-xs border-[#2c3e50]/20 text-[#2c3e50]/70 hover:bg-[#f4e6e8] transition-colors">
//               {tag}
//             </Badge>
//           ))}
//         </div>
//       </div>
//     </motion.a>
//   )

//   return (
//     <div className="min-h-screen bg-[#faf7f2] relative overflow-hidden">
//       {/* 🔍 Search Bar */}
//       <div className="relative z-10 pb-10 px-4">
//         <div className="max-w-8xl mx-auto text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="relative max-w-4xl mx-auto"
//           >
//             <div className="flex items-center rounded-3xl px-5 bg-gradient-to-r from-[#E8EFEE]/50 to-[#E8EFEE]/20 shadow-md gap-2 hover:shadow-xl">
//               <Search className="text-black" size={30} strokeWidth={1} aria-hidden="true" />
//               <Input
//                 ref={inputRef}
//                 type="text"
//                 placeholder="Search for castles, mountains, cities, experiences..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onFocus={() => setFocused(true)}
//                 onBlur={() => setTimeout(() => setFocused(false), 200)}
//                 className="pl-2 pr-6 py-7 !text-base bg-transparent border-hidden focus-visible:ring-0 rounded-3xl transition-all duration-300 text-[#2c3e50] placeholder:text-rg-black-50 placeholder:text-base"
//               />
//               <div className='flex items-center gap-3'>
//                 {searchQuery && (
//                   <X
//                     onClick={() => setSearchQuery("")}
//                     className="cursor-pointer text-rg-primary-red hover:text-gray-600"
//                     size={28} strokeWidth={1}
//                     aria-label="Clear search"
//                   />
//                 )}
//                 <Mic className="text-black w-6 h-6" />
//                 <MapPin className="text-black w-6 h-6" />
//                 <SlidersHorizontal className="text-black w-6 h-6" />
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* 🔎 Search Results */}
//       <AnimatePresence>
//         {isSearching && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="relative z-10 px-4 pb-10"
//           >
//             <div className="max-w-6xl mx-auto">
//               {Object.entries(groupedResults).map(([category, items]) => (
//                 <div key={category} className="mb-10">
//                   <div className="flex items-center gap-3 mb-6">
//                     {getCategoryIcon(category as ContentType)}
//                     <h3 className="text-[#2c3e50] capitalize">{category}s</h3>
//                     <Badge className="bg-[#16a085] text-white">{items.length}</Badge>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {items.map(renderCard)}
//                   </div>
//                 </div>
//               ))}
//               {filteredData.length === 0 && searchQuery && (
//                 <div className="text-center py-16">
//                   <p className="text-[#2c3e50]/60 text-lg">No results found for "{searchQuery}"</p>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ✨ Suggestion Rows (idle state) */}
//       {!isSearching && (
//         <div className="relative py-10 max-w-7xl mx-auto space-y-12 px-4">
//           <div className="flex items-center gap-2 mb-6 text-gray-700">
//             <Sparkles className="w-5 h-5 text-yellow-500" />
//             <h3 className="font-semibold">Suggestions for you</h3>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {suggestionRows.slice(0, 9).map(renderCard)}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



// ------------------- VARIANTA 4 ---------------------

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Calendar, FileText, Mic, SlidersHorizontal, X, Sparkles } from 'lucide-react'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { ImageWithFallback } from '../ui/ImageWithFallback'

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
  hasMoved: boolean // Add this to track if actual dragging occurred
}

interface HeroSectionProps {
  onAttractionClick?: (attractionId: string) => void
}



// Get shuffled content for each row to create variety
// const getRowContent = (rowIndex: number) => {
//   if (loading || allContent.length === 0) return [];

//   const startOffset = rowIndex * 4;
//   const rotated = [
//     ...allContent.slice(startOffset),
//     ...allContent.slice(0, startOffset),
//   ];
//   return rotated;
// };



// Category → Icon
const getCategoryIcon = (category: ContentType) => {
  switch (category) {
    case 'attraction': return <MapPin className="w-4 h-4" />
    case 'event': return <Calendar className="w-4 h-4" />
    case 'article': return <FileText className="w-4 h-4" />
  }
}

// Category → Color
const getCategoryColor = (category: ContentType) => {
  switch (category) {
    case 'attraction': return 'bg-[#16a085] text-white'
    case 'event': return 'bg-[#f5a623] text-white'
    case 'article': return 'bg-[#8b1538] text-white'
  }
}

export default function HeroSearch({ onAttractionClick }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState<ContentItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [scrollPositions, setScrollPositions] = useState([0, 0, 0])
    const [dragState, setDragState] = useState<DragState | null>(null)
    const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [suggestionRows, setSuggestionRows] = useState<ContentItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  // 🔹 Fetch featured content (for suggestions, when not searching)
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

const mapToItems = (arr: any[], type: ContentType) =>
  arr.map((item: any) => {
    console.log(item.image.url);
    console.log(process.env.NEXT_PUBLIC_STRAPI_URL);


    return {
      id: `${type}-${item.id}`,
      title: item.title || item.name || 'Untitled',
      category: type,
      image: item.image?.url
        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${item.image.url}`
        : '/placeholder.jpg',
      tags: Array.isArray(item.highlights)
        ? item.highlights.map((h: any) => h.title)
        : [],
      link: `/${type}s/${item.slug || item.id}`,
    };
  });


        const merged = [
  ...mapToItems(attractions, 'attraction'),
  ...mapToItems(events, 'event'),
  ...mapToItems(articles, 'article'),
];

// random order
const shuffled = merged.sort(() => Math.random() - 0.5);
console.log(shuffled);

setSuggestionRows(shuffled);


      } catch (err) {
        console.error('Failed to fetch suggestion rows', err)
      }
    }
    fetchSuggestions()
  }, [])




  // 🔹 Query Pinecone when typing
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

        const formatted = matches.map((m: any) => ({
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

  // 🔹 Group results by category
  const groupedResults = filteredData.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<ContentType, ContentItem[]>)

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


    const renderGalleryRow = (rowIndex: number) => {
      const rowContent = getRowContent(rowIndex)
      const isDraggingThisRow = dragState?.rowIndex === rowIndex && dragState?.isDragging
      
      return (
        <div 
          key={rowIndex}
          className={`flex items-center mb-8 ${isDraggingThisRow ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
          style={{
            transform: `translateX(${scrollPositions[rowIndex]}px)`,
            transition: isDraggingThisRow ? 'none' : 'transform 0.1s ease-out',
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
                  transition={{ delay: (rowIndex * 0.2) + (index * 0.05) }}
                  className={`flex-shrink-0 bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#2c3e50]/5 ${
                    isDraggingThisRow ? '' : 'hover:scale-105 hover:-translate-y-2 cursor-pointer'
                  }`}
                  style={{
                    width: `${cardWidth}px`,
                    marginRight: `${gapWidth}px`,
                  }}
                  onClick={(e) => {
                    console.log('Card div clicked, isDragging:', isDraggingThisRow, 'hasMoved:', dragState?.hasMoved)
                    handleCardClick(item, e)
                  }}
                >
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getCategoryColor(item.category)} shadow-lg border-0`}>
                        {getCategoryIcon(item.category)}
                        <span className="ml-1 capitalize">{item.category}</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 
                      className="mb-3 text-[#2c3e50] cursor-pointer hover:text-[#8b1538] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation() // Prevent double triggering
                        console.log('Title clicked:', item.title)
                        handleCardClick(item, e)
                      }}
                    >
                      {item.title}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs border-[#2c3e50]/20 text-[#2c3e50]/70 hover:bg-[#f4e6e8] transition-colors">
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
      )
    }

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
              <Search className="text-black" size={30} strokeWidth={1} aria-hidden="true" />
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
                    <Badge className="bg-[#16a085] text-white">{items.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(renderCard)}
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

      {/* ✨ Suggestion Rows (idle state) */}
      {!isSearching && (
        <div className="relative py-10 mx-auto space-y-12">
        <div className="relative py-10">
          
          <div className="space-y-0">
                  {/* Carousel */}
             <div className="flex overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] 
                [&::-webkit-scrollbar]:hidden  ${isDraggingThisRow ? 'animate-none' : 'animate-spin'} motion-safe:animate-[spin_20s_linear_infinite]">
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
  )
}