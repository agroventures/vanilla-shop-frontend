import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
    ShoppingBag,
    Share2,
    ChevronLeft,
    ChevronRight,
    Check,
    Minus,
    Plus,
    Package,
    Truck,
    Shield,
    RotateCcw,
    Sparkles,
    Info,
    Leaf,
    ImageIcon,
    Loader2,
    Home,
    Copy,
    Facebook,
    Twitter,
    Mail,
    X,
    Scale,
    AlertCircle,
    Globe
} from 'lucide-react'
import axios from 'axios'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { addToCart } from '../utils/Cart'
import useSEO from '../hooks/useSEO'

const ProductDetail = () => {
    const { slug } = useParams()

    // State
    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState('description')
    const [showShareMenu, setShowShareMenu] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)
    const [relatedProducts, setRelatedProducts] = useState([])
    const [isImageZoomed, setIsImageZoomed] = useState(false)
    
    // Currency state - load from localStorage or default to LKR
    const [currency, setCurrency] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('preferredCurrency') || 'LKR'
        }
        return 'LKR'
    })

    // Save currency preference to localStorage
    useEffect(() => {
        localStorage.setItem('preferredCurrency', currency)
    }, [currency])

    // Fetch product
    useEffect(() => {
        setIsLoading(true)
        setError(null)
        setSelectedVariantIndex(null)
        setQuantity(1)
        setCurrentImageIndex(0)

        axios
            .get(`${import.meta.env.VITE_API_URL}/products/${slug}`)
            .then((response) => {
                if (response.data && response.data.isActive !== false) {
                    setProduct(response.data)

                    if (response.data.variants && response.data.variants.length > 0) {
                        const firstInStockIndex = response.data.variants.findIndex(v => v.stock > 0)
                        if (firstInStockIndex !== -1) {
                            setSelectedVariantIndex(firstInStockIndex)
                        }
                    }

                    fetchRelatedProducts(response.data.category, response.data._id)
                } else {
                    setError('Product not found')
                }
                setIsLoading(false)
            })
            .catch((err) => {
                console.error("Error fetching product:", err)
                setError('Failed to load product')
                setIsLoading(false)
            })
    }, [slug])

    // Reset image index when variant changes
    useEffect(() => {
        setCurrentImageIndex(0)
    }, [selectedVariantIndex])

    const url = window.location.href;

    useSEO({
        title: product ? product.name : "Loading...",
        description: product ? product.description : "The Vanilla Shop is more than a café — it's Sri Lanka's first dedicated vanilla boutique.",
        url,
        image_alt: product ? product.name : "Loading...",
        twitter_card: "summary_large_image",
    });

    const fetchRelatedProducts = (category, currentProductId) => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/products`)
            .then((response) => {
                const related = response.data
                    .filter(p => p.category === category && p._id !== currentProductId && p.isActive !== false)
                    .slice(0, 4)
                setRelatedProducts(related)
            })
            .catch((err) => {
                console.error("Error fetching related products:", err)
            })
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [slug])

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    const hasVariants = () => product?.variants && product.variants.length > 0

    // Get product-level images
    const getProductImages = () => {
        if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
            return product.images
        }
        return []
    }

    // Get variant images if available
    const getVariantImages = (variantIndex) => {
        if (variantIndex !== null && variantIndex !== undefined && product?.variants?.[variantIndex]) {
            const variant = product.variants[variantIndex]
            if (variant.images && Array.isArray(variant.images) && variant.images.length > 0) {
                return variant.images
            }
        }
        return []
    }

    // Get ALL images with selected variant images first (no duplicates)
    const getAllProductImages = () => {
        if (!product) return []
        
        let allImages = []
        const addedImages = new Set()

        const addImages = (images, source = null) => {
            if (images && Array.isArray(images)) {
                images.forEach(img => {
                    if (img && !addedImages.has(img)) {
                        addedImages.add(img)
                        allImages.push({ url: img, source })
                    }
                })
            }
        }

        // 1. If a variant is selected, add its images FIRST
        if (selectedVariantIndex !== null && product.variants && product.variants[selectedVariantIndex]) {
            const selectedVariant = product.variants[selectedVariantIndex]
            if (selectedVariant.images && selectedVariant.images.length > 0) {
                addImages(selectedVariant.images, { type: 'variant', label: selectedVariant.label, index: selectedVariantIndex })
            }
        }

        // 2. Add base product images
        addImages(product.images, { type: 'product', label: 'Product' })

        // 3. Add other variants' images (not the selected one)
        if (product.variants && Array.isArray(product.variants)) {
            product.variants.forEach((variant, index) => {
                if (index !== selectedVariantIndex && variant.images && variant.images.length > 0) {
                    addImages(variant.images, { type: 'variant', label: variant.label, index })
                }
            })
        }

        return allImages
    }

    const getDisplayImages = () => {
        return getAllProductImages().map(img => img.url)
    }

    const getImageSource = (imageIndex) => {
        const allImages = getAllProductImages()
        return allImages[imageIndex]?.source || null
    }

    const isShowingVariantImagesFirst = () => {
        if (selectedVariantIndex !== null && product?.variants?.[selectedVariantIndex]) {
            const variant = product.variants[selectedVariantIndex]
            return variant.images && Array.isArray(variant.images) && variant.images.length > 0
        }
        return false
    }

    const getSelectedVariant = () => {
        if (selectedVariantIndex !== null && product?.variants?.[selectedVariantIndex]) {
            return product.variants[selectedVariantIndex]
        }
        return null
    }

    const isVariantInStock = (variant) => variant?.stock > 0

    const isProductInStock = () => {
        if (!product) return false
        if (hasVariants()) {
            return product.variants.some(v => v.stock > 0)
        } else {
            return (product.stock || 0) > 0
        }
    }

    const getTotalStock = () => {
        if (!product) return 0
        if (hasVariants()) {
            return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
        } else {
            return product.stock || 0
        }
    }

    const getAvailableStock = () => {
        if (!product) return 0
        if (hasVariants()) {
            const selectedVariant = getSelectedVariant()
            return selectedVariant?.stock || 0
        } else {
            return product.stock || 0
        }
    }

    // --- Price Helpers with Currency Support ---
    const getPriceValue = (item) => {
        if (!item) return 0;
        if (currency === 'USD') {
            return item.priceInUSD || 0;
        }
        return item.priceInLKR || item.price || 0;
    }

    const formatPrice = (price) => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD',
                minimumFractionDigits: 2
            }).format(price)
        }
        return 'LKR ' + new Intl.NumberFormat('en-LK', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price)
    }

    const getPriceInfo = () => {
        if (!product) return { hasPrice: false, min: 0, max: 0, single: 0, hasRange: false }

        if (hasVariants()) {
            const prices = product.variants.map(v => getPriceValue(v)).filter(p => p > 0)
            const basePrice = getPriceValue(product)

            if (prices.length === 0) {
                if (basePrice > 0) {
                    return { hasPrice: true, min: basePrice, max: basePrice, single: basePrice, hasRange: false }
                }
                return { hasPrice: false, min: 0, max: 0, single: 0, hasRange: false }
            }
            const min = Math.min(...prices)
            const max = Math.max(...prices)
            return { hasPrice: true, min, max, single: min, hasRange: min !== max }
        } else {
            const price = getPriceValue(product)
            if (price > 0) {
                return { hasPrice: true, min: price, max: price, single: price, hasRange: false }
            }
            return { hasPrice: false, min: 0, max: 0, single: 0, hasRange: false }
        }
    }

    const getCurrentPrice = () => {
        if (hasVariants()) {
            const selectedVariant = getSelectedVariant()
            return selectedVariant ? getPriceValue(selectedVariant) : 0
        } else {
            return getPriceValue(product)
        }
    }

    // Check if product has price in current currency
    const hasPriceInCurrentCurrency = () => {
        if (!product) return false
        
        if (hasVariants()) {
            return product.variants.some(v => getPriceValue(v) > 0)
        } else {
            return getPriceValue(product) > 0
        }
    }

    const canAddToCart = () => {
        if (!product) return false
        const currentPrice = getCurrentPrice()
        if (hasVariants()) {
            const selectedVariant = getSelectedVariant()
            return selectedVariant && isVariantInStock(selectedVariant) && currentPrice > 0
        } else {
            return isProductInStock() && currentPrice > 0
        }
    }

    // ============================================
    // IMAGE NAVIGATION
    // ============================================

    const images = getDisplayImages()
    const hasMultipleImages = images.length > 1

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    // ============================================
    // QUANTITY HANDLERS
    // ============================================

    const incrementQuantity = () => {
        const maxStock = getAvailableStock()
        if (quantity < maxStock) {
            setQuantity(prev => prev + 1)
        }
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    // ============================================
    // CART HANDLER
    // ============================================

    const handleAddToCart = () => {
        if (!canAddToCart()) return

        const selectedVariant = getSelectedVariant()
        const itemPrice = getCurrentPrice()

        const cartItem = {
            productId: product._id,
            name: product.name,
            slug: product.slug,
            price: itemPrice,
            priceInLKR: hasVariants() ? selectedVariant?.priceInLKR : product.priceInLKR,
            priceInUSD: hasVariants() ? selectedVariant?.priceInUSD : product.priceInUSD,
            currency: currency,
            stock: getAvailableStock(),
            image: images[0] || null,
            quantity: quantity,
            weight: hasVariants() ? selectedVariant?.weight : product.weight,
            variantLabel: hasVariants() ? selectedVariant?.label : null,
            variant: hasVariants() ? {
                label: selectedVariant.label,
                weight: selectedVariant.weight,
                priceInLKR: selectedVariant.priceInLKR,
                priceInUSD: selectedVariant.priceInUSD,
                price: itemPrice,
                stock: selectedVariant.stock
            } : null
        }

        addToCart(cartItem)
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
    }

    // ============================================
    // SHARE HANDLERS
    // ============================================

    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareTitle = product?.name || 'Check out this product'

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl)
        setShowShareMenu(false)
    }

    const handleShare = (platform) => {
        const urls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
            email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`
        }
        window.open(urls[platform], '_blank')
        setShowShareMenu(false)
    }

    // ============================================
    // CURRENCY SELECTOR COMPONENT
    // ============================================

    const CurrencySelector = ({ className = "" }) => (
        <div className={`relative ${className}`}>
            <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)} 
                className="appearance-none pl-8 pr-8 py-2 bg-white border border-vanilla-200 rounded-full text-vanilla-900 font-medium text-sm focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 cursor-pointer shadow-sm hover:border-vanilla-300 transition-colors"
            >
                <option value="LKR">🇱🇰 LKR (Rs)</option>
                <option value="USD">🇺🇸 USD ($)</option>
            </select>
            <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-500 pointer-events-none" />
            <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-400 pointer-events-none rotate-90" />
        </div>
    )

    // ============================================
    // RENDER PRICE
    // ============================================

    const renderPrice = () => {
        const priceInfo = getPriceInfo()
        const selectedVariant = getSelectedVariant()

        // Show message if no price in current currency
        if (!hasPriceInCurrentCurrency()) {
            return (
                <div className="flex items-center gap-2 text-vanilla-800/50">
                    <AlertCircle className="w-5 h-5" />
                    <span className="italic text-lg font-sans">
                        Price not available in {currency}
                    </span>
                </div>
            )
        }

        if (hasVariants() && selectedVariant) {
            const variantPrice = getPriceValue(selectedVariant)
            if (variantPrice <= 0) {
                return (
                    <div className="flex items-center gap-2 text-vanilla-800/50">
                        <AlertCircle className="w-5 h-5" />
                        <span className="italic text-lg font-sans">
                            Price not available in {currency}
                        </span>
                    </div>
                )
            }
            return (
                <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-serif text-4xl font-bold text-gold-500">
                        {formatPrice(variantPrice)}
                    </span>
                    {selectedVariant.weight && (
                        <span className="text-vanilla-800/60 font-sans text-lg">
                            / {selectedVariant.weight}
                        </span>
                    )}
                </div>
            )
        }

        if (!hasVariants() && priceInfo.hasPrice) {
            return (
                <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-serif text-4xl font-bold text-gold-500">
                        {formatPrice(priceInfo.single)}
                    </span>
                    {product.weight && (
                        <span className="text-vanilla-800/60 font-sans text-lg">
                            / {product.weight}
                        </span>
                    )}
                </div>
            )
        }

        if (hasVariants() && !selectedVariant && priceInfo.hasPrice) {
            if (priceInfo.hasRange) {
                return (
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-serif text-3xl font-bold text-gold-500">
                            {formatPrice(priceInfo.min)}
                        </span>
                        <span className="text-vanilla-800/40 text-xl font-serif">-</span>
                        <span className="font-serif text-3xl font-bold text-gold-500">
                            {formatPrice(priceInfo.max)}
                        </span>
                    </div>
                )
            } else {
                return (
                    <span className="font-serif text-4xl font-bold text-gold-500">
                        {formatPrice(priceInfo.single)}
                    </span>
                )
            }
        }

        return (
            <span className="text-vanilla-800/50 italic text-lg font-sans">
                Price not available
            </span>
        )
    }

    // ============================================
    // LOADING & ERROR STATES
    // ============================================

    if (isLoading) {
        return (
            <main className="pt-24 pb-16 min-h-screen bg-vanilla-50 font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-32">
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
                            <p className="text-vanilla-800/60">Loading product...</p>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (error || !product) {
        return (
            <main className="pt-24 pb-16 min-h-screen bg-vanilla-50 font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-32">
                        <div className="text-center">
                            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-serif font-semibold text-vanilla-900 mb-2">
                                Product Not Found
                            </h2>
                            <p className="text-vanilla-800/60 mb-6">
                                {error || "The product you're looking for doesn't exist or has been removed."}
                            </p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-vanilla-900 text-white rounded-full font-medium hover:bg-gold-500 transition-colors duration-300"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back to Products
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    // ============================================
    // MAIN RENDER
    // ============================================

    const selectedVariant = getSelectedVariant()
    const inStock = isProductInStock()
    const availableStock = getAvailableStock()
    const currentPrice = getCurrentPrice()
    const allImagesWithSource = getAllProductImages()

    return (
        <div className='bg-vanilla-50'>
            <Navbar />

            <main className="pt-24 pb-16 min-h-screen bg-vanilla-50 font-sans text-vanilla-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs with Currency Selector */}
                    <nav className="flex items-center justify-between text-sm py-6 gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto">
                            <Link
                                to="/"
                                className="text-vanilla-800/60 hover:text-gold-500 transition-colors flex items-center gap-1 shrink-0"
                            >
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">Home</span>
                            </Link>
                            <ChevronRight className="w-4 h-4 text-vanilla-200 shrink-0" />
                            <Link
                                to="/shop"
                                className="text-vanilla-800/60 hover:text-gold-500 transition-colors shrink-0"
                            >
                                Products
                            </Link>
                            <ChevronRight className="w-4 h-4 text-vanilla-200 shrink-0" />
                            <span className="text-vanilla-900 font-medium truncate max-w-37.5 sm:max-w-none">
                                {product.name}
                            </span>
                        </div>
                        
                        {/* Currency Selector in Breadcrumb Area */}
                        <CurrencySelector className="shrink-0" />
                    </nav>

                    {/* Main Product Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-vanilla-100 overflow-hidden mb-12">
                        <div className="grid lg:grid-cols-2">
                            {/* ==================== */}
                            {/* IMAGE GALLERY */}
                            {/* ==================== */}
                            <div className="relative bg-vanilla-50 p-4 lg:p-8">
                                {/* Main Image */}
                                <div
                                    className="relative aspect-square rounded-2xl overflow-hidden bg-white cursor-zoom-in shadow-sm"
                                    onClick={() => images.length > 0 && setIsImageZoomed(true)}
                                >
                                    {images.length > 0 ? (
                                        <img
                                            src={images[currentImageIndex]}
                                            alt={`${product.name} - Image ${currentImageIndex + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center text-vanilla-200">
                                                <ImageIcon className="w-16 h-16 mx-auto mb-3" />
                                                <span className="text-lg text-vanilla-400">No image available</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Arrows */}
                                    {hasMultipleImages && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-vanilla-900 hover:text-gold-500 hover:bg-white transition-colors duration-300 shadow-md"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-vanilla-900 hover:text-gold-500 hover:bg-white transition-colors duration-300 shadow-md"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-vanilla-900 text-white shadow-lg tracking-wide">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Current Image Source Indicator */}
                                    {allImagesWithSource[currentImageIndex]?.source?.type === 'variant' && (
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gold-500 text-white shadow-lg">
                                                {allImagesWithSource[currentImageIndex].source.label}
                                            </span>
                                        </div>
                                    )}

                                    {/* Out of Stock Overlay */}
                                    {!inStock && (
                                        <div className="absolute inset-0 bg-vanilla-900/40 flex items-center justify-center">
                                            <span className="bg-white text-vanilla-900 px-6 py-3 rounded-full font-serif font-bold text-lg shadow-xl">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}

                                    {/* Image Counter */}
                                    {hasMultipleImages && (
                                        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-vanilla-900/80 backdrop-blur-sm rounded-full text-white text-xs tracking-widest font-sans">
                                            {currentImageIndex + 1} / {images.length}
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Gallery */}
                                {images.length > 0 && (
                                    <div className="mt-4">
                                        {isShowingVariantImagesFirst() && (
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-xs text-vanilla-500 font-medium uppercase tracking-wide">
                                                    Showing: {selectedVariant?.label} images first
                                                </span>
                                                <div className="flex-1 h-px bg-vanilla-200" />
                                            </div>
                                        )}
                                        
                                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gold-500">
                                            {allImagesWithSource.map((imageData, index) => {
                                                const isSelected = index === currentImageIndex
                                                const isVariantImage = imageData.source?.type === 'variant'
                                                const isCurrentVariantImage = isVariantImage && imageData.source?.index === selectedVariantIndex
                                                
                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 group ${
                                                            isSelected
                                                                ? 'border-gold-500 shadow-md ring-2 ring-gold-500/20'
                                                                : 'border-transparent hover:border-vanilla-300'
                                                        }`}
                                                    >
                                                        <img
                                                            src={imageData.url}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        
                                                        {isVariantImage && (
                                                            <div className={`absolute bottom-0 left-0 right-0 py-0.5 text-center text-[10px] font-medium truncate px-1 ${
                                                                isCurrentVariantImage 
                                                                    ? 'bg-gold-500 text-white' 
                                                                    : 'bg-vanilla-900/70 text-white'
                                                            }`}>
                                                                {imageData.source.label}
                                                            </div>
                                                        )}
                                                        
                                                        {imageData.source?.type === 'product' && hasVariants() && (
                                                            <div className="absolute bottom-0 left-0 right-0 py-0.5 bg-vanilla-600/70 text-white text-center text-[10px] font-medium">
                                                                Base
                                                            </div>
                                                        )}

                                                        <div className={`absolute inset-0 transition-opacity duration-200 ${
                                                            isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-100 bg-vanilla-900/10'
                                                        }`} />
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        {hasVariants() && (
                                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-vanilla-500">
                                                {getProductImages().length > 0 && (
                                                    <span className="px-2 py-1 bg-vanilla-100 rounded-full">
                                                        {getProductImages().length} base image{getProductImages().length > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                                {product.variants.map((variant, idx) => {
                                                    const variantImgCount = variant.images?.length || 0
                                                    if (variantImgCount === 0) return null
                                                    return (
                                                        <span 
                                                            key={idx}
                                                            className={`px-2 py-1 rounded-full cursor-pointer transition-colors ${
                                                                idx === selectedVariantIndex 
                                                                    ? 'bg-gold-500 text-white' 
                                                                    : 'bg-vanilla-100 hover:bg-vanilla-200'
                                                            }`}
                                                            onClick={() => {
                                                                setSelectedVariantIndex(idx)
                                                                setQuantity(1)
                                                            }}
                                                        >
                                                            {variant.label}: {variantImgCount}
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ==================== */}
                            {/* PRODUCT INFO */}
                            {/* ==================== */}
                            <div className="p-6 lg:p-10 flex flex-col">
                                {/* Header */}
                                <div className="mb-6">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <h1 className="font-serif text-3xl lg:text-4xl text-vanilla-900 font-bold leading-tight">
                                            {product.name}
                                        </h1>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {/* Share Button */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                                    className="w-12 h-12 rounded-full border-2 border-vanilla-100 flex items-center justify-center text-vanilla-800/60 hover:border-gold-500 hover:text-gold-500 transition-all duration-300 bg-white"
                                                >
                                                    <Share2 className="w-5 h-5" />
                                                </button>

                                                {showShareMenu && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-10"
                                                            onClick={() => setShowShareMenu(false)}
                                                        />
                                                        <div className="absolute right-0 top-14 bg-white rounded-xl shadow-xl border border-vanilla-100 py-2 w-48 z-20">
                                                            <button
                                                                onClick={handleCopyLink}
                                                                className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-vanilla-50 transition-colors"
                                                            >
                                                                <Copy className="w-4 h-4 text-vanilla-800" />
                                                                <span className="text-sm text-vanilla-800">Copy Link</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleShare('facebook')}
                                                                className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-vanilla-50 transition-colors"
                                                            >
                                                                <Facebook className="w-4 h-4 text-blue-600" />
                                                                <span className="text-sm text-vanilla-800">Facebook</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleShare('twitter')}
                                                                className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-vanilla-50 transition-colors"
                                                            >
                                                                <Twitter className="w-4 h-4 text-sky-500" />
                                                                <span className="text-sm text-vanilla-800">Twitter</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleShare('email')}
                                                                className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-vanilla-50 transition-colors"
                                                            >
                                                                <Mail className="w-4 h-4 text-vanilla-800" />
                                                                <span className="text-sm text-vanilla-800">Email</span>
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Display with Currency Info */}
                                    <div className="mb-4">
                                        {renderPrice()}
                                        {/* Currency indicator */}
                                        <p className="text-xs text-vanilla-500 mt-1 flex items-center gap-1">
                                            <Globe className="w-3 h-3" />
                                            Showing prices in {currency === 'LKR' ? 'Sri Lankan Rupees' : 'US Dollars'}
                                        </p>
                                    </div>

                                    {/* Stock Status */}
                                    {inStock ? (
                                        <div className="flex items-center gap-2 text-green-700">
                                            <Check className="w-5 h-5" />
                                            <span className="font-medium font-sans">In Stock</span>
                                            <span className="text-vanilla-800/50 text-sm">
                                                ({getTotalStock()} available)
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-500">
                                            <X className="w-5 h-5" />
                                            <span className="font-medium font-sans">Out of Stock</span>
                                        </div>
                                    )}
                                </div>

                                {/* Short Description */}
                                <p className="text-vanilla-800/80 leading-relaxed mb-6 font-sans">
                                    {product.description}
                                </p>

                                {/* Highlights */}
                                {product.highlights && product.highlights.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {product.highlights.map((highlight, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-vanilla-100 text-vanilla-900 rounded-full text-sm font-medium border border-vanilla-200"
                                            >
                                                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                                                {highlight}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Weight (only if no variants) */}
                                {!hasVariants() && product.weight && (
                                    <div className="flex items-center gap-2 mb-6 text-vanilla-800/70">
                                        <Scale className="w-5 h-5" />
                                        <span className="font-medium">Weight:</span>
                                        <span>{product.weight}</span>
                                    </div>
                                )}

                                {/* Variant Selection */}
                                {hasVariants() && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-bold text-vanilla-900 mb-3 tracking-wide uppercase">
                                            Select Option
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {product.variants.map((variant, index) => {
                                                const variantInStock = isVariantInStock(variant)
                                                const isSelected = selectedVariantIndex === index
                                                const hasVariantImages = variant.images && variant.images.length > 0
                                                const variantPrice = getPriceValue(variant)
                                                const hasPrice = variantPrice > 0

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            if (variantInStock) {
                                                                setSelectedVariantIndex(index)
                                                                setQuantity(1)
                                                            }
                                                        }}
                                                        disabled={!variantInStock}
                                                        className={`p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                                                            isSelected
                                                                ? 'border-gold-500 bg-vanilla-100 shadow-sm'
                                                                : !variantInStock
                                                                    ? 'border-vanilla-100 bg-gray-50 opacity-60 cursor-not-allowed'
                                                                    : 'border-vanilla-100 hover:border-gold-500/50 hover:bg-vanilla-50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="flex items-center gap-2">
                                                                {hasVariantImages && (
                                                                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-vanilla-200 shrink-0">
                                                                        <img 
                                                                            src={variant.images[0]} 
                                                                            alt={variant.label}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <span className={`font-semibold font-serif ${
                                                                    !variantInStock ? 'text-vanilla-800/40 line-through' : 'text-vanilla-900'
                                                                }`}>
                                                                    {variant.label}
                                                                </span>
                                                            </div>
                                                            {isSelected && (
                                                                <Check className="w-5 h-5 text-gold-500" />
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            {hasPrice ? (
                                                                <span className="text-gold-500 font-bold font-serif">
                                                                    {formatPrice(variantPrice)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-vanilla-400 text-sm italic">
                                                                    No {currency} price
                                                                </span>
                                                            )}
                                                            {variant.weight && (
                                                                <span className="text-vanilla-800/50 text-sm flex items-center gap-1">
                                                                    <Scale className="w-3 h-3" />
                                                                    {variant.weight}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className={`text-xs font-medium ${
                                                                variantInStock ? 'text-green-700' : 'text-red-500'
                                                            }`}>
                                                                {variantInStock ? `${variant.stock} in stock` : 'Out of stock'}
                                                            </span>
                                                            {hasVariantImages && (
                                                                <span className="text-xs text-vanilla-500 flex items-center gap-1">
                                                                    <ImageIcon className="w-3 h-3" />
                                                                    {variant.images.length}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity & Add to Cart */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center justify-center border-2 border-vanilla-200 rounded-xl overflow-hidden bg-white">
                                        <button
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1 || !inStock}
                                            className="w-12 h-12 flex items-center justify-center text-vanilla-800 hover:bg-vanilla-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-16 text-center font-bold text-vanilla-900 font-serif text-lg">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={incrementQuantity}
                                            disabled={quantity >= availableStock || !inStock}
                                            className="w-12 h-12 flex items-center justify-center text-vanilla-800 hover:bg-vanilla-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!canAddToCart()}
                                        className={`flex-1 py-4 px-8 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                                            addedToCart
                                                ? 'bg-green-600 text-white'
                                                : !canAddToCart()
                                                    ? 'bg-vanilla-200 text-vanilla-800/50 cursor-not-allowed'
                                                    : 'bg-vanilla-900 text-white hover:bg-gold-500 hover:shadow-lg hover:-translate-y-0.5'
                                        }`}
                                    >
                                        {addedToCart ? (
                                            <>
                                                <Check className="w-5 h-5" />
                                                Added to Cart!
                                            </>
                                        ) : !inStock ? (
                                            <>
                                                <X className="w-5 h-5" />
                                                Out of Stock
                                            </>
                                        ) : hasVariants() && !selectedVariant ? (
                                            <>
                                                <Package className="w-5 h-5" />
                                                Select an Option
                                            </>
                                        ) : currentPrice <= 0 ? (
                                            <>
                                                <AlertCircle className="w-5 h-5" />
                                                No {currency} Price
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-5 h-5" />
                                                Add to Cart <span className="hidden sm:inline">- {formatPrice(currentPrice * quantity)}</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Selected Variant Summary */}
                                {hasVariants() && selectedVariant && (
                                    <div className="mb-6 p-4 bg-vanilla-50 rounded-xl border border-vanilla-100">
                                        <p className="text-sm text-vanilla-800/70">
                                            <span className="font-bold text-vanilla-900">Selected:</span>{' '}
                                            {selectedVariant.label}
                                            {selectedVariant.weight && ` (${selectedVariant.weight})`}
                                            {getPriceValue(selectedVariant) > 0 && (
                                                <>
                                                    {' • '}
                                                    <span className="text-gold-500 font-bold">
                                                        {formatPrice(getPriceValue(selectedVariant))}
                                                    </span>
                                                </>
                                            )}
                                            {' • '}
                                            <span className="text-green-700">
                                                {selectedVariant.stock} in stock
                                            </span>
                                            {selectedVariant.images && selectedVariant.images.length > 0 && (
                                                <>
                                                    {' • '}
                                                    <span className="text-vanilla-600 inline-flex items-center gap-1">
                                                        <ImageIcon className="w-3 h-3" />
                                                        {selectedVariant.images.length} image{selectedVariant.images.length > 1 ? 's' : ''}
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                )}

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-vanilla-100">
                                    <div className="flex items-center gap-3 p-3 bg-vanilla-50 rounded-xl">
                                        <Truck className="w-5 h-5 text-gold-500" />
                                        <div>
                                            <p className="text-sm font-bold text-vanilla-900">Free Shipping</p>
                                            <p className="text-xs text-vanilla-800/60">
                                                Orders over {currency === 'USD' ? '$25' : 'LKR 5,000'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-vanilla-50 rounded-xl">
                                        <Shield className="w-5 h-5 text-gold-500" />
                                        <div>
                                            <p className="text-sm font-bold text-vanilla-900">Secure Payment</p>
                                            <p className="text-xs text-vanilla-800/60">100% Protected</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-vanilla-50 rounded-xl">
                                        <RotateCcw className="w-5 h-5 text-gold-500" />
                                        <div>
                                            <p className="text-sm font-bold text-vanilla-900">Easy Returns</p>
                                            <p className="text-xs text-vanilla-800/60">30 Day Policy</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-vanilla-50 rounded-xl">
                                        <Leaf className="w-5 h-5 text-gold-500" />
                                        <div>
                                            <p className="text-sm font-bold text-vanilla-900">100% Natural</p>
                                            <p className="text-xs text-vanilla-800/60">Pure Ingredients</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ==================== */}
                    {/* PRODUCT DETAILS TABS */}
                    {/* ==================== */}
                    <div className="bg-white rounded-3xl shadow-sm border border-vanilla-100 overflow-hidden mb-12">
                        {/* Tab Headers */}
                        <div className="flex border-b border-vanilla-100 overflow-x-auto">
                            {[
                                { id: 'description', label: 'Description', icon: Info },
                                { id: 'ingredients', label: 'Ingredients', icon: Leaf },
                                { id: 'usage', label: 'Usage Tips', icon: Sparkles },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-bold font-serif text-lg transition-all duration-300 whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'text-vanilla-900 border-b-2 border-gold-500 bg-vanilla-50'
                                            : 'text-vanilla-800/50 hover:text-vanilla-900 hover:bg-vanilla-50/50'
                                    }`}
                                >
                                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-gold-500' : ''}`} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 lg:p-10 font-sans">
                            {/* Description Tab */}
                            {activeTab === 'description' && (
                                <div className="prose prose-vanilla max-w-none text-vanilla-800">
                                    <p className="text-vanilla-800/80 leading-relaxed text-lg mb-6">
                                        {product.description}
                                    </p>

                                    {product.highlights && product.highlights.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-xl font-serif font-bold text-vanilla-900 mb-4 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-gold-500" />
                                                Key Highlights
                                            </h3>
                                            <ul className="grid sm:grid-cols-2 gap-3">
                                                {product.highlights.map((highlight, index) => (
                                                    <li key={index} className="flex items-center gap-3">
                                                        <div className="w-6 h-6 bg-vanilla-100 rounded-full flex items-center justify-center shrink-0 border border-vanilla-200">
                                                            <Check className="w-3.5 h-3.5 text-gold-500" />
                                                        </div>
                                                        <span className="text-vanilla-800/80">{highlight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {hasVariants() && (
                                        <div className="mt-8">
                                            <h3 className="text-xl font-serif font-bold text-vanilla-900 mb-4 flex items-center gap-2">
                                                <Package className="w-5 h-5 text-gold-500" />
                                                Available Options
                                            </h3>
                                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {product.variants.map((variant, index) => {
                                                    const variantPrice = getPriceValue(variant)
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`p-4 bg-vanilla-50 rounded-xl border transition-colors cursor-pointer ${
                                                                selectedVariantIndex === index 
                                                                    ? 'border-gold-500 bg-vanilla-100' 
                                                                    : 'border-vanilla-100 hover:border-vanilla-300'
                                                            }`}
                                                            onClick={() => {
                                                                if (isVariantInStock(variant)) {
                                                                    setSelectedVariantIndex(index)
                                                                    setQuantity(1)
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2 mb-1">
                                                                {variant.images && variant.images.length > 0 && (
                                                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-vanilla-200">
                                                                        <img 
                                                                            src={variant.images[0]} 
                                                                            alt={variant.label}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <span className="font-serif font-bold text-vanilla-900">
                                                                        {variant.label}
                                                                    </span>
                                                                    {variant.images && variant.images.length > 0 && (
                                                                        <span className="text-xs text-gold-500 flex items-center gap-1 mt-0.5">
                                                                            <ImageIcon className="w-3 h-3" />
                                                                            {variant.images.length} image{variant.images.length > 1 ? 's' : ''}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {variantPrice > 0 ? (
                                                                <div className="text-gold-500 font-bold">
                                                                    {formatPrice(variantPrice)}
                                                                </div>
                                                            ) : (
                                                                <div className="text-vanilla-400 text-sm italic">
                                                                    No {currency} price
                                                                </div>
                                                            )}
                                                            {variant.weight && (
                                                                <div className="text-vanilla-800/50 text-sm mt-1">
                                                                    {variant.weight}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Ingredients Tab */}
                            {activeTab === 'ingredients' && (
                                <div>
                                    {product.ingredients && product.ingredients.length > 0 ? (
                                        <>
                                            <h3 className="text-xl font-serif font-bold text-vanilla-900 mb-4 flex items-center gap-2">
                                                <Leaf className="w-5 h-5 text-green-600" />
                                                Ingredients
                                            </h3>
                                            <div className="flex flex-wrap gap-3 mb-6">
                                                {product.ingredients.map((ingredient, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 bg-green-50 text-green-800 rounded-full text-sm font-medium border border-green-100"
                                                    >
                                                        {ingredient}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="p-4 bg-vanilla-50 rounded-xl border border-vanilla-100">
                                                <p className="text-vanilla-800/70 text-sm flex items-start gap-2">
                                                    <Leaf className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                                    All ingredients are 100% natural and sustainably sourced from trusted suppliers.
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Leaf className="w-12 h-12 text-vanilla-200 mx-auto mb-4" />
                                            <p className="text-vanilla-800/50 italic">
                                                No ingredient information available for this product.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Usage Tips Tab */}
                            {activeTab === 'usage' && (
                                <div>
                                    {product.usageTips && product.usageTips.length > 0 ? (
                                        <>
                                            <h3 className="text-xl font-serif font-bold text-vanilla-900 mb-6 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-gold-500" />
                                                How to Use
                                            </h3>
                                            <ul className="space-y-4">
                                                {product.usageTips.map((tip, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-4 p-4 bg-vanilla-50 rounded-xl border border-vanilla-100"
                                                    >
                                                        <div className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold font-serif shrink-0 shadow-sm">
                                                            {index + 1}
                                                        </div>
                                                        <p className="text-vanilla-800/80 leading-relaxed pt-1">
                                                            {tip}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Sparkles className="w-12 h-12 text-vanilla-200 mx-auto mb-4" />
                                            <p className="text-vanilla-800/50 italic">
                                                No usage tips available for this product.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ==================== */}
                    {/* RELATED PRODUCTS */}
                    {/* ==================== */}
                    {relatedProducts.length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="font-serif text-2xl lg:text-3xl text-vanilla-900 font-bold">
                                    Related Products
                                </h2>
                                <Link
                                    to="/products"
                                    className="text-gold-500 hover:text-vanilla-900 font-medium flex items-center gap-1 transition-colors group"
                                >
                                    View All
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <RelatedProductCard
                                        key={relatedProduct._id}
                                        product={relatedProduct}
                                        currency={currency}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ==================== */}
                {/* IMAGE ZOOM MODAL */}
                {/* ==================== */}
                {isImageZoomed && images.length > 0 && (
                    <div
                        className="fixed inset-0 z-50 bg-vanilla-900/95 flex items-center justify-center backdrop-blur-sm"
                        onClick={() => setIsImageZoomed(false)}
                    >
                        <button
                            onClick={() => setIsImageZoomed(false)}
                            className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {hasMultipleImages && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        <img
                            src={images[currentImageIndex]}
                            alt={product.name}
                            className="max-w-[90vw] max-h-[80vh] object-contain shadow-2xl rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Thumbnails in zoom modal */}
                        {hasMultipleImages && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2 px-4">
                                {allImagesWithSource.map((imageData, index) => {
                                    const isSelected = index === currentImageIndex
                                    const isVariantImage = imageData.source?.type === 'variant'
                                    
                                    return (
                                        <button
                                            key={index}
                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                                            className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                                                isSelected 
                                                    ? 'border-gold-500 ring-2 ring-gold-500/50' 
                                                    : 'border-white/20 hover:border-white/50'
                                            }`}
                                        >
                                            <img
                                                src={imageData.url}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {isVariantImage && (
                                                <div className="absolute bottom-0 left-0 right-0 py-0.5 bg-gold-500/90 text-white text-center text-[8px] font-medium truncate px-1">
                                                    {imageData.source.label}
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />

            {/* Custom scrollbar styles */}
            <style jsx>{`
                .scrollbar-thin::-webkit-scrollbar {
                    height: 6px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: #f5f5f0;
                    border-radius: 3px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #d4a574;
                    border-radius: 3px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #c49664;
                }
            `}</style>
        </div>
    )
}

// ============================================
// RELATED PRODUCT CARD COMPONENT
// ============================================
const RelatedProductCard = ({ product, currency }) => {
    const images = product.images && product.images.length > 0 ? product.images : []

    const getPriceValue = (item) => {
        if (!item) return 0;
        if (currency === 'USD') return item.priceInUSD || 0;
        return item.priceInLKR || item.price || 0;
    }

    const getPriceInfo = () => {
        if (product.variants && product.variants.length > 0) {
            const prices = product.variants.map(v => getPriceValue(v)).filter(p => p > 0)
            if (prices.length > 0) {
                return {
                    min: Math.min(...prices),
                    max: Math.max(...prices),
                    hasPrice: true
                }
            }
        }

        const price = getPriceValue(product);
        if (price > 0) {
            return {
                min: price,
                max: price,
                hasPrice: true
            }
        }

        return { min: 0, max: 0, hasPrice: false }
    }

    const isInStock = () => {
        if (product.variants && product.variants.length > 0) {
            return product.variants.some(v => v.stock > 0)
        }
        return (product.stock || 0) > 0
    }

    const priceInfo = getPriceInfo()
    const inStock = isInStock()
    
    const formatPrice = (price) => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD',
                minimumFractionDigits: 2 
            }).format(price)
        }
        return 'LKR ' + new Intl.NumberFormat('en-LK', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price)
    }

    return (
        <Link
            to={`/products/${product.slug}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-vanilla-100 transition-all duration-500 hover:-translate-y-1"
        >
            <div className="relative aspect-square overflow-hidden bg-vanilla-50">
                {images.length > 0 ? (
                    <img
                        src={images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-vanilla-200" />
                    </div>
                )}

                <div className="absolute inset-0 bg-vanilla-900/0 group-hover:bg-vanilla-900/10 transition-colors duration-300" />

                <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white text-vanilla-900 shadow-sm opacity-90">
                        {product.category}
                    </span>
                </div>

                {!inStock && (
                    <div className="absolute inset-0 bg-vanilla-900/50 flex items-center justify-center">
                        <span className="bg-white text-vanilla-900 px-3 py-1 rounded-full text-xs font-serif font-bold">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <h3 className="font-serif font-bold text-lg text-vanilla-900 mb-2 line-clamp-1 group-hover:text-gold-500 transition-colors">
                    {product.name}
                </h3>

                <p className="text-vanilla-800/60 text-sm mb-4 line-clamp-2 font-sans">
                    {product.description}
                </p>

                {priceInfo.hasPrice ? (
                    <div className="font-serif font-bold text-gold-500 text-lg">
                        {priceInfo.min === priceInfo.max ? (
                            <span>{formatPrice(priceInfo.min)}</span>
                        ) : (
                            <span>{formatPrice(priceInfo.min)} - {formatPrice(priceInfo.max)}</span>
                        )}
                    </div>
                ) : (
                    <span className="text-vanilla-800/40 text-sm italic">
                        No {currency} price
                    </span>
                )}
            </div>
        </Link>
    )
}

export default ProductDetail