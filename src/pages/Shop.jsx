import React, { useState, useMemo, useEffect } from 'react'
import {
    ShoppingBag,
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
    Loader2,
    Grid3X3,
    LayoutList,
    ArrowUpDown,
    Package,
    Eye,
    ChevronRight,
    ChevronLeft,
    ImageIcon,
    Tag,
    Sparkles,
    Info,
    Check,
    Scale,
    Globe
} from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { addToCart } from '../utils/Cart'
import useSEO from '../hooks/useSEO'

const Shop = () => {
    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState('')
    const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 })
    const [showFilters, setShowFilters] = useState(false)
    const [visibleCount, setVisibleCount] = useState(9)
    const [isLoading, setIsLoading] = useState(true)
    const [sortBy, setSortBy] = useState('featured')
    const [viewMode, setViewMode] = useState('grid')
    const [allProducts, setAllProducts] = useState([])
    const [selectedVariants, setSelectedVariants] = useState({})
    const [quickViewProduct, setQuickViewProduct] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [addingToCart, setAddingToCart] = useState(null)
    const [currency, setCurrency] = useState('LKR')

    const url = window.location.href;

    useSEO({
        title: "Shop - The Vanilla Shop",
        description: "Discover our complete collection of premium vanilla products.",
        url,
        image_alt: "Products",
        twitter_card: "summary_large_image",
    });

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // --- DATA FETCHING ---
    useEffect(() => {
        setIsLoading(true)
        axios
            .get(import.meta.env.VITE_API_URL + "/products")
            .then((response) => {
                const activeProducts = response.data.filter(product => product.isActive !== false)
                setAllProducts(activeProducts)
                setIsLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching products:", error)
                setIsLoading(false)
            })
    }, [])

    // --- HELPER LOGIC ---

    const categories = useMemo(() => {
        const cats = [...new Set(allProducts.map(p => p.category))]
        return ['all', ...cats]
    }, [allProducts])

    // Get base product images
    const getProductImages = (product) => {
        if (product.images && Array.isArray(product.images) && product.images.length > 0) return product.images
        return []
    }

    // Get variant-specific images
    const getVariantImages = (product, variantIndex) => {
        if (variantIndex !== undefined && product.variants && product.variants[variantIndex]) {
            const variant = product.variants[variantIndex]
            if (variant.images && Array.isArray(variant.images) && variant.images.length > 0) {
                return variant.images
            }
        }
        return []
    }

    // NEW: Get ALL images with selected variant images first
    const getAllProductImages = (product, selectedVariantIndex) => {
        let allImages = []
        const addedImages = new Set()

        // Helper to add unique images
        const addImages = (images) => {
            if (images && Array.isArray(images)) {
                images.forEach(img => {
                    if (img && !addedImages.has(img)) {
                        addedImages.add(img)
                        allImages.push(img)
                    }
                })
            }
        }

        // 1. If a variant is selected, add its images FIRST
        if (selectedVariantIndex !== undefined && product.variants && product.variants[selectedVariantIndex]) {
            const selectedVariant = product.variants[selectedVariantIndex]
            addImages(selectedVariant.images)
        }

        // 2. Add base product images
        addImages(product.images)

        // 3. Add other variants' images (not the selected one)
        if (product.variants && Array.isArray(product.variants)) {
            product.variants.forEach((variant, index) => {
                if (index !== selectedVariantIndex) {
                    addImages(variant.images)
                }
            })
        }

        return allImages
    }

    // Get display images for a product (with variant priority)
    const getDisplayImages = (product) => {
        const selectedVariantIndex = selectedVariants[product._id]
        return getAllProductImages(product, selectedVariantIndex)
    }

    // --- PRICE LOGIC ---
    const getPriceValue = (item) => {
        if (!item) return 0
        return currency === 'USD'
            ? item.priceInUSD ?? item.priceInLKR ?? item.price ?? 0
            : item.priceInLKR ?? item.priceInUSD ?? item.price ?? 0
    }

    const getProductPriceInfo = (product) => {
        if (product.variants && product.variants.length > 0) {
            const prices = product.variants
                .map(v => getPriceValue(v))
                .filter(p => p != null && p > 0)

            const basePrice = getPriceValue(product);

            if (prices.length === 0) {
                return {
                    hasVariants: true,
                    minPrice: basePrice,
                    maxPrice: basePrice,
                    displayPrice: basePrice,
                    isRange: false,
                    variants: product.variants
                }
            }
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)
            return {
                hasVariants: true,
                minPrice,
                maxPrice,
                displayPrice: minPrice,
                isRange: minPrice !== maxPrice,
                variants: product.variants
            }
        }

        const price = getPriceValue(product);
        return {
            hasVariants: false,
            minPrice: price,
            maxPrice: price,
            displayPrice: price,
            isRange: false,
            variants: []
        }
    }

    const getSelectedVariant = (product) => {
        const selectedIndex = selectedVariants[product._id]
        if (selectedIndex !== undefined && product.variants && product.variants[selectedIndex]) {
            return { ...product.variants[selectedIndex], index: selectedIndex }
        }
        return null
    }

    const isProductInStock = (product) => {
        if (product.variants && product.variants.length > 0) return product.variants.some(v => v.stock > 0)
        return (product.stock || 0) > 0
    }

    const isVariantInStock = (variant) => (variant.stock || 0) > 0

    // --- ACTIONS ---

    const handleVariantSelect = (productId, variantIndex) => {
        setSelectedVariants(prev => ({ ...prev, [productId]: variantIndex }))
    }

    const handleAddToCart = (product, e) => {
        if (e) e.preventDefault()
        const priceInfo = getProductPriceInfo(product)
        const selectedVariant = getSelectedVariant(product)
        const images = getDisplayImages(product)

        if (priceInfo.hasVariants && !selectedVariant) return

        setAddingToCart(product._id)

        const itemPrice = selectedVariant ? getPriceValue(selectedVariant) : getPriceValue(product);
        const itemStock = selectedVariant ? selectedVariant.stock : product.stock;
        const itemWeight = selectedVariant ? selectedVariant.weight : product.weight;

        const cartItem = {
            productId: product._id,
            name: product.name,
            slug: product.slug,
            price: itemPrice,
            currency: currency,
            stock: itemStock,
            image: images[0] || null,
            quantity: 1,
            weight: itemWeight,
            variantLabel: selectedVariant ? selectedVariant.label : null,
            variant: selectedVariant ? {
                label: selectedVariant.label,
                weight: selectedVariant.weight,
                price: itemPrice,
                stock: selectedVariant.stock
            } : null
        }

        if (typeof addToCart === 'function') {
            addToCart(cartItem)
        } else {
            console.log("Cart utility missing, added item:", cartItem)
            alert(`Added to cart: ${cartItem.name} (${currency} ${itemPrice})`)
        }

        setTimeout(() => setAddingToCart(null), 1000)
    }

    // --- SORT & FILTER ---

    const sortedProducts = useMemo(() => {
        let sorted = [...allProducts]
        switch (sortBy) {
            case 'name-a-z': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'name-z-a': sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
            case 'price-low': sorted.sort((a, b) => getProductPriceInfo(a).minPrice - getProductPriceInfo(b).minPrice); break;
            case 'price-high': sorted.sort((a, b) => getProductPriceInfo(b).maxPrice - getProductPriceInfo(a).maxPrice); break;
            case 'newest': sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
            default: break;
        }
        return sorted
    }, [sortBy, allProducts, currency])

    const filteredProducts = useMemo(() => {
        return sortedProducts.filter((product) => {
            const searchLower = searchQuery.toLowerCase()
            const matchesSearch = product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower) ||
                product.category.toLowerCase().includes(searchLower)

            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory

            const priceInfo = getProductPriceInfo(product)
            const matchesPrice =
                priceInfo.minPrice > 0 &&
                (
                    (priceInfo.minPrice >= priceRange.min && priceInfo.minPrice <= priceRange.max) ||
                    (priceInfo.maxPrice >= priceRange.min && priceInfo.maxPrice <= priceRange.max)
                )

            return matchesSearch && matchesCategory && matchesPrice
        })
    }, [searchQuery, priceRange, selectedCategory, sortedProducts, currency])

    const displayedProducts = filteredProducts.slice(0, visibleCount)
    const hasMore = visibleCount < filteredProducts.length

    const resetFilters = () => {
        setSearchQuery('')
        setPriceRange({ min: 0, max: 10000 })
        setSortBy('featured')
        setSelectedCategory('all')
        setVisibleCount(9)
        setCurrency('LKR')
    }

    // --- FORMATTERS ---
    const formatPrice = (price) => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(price)
        }
        return 'LKR ' + new Intl.NumberFormat('en-LK').format(price)
    }

    // --- RENDER HELPERS ---

    const renderPrice = (product, size = 'normal') => {
        const priceInfo = getProductPriceInfo(product)
        const selectedVariant = getSelectedVariant(product)
        const textSize = size === 'small' ? 'text-lg' : 'text-2xl'

        if (selectedVariant) {
            const variantPrice = getPriceValue(selectedVariant);
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-serif ${textSize} font-bold text-vanilla-900`}>{formatPrice(variantPrice)}</span>
                    {selectedVariant.weight && <span className="text-charcoal/50 text-sm">/ {selectedVariant.weight}</span>}
                </div>
            )
        }

        if (!priceInfo.hasVariants) {
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-serif ${textSize} font-bold text-vanilla-900`}>{formatPrice(priceInfo.displayPrice)}</span>
                    {product.weight && <span className="text-charcoal/50 text-sm">/ {product.weight}</span>}
                </div>
            )
        }

        if (priceInfo.isRange) {
            return (
                <div className="flex items-center gap-1 flex-wrap">
                    <span className={`font-serif ${size === 'small' ? 'text-base' : 'text-xl'} font-bold text-vanilla-900`}>{formatPrice(priceInfo.minPrice)}</span>
                    <span className="text-charcoal/40">-</span>
                    <span className={`font-serif ${size === 'small' ? 'text-base' : 'text-xl'} font-bold text-vanilla-900`}>{formatPrice(priceInfo.maxPrice)}</span>
                </div>
            )
        }

        return <span className={`font-serif ${textSize} font-bold text-vanilla-900`}>{formatPrice(priceInfo.displayPrice)}</span>
    }

    // --- THUMBNAIL GALLERY COMPONENT ---
    const ThumbnailGallery = ({ images, currentIndex, onSelect, size = 'normal' }) => {
        const thumbnailSize = size === 'small' ? 'w-12 h-12' : 'w-16 h-16'
        const containerClass = size === 'small' ? 'gap-1.5' : 'gap-2'
        const maxVisible = size === 'small' ? 4 : 6

        if (!images || images.length <= 1) return null

        return (
            <div className={`flex ${containerClass} mt-3 overflow-x-auto pb-1 scrollbar-hide`}>
                {images.slice(0, maxVisible).map((image, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onSelect(index)
                        }}
                        className={`${thumbnailSize} shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentIndex === index
                            ? 'border-vanilla-900 ring-2 ring-vanilla-400/30'
                            : 'border-vanilla-200 hover:border-vanilla-400'
                            }`}
                    >
                        <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
                {images.length > maxVisible && (
                    <div className={`${thumbnailSize} shrink-0 rounded-lg bg-vanilla-100 flex items-center justify-center text-vanilla-600 text-sm font-medium`}>
                        +{images.length - maxVisible}
                    </div>
                )}
            </div>
        )
    }

    // --- PRODUCT CARD COMPONENT ---
    const ProductCard = ({ product }) => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0)
        const [isHovered, setIsHovered] = useState(false)
        const priceInfo = getProductPriceInfo(product)
        const selectedVariantIndex = selectedVariants[product._id]
        const selectedVariant = getSelectedVariant(product)
        const inStock = isProductInStock(product)
        const images = getAllProductImages(product, selectedVariantIndex)
        const hasMultipleImages = images.length > 1
        const isAddingToCart = addingToCart === product._id

        // Reset to first image when variant changes
        useEffect(() => {
            setCurrentImageIndex(0)
        }, [selectedVariantIndex])

        const canAddToCart = () => {
            if (!inStock) return false
            if (priceInfo.hasVariants && selectedVariantIndex === undefined) return false
            if (selectedVariant && !isVariantInStock(selectedVariant)) return false
            return true
        }

        const handleThumbnailSelect = (index) => {
            setCurrentImageIndex(index)
        }

        return (
            <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-vanilla-100 transition-all duration-500 ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}`}>
                {/* Image Section */}
                <div
                    className={`relative overflow-hidden ${viewMode === 'list' ? 'sm:w-72 shrink-0' : ''}`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Main Image */}
                    <div className="aspect-square relative">
                        {images.length > 0 ? (
                            <>
                                <img
                                    src={images[currentImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {hasMultipleImages && (
                                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-vanilla-900/70 backdrop-blur-sm rounded-md text-white text-xs flex items-center gap-1">
                                        <ImageIcon className="w-3 h-3" /> {currentImageIndex + 1}/{images.length}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full bg-vanilla-100 flex items-center justify-center text-vanilla-400">
                                <ImageIcon className="w-12 h-12" />
                            </div>
                        )}

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-vanilla-400 text-vanilla-900">
                                {product.category}
                            </span>
                        </div>

                        {/* Out of Stock Overlay */}
                        {!inStock && (
                            <div className="absolute inset-0 bg-vanilla-900/60 flex items-center justify-center">
                                <span className="bg-white text-vanilla-900 px-4 py-2 rounded-full font-semibold text-sm">
                                    Out of Stock
                                </span>
                            </div>
                        )}

                        {/* Hover Actions - Grid View Only */}
                        {viewMode === 'grid' && (
                            <>
                                <button
                                    onClick={() => setQuickViewProduct(product)}
                                    className="absolute bottom-17 left-4 right-4 py-2.5 bg-white/90 backdrop-blur-sm text-vanilla-900 rounded-xl font-medium flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white"
                                >
                                    <Eye className="w-4 h-4" /> <span>Quick View</span>
                                </button>

                                {inStock && (
                                    <Link to={`/products/${product.slug}`}>
                                        <button className='absolute bottom-4 left-4 right-4 py-3 bg-vanilla-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-vanilla-600'>
                                            View Product
                                        </button>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Thumbnail Gallery - Below Main Image */}
                    {viewMode === 'grid' && hasMultipleImages && (
                        <div className="px-4 pb-2 bg-white">
                            <ThumbnailGallery
                                images={images}
                                currentIndex={currentImageIndex}
                                onSelect={handleThumbnailSelect}
                                size="small"
                            />
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className={`p-5 ${viewMode === 'list' ? 'flex-1 flex flex-col' : ''}`}>
                    <Link to={`/products/${product.slug}`}>
                        <h3 className="font-semibold text-vanilla-900 text-lg mb-2 group-hover:text-vanilla-600 transition-colors duration-300 line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>
                    <p className="text-charcoal/60 text-sm mb-3 line-clamp-2">{product.description}</p>

                    {/* Thumbnail Gallery - List View */}
                    {viewMode === 'list' && hasMultipleImages && (
                        <div className="mb-4">
                            <ThumbnailGallery
                                images={images}
                                currentIndex={currentImageIndex}
                                onSelect={handleThumbnailSelect}
                                size="small"
                            />
                        </div>
                    )}

                    {/* Variants */}
                    {priceInfo.hasVariants && priceInfo.variants.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {priceInfo.variants.slice(0, 3).map((variant, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleVariantSelect(product._id, index)}
                                    disabled={!isVariantInStock(variant)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${selectedVariantIndex === index
                                        ? 'bg-vanilla-900 text-white'
                                        : !isVariantInStock(variant)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                            : 'bg-vanilla-100 text-charcoal hover:bg-vanilla-200'
                                        }`}
                                >
                                    {variant.label}
                                </button>
                            ))}
                            {priceInfo.variants.length > 3 && (
                                <span className="px-3 py-1.5 text-xs text-charcoal/50">
                                    +{priceInfo.variants.length - 3} more
                                </span>
                            )}
                        </div>
                    )}

                    <div className={`flex items-center justify-between gap-4 ${viewMode === 'list' ? 'mt-auto' : 'mt-auto'}`}>
                        {renderPrice(product)}
                        {viewMode === 'list' && inStock && (
                            <button
                                onClick={(e) => handleAddToCart(product, e)}
                                disabled={!canAddToCart() || isAddingToCart}
                                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-vanilla-900 text-white rounded-xl font-medium hover:bg-vanilla-600 transition-colors duration-300 disabled:opacity-50"
                            >
                                {isAddingToCart ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
                                <span>{priceInfo.hasVariants && selectedVariantIndex === undefined ? 'Select' : 'Add'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // --- QUICK VIEW MODAL ---
    const QuickViewModal = ({ product, onClose }) => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0)
        const [localSelectedVariant, setLocalSelectedVariant] = useState(selectedVariants[product._id])
        const [isAdding, setIsAdding] = useState(false)

        if (!product) return null

        const priceInfo = getProductPriceInfo(product)
        const inStock = isProductInStock(product)
        const images = getAllProductImages(product, localSelectedVariant)
        const hasMultipleImages = images.length > 1

        const getLocalSelectedVariant = () => {
            if (localSelectedVariant !== undefined && product.variants && product.variants[localSelectedVariant]) {
                return { ...product.variants[localSelectedVariant], index: localSelectedVariant }
            }
            return null
        }
        const selectedVariant = getLocalSelectedVariant()

        // Reset image index when variant changes
        useEffect(() => {
            setCurrentImageIndex(0)
        }, [localSelectedVariant])

        const handleModalAddToCart = () => {
            if (priceInfo.hasVariants && localSelectedVariant === undefined) return
            if (!inStock) return
            setIsAdding(true)

            const variant = getLocalSelectedVariant()
            const modalImages = getAllProductImages(product, localSelectedVariant)
            const itemPrice = variant ? getPriceValue(variant) : getPriceValue(product);

            const cartItem = {
                productId: product._id,
                name: product.name,
                slug: product.slug,
                price: itemPrice,
                currency: currency,
                stock: variant ? variant.stock : product.stock,
                image: modalImages[0] || null,
                quantity: 1,
                weight: variant ? variant.weight : product.weight,
                variantLabel: variant ? variant.label : null,
                variant: variant ? { label: variant.label, weight: variant.weight, price: itemPrice, stock: variant.stock } : null
            }

            if (typeof addToCart === 'function') addToCart(cartItem)
            else alert("Added to cart (Mock)")

            setTimeout(() => setIsAdding(false), 1000)
        }

        const renderModalPrice = () => {
            if (selectedVariant) return <span className="font-serif text-2xl font-bold text-vanilla-900">{formatPrice(getPriceValue(selectedVariant))}</span>
            if (!priceInfo.hasVariants) return <span className="font-serif text-2xl font-bold text-vanilla-900">{formatPrice(priceInfo.displayPrice)}</span>
            if (priceInfo.isRange) return <span className="font-serif text-xl font-bold text-vanilla-900">{formatPrice(priceInfo.minPrice)} - {formatPrice(priceInfo.maxPrice)}</span>
            return <span className="font-serif text-2xl font-bold text-vanilla-900">{formatPrice(priceInfo.displayPrice)}</span>
        }

        const handleThumbnailSelect = (index) => {
            setCurrentImageIndex(index)
        }

        const handleVariantChange = (index) => {
            setLocalSelectedVariant(index)
            handleVariantSelect(product._id, index)
        }

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-vanilla-900/60 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
                    <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 bg-vanilla-100 rounded-full flex items-center justify-center hover:bg-vanilla-200 transition-colors">
                        <X className="w-5 h-5" />
                    </button>

                    {/* Image Section */}
                    <div className="w-full md:w-1/2 bg-vanilla-50 flex flex-col">
                        {/* Main Image */}
                        <div className="relative aspect-square shrink-0">
                            {images.length > 0 ? (
                                <img
                                    src={images[currentImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-vanilla-400">
                                    <ImageIcon className="w-16 h-16" />
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            {hasMultipleImages && (
                                <>
                                    <button
                                        onClick={() => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImageIndex((p) => (p + 1) % images.length)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            {hasMultipleImages && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-vanilla-900/70 backdrop-blur-sm rounded-full text-white text-sm">
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {hasMultipleImages && (
                            <div className="p-4 bg-white border-t border-vanilla-100">
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleThumbnailSelect(index)}
                                            className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === index
                                                ? 'border-vanilla-900 ring-2 ring-vanilla-400/30'
                                                : 'border-vanilla-200 hover:border-vanilla-400'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`View ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
                        <div className="mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-vanilla-100 text-vanilla-700">
                                {product.category}
                            </span>
                        </div>

                        <h2 className="font-serif text-2xl md:text-3xl text-vanilla-900 font-semibold mb-3">
                            {product.name}
                        </h2>

                        <div className="mb-4">{renderModalPrice()}</div>

                        <p className="text-charcoal/70 mb-6 leading-relaxed">{product.description}</p>

                        {/* Highlights */}
                        {product.highlights && product.highlights.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-vanilla-900 mb-2">Highlights</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.highlights.map((h, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-vanilla-100 text-vanilla-700 rounded-full text-sm flex items-center gap-1">
                                            <Check className="w-3 h-3" /> {h}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Variant Selection */}
                        {priceInfo.hasVariants && priceInfo.variants.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-vanilla-900 mb-3">Select Option</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {priceInfo.variants.map((variant, index) => {
                                        const variantInStock = isVariantInStock(variant)
                                        const variantImages = getVariantImages(product, index)
                                        const hasVariantImage = variantImages.length > 0

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleVariantChange(index)}
                                                disabled={!variantInStock}
                                                className={`p-3 rounded-xl text-left border-2 transition-all flex items-center gap-3 ${localSelectedVariant === index
                                                    ? 'border-vanilla-900 bg-vanilla-900/5'
                                                    : !variantInStock
                                                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                                        : 'border-vanilla-200 hover:border-vanilla-400'
                                                    }`}
                                            >
                                                {/* Variant Thumbnail */}
                                                {hasVariantImage && (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-vanilla-200">
                                                        <img
                                                            src={variantImages[0]}
                                                            alt={variant.label}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className={`font-medium text-sm truncate ${!variantInStock ? 'line-through text-gray-400' : 'text-vanilla-900'}`}>
                                                        {variant.label}
                                                    </div>
                                                    <div className="text-vanilla-600 text-sm">
                                                        {formatPrice(getPriceValue(variant))}
                                                    </div>
                                                </div>
                                                {localSelectedVariant === index && (
                                                    <Check className="w-5 h-5 text-vanilla-900 shrink-0" />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Stock Status */}
                        <div className="mb-6">
                            {inStock ? (
                                <div className="flex items-center gap-2 text-green-600">
                                    <Check className="w-4 h-4" />
                                    <span className="text-sm font-medium">In Stock</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-500">
                                    <X className="w-4 h-4" />
                                    <span className="text-sm font-medium">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-auto pt-4 border-t border-vanilla-100 space-y-3">
                            <button
                                onClick={handleModalAddToCart}
                                disabled={!inStock || (priceInfo.hasVariants && localSelectedVariant === undefined) || isAdding}
                                className="w-full py-4 bg-vanilla-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-vanilla-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAdding ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>
                                            {!inStock
                                                ? 'Out of Stock'
                                                : priceInfo.hasVariants && localSelectedVariant === undefined
                                                    ? 'Select an Option'
                                                    : 'Add to Cart'
                                            }
                                        </span>
                                    </>
                                )}
                            </button>
                            <Link
                                to={`/products/${product.slug}`}
                                className="w-full py-3 border-2 border-vanilla-200 text-vanilla-900 rounded-xl font-medium flex items-center justify-center hover:bg-vanilla-50 transition-colors"
                                onClick={onClose}
                            >
                                View Full Details <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-vanilla-50">
            <Navbar onShopClick={resetFilters} />

            {/* Hero Section */}
            <div className="bg-vanilla-900 text-white pt-32 pb-16 mb-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4">
                        Our <span className="text-vanilla-400 italic">Shop</span>
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                        Discover our complete collection of premium vanilla products, carefully sourced and crafted in Sri Lanka.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

                {/* Controls */}
                <div className="bg-white rounded-2xl shadow-sm border border-vanilla-100 p-4 sm:p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                            <input
                                type="text"
                                placeholder="Search vanilla products..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(9); }}
                                className="w-full pl-12 pr-10 py-3.5 bg-vanilla-50 border border-vanilla-200 rounded-xl text-vanilla-900 focus:outline-none focus:border-vanilla-400 focus:ring-2 focus:ring-vanilla-400/20 transition-all"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-vanilla-200 rounded-full flex items-center justify-center hover:bg-vanilla-300">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center justify-center gap-2 px-5 py-3.5 bg-vanilla-100 text-vanilla-900 rounded-xl hover:bg-vanilla-200">
                            <SlidersHorizontal className="w-5 h-5" /> Filters <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Sort */}
                        <div className="relative">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none w-full lg:w-48 px-4 py-3.5 pr-10 bg-vanilla-50 border border-vanilla-200 rounded-xl text-vanilla-900 font-medium focus:outline-none focus:border-vanilla-400 cursor-pointer">
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="name-a-z">Name: A-Z</option>
                                <option value="price-low">Price: Low-High</option>
                                <option value="price-high">Price: High-Low</option>
                            </select>
                            <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" />
                        </div>

                        {/* Currency Selector */}
                        <div className="relative">
                            <select 
                                value={currency} 
                                onChange={(e) => setCurrency(e.target.value)} 
                                className="appearance-none w-full lg:w-32 px-4 py-3.5 pr-10 bg-vanilla-50 border border-vanilla-200 rounded-xl text-vanilla-900 font-medium focus:outline-none focus:border-vanilla-400 cursor-pointer"
                            >
                                <option value="LKR">LKR (Rs)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                            <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" />
                        </div>

                        {/* View Toggle */}
                        <div className="hidden sm:flex items-center bg-vanilla-100 rounded-xl p-1">
                            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-vanilla-900 shadow-sm' : 'text-charcoal/60'}`}><Grid3X3 className="w-5 h-5" /></button>
                            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-vanilla-900 shadow-sm' : 'text-charcoal/60'}`}><LayoutList className="w-5 h-5" /></button>
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    <div className={`${showFilters || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block mt-6 pt-6 border-t border-vanilla-100`}>
                        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                            <span className="text-sm font-semibold text-vanilla-900">Category:</span>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => { setSelectedCategory(category); setVisibleCount(9); }}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${selectedCategory === category ? 'bg-vanilla-900 text-white shadow-lg' : 'bg-vanilla-100 text-charcoal hover:bg-vanilla-200'}`}
                                    >
                                        {category === 'all' ? 'All' : category}
                                    </button>
                                ))}
                            </div>

                            {(searchQuery || selectedCategory !== 'all' || sortBy !== 'featured' || currency !== 'LKR') && (
                                <button onClick={resetFilters} className="lg:ml-auto text-sm text-vanilla-600 hover:text-vanilla-700 font-medium underline">Reset Filters</button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="mb-6 flex items-center justify-between">
                    <span className="text-charcoal/70">
                        Showing <span className="font-semibold text-vanilla-900">{displayedProducts.length}</span> of <span className="font-semibold text-vanilla-900">{filteredProducts.length}</span> products
                    </span>
                    <span className="text-sm text-charcoal/50">
                        Prices in {currency === 'USD' ? 'US Dollars ($)' : 'Sri Lankan Rupees (Rs)'}
                    </span>
                </div>

                {/* Product Grid/List */}
                {isLoading && allProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <Loader2 className="w-12 h-12 text-vanilla-500 animate-spin mx-auto mb-4" />
                        <p className="text-charcoal/60">Loading products...</p>
                    </div>
                ) : displayedProducts.length > 0 ? (
                    <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8' : 'flex flex-col gap-4'}>
                        {displayedProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-vanilla-100">
                        <div className="w-24 h-24 bg-vanilla-100 rounded-full flex items-center justify-center mx-auto mb-6"><Search className="w-10 h-10 text-vanilla-400" /></div>
                        <h3 className="text-2xl font-semibold text-vanilla-900 mb-3">No products found</h3>
                        <p className="text-charcoal/60 mb-8 max-w-md mx-auto">Try adjusting your search or filters.</p>
                        <button onClick={resetFilters} className="inline-flex items-center gap-2 px-6 py-3 bg-vanilla-900 text-white rounded-full font-medium hover:bg-vanilla-600 transition-colors">Clear All Filters</button>
                    </div>
                )}

                {/* Load More */}
                {hasMore && displayedProducts.length > 0 && (
                    <div className="text-center mt-12">
                        <button
                            onClick={() => { setIsLoading(true); setTimeout(() => { setVisibleCount(prev => prev + 9); setIsLoading(false); }, 800); }}
                            disabled={isLoading}
                            className="inline-flex items-center gap-3 px-10 py-4 bg-vanilla-900 text-white font-semibold rounded-full hover:bg-vanilla-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
                        >
                            {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Loading...</> : <>Discover More</>}
                        </button>
                    </div>
                )}
            </div>

            <Footer />

            {/* Quick View Modal */}
            {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
        </div>
    )
}

export default Shop