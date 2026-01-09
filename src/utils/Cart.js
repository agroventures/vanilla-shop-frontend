import toast from "react-hot-toast"

// ============================================
// CURRENCY HELPERS
// ============================================

export function getPreferredCurrency() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('preferredCurrency') || 'LKR'
    }
    return 'LKR'
}

export function setPreferredCurrency(currency) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('preferredCurrency', currency)
        window.dispatchEvent(new Event('currencyUpdated'))
    }
}

export function formatPrice(price, currency = null) {
    const curr = currency || getPreferredCurrency()
    
    if (curr === 'USD') {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(price || 0)
    }
    
    return 'LKR ' + new Intl.NumberFormat('en-LK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price || 0)
}

// ============================================
// CART CORE FUNCTIONS
// ============================================

export function getCart() {
    if (typeof window === 'undefined') return []
    
    const cartString = localStorage.getItem('cart')

    if (!cartString) {
        localStorage.setItem('cart', JSON.stringify([]))
        return []
    }
    
    try {
        const cart = JSON.parse(cartString)
        return Array.isArray(cart) ? cart : []
    } catch (error) {
        console.error('Error parsing cart:', error)
        localStorage.setItem('cart', JSON.stringify([]))
        return []
    }
}

export function addToCart(product, quantityToAdd = null) {   
    const cart = getCart()
    
    // Handle both schema formats
    const productId = product._id || product.productId
    const productName = product.name || product.productName
    const productSlug = product.slug || product.productSlug
    const productImage = product.images?.[0] || product.image
    const variantLabel = product.variant?.label || product.variantLabel || null
    const productWeight = product.variant?.weight || product.weight || null
    const productStock = product.variant?.stock ?? product.stock ?? null
    
    // Handle prices - support both old and new format
    // New format: priceInLKR, priceInUSD
    // Old format: price (with optional currency field)
    let priceInLKR = null
    let priceInUSD = null
    
    if (product.variant) {
        // Variant product
        priceInLKR = product.variant.priceInLKR ?? product.variant.price ?? null
        priceInUSD = product.variant.priceInUSD ?? null
    } else {
        // Non-variant product
        priceInLKR = product.priceInLKR ?? product.price ?? null
        priceInUSD = product.priceInUSD ?? null
    }
    
    // Fallback: if only 'price' field exists with currency indicator
    if (priceInLKR === null && priceInUSD === null && product.price) {
        if (product.currency === 'USD') {
            priceInUSD = product.price
        } else {
            priceInLKR = product.price
        }
    }
    
    // Use passed quantity, or product.quantity, or default to 1
    const quantity = quantityToAdd ?? product.quantity ?? 1

    // Check if product (with same variant) is already in cart
    const index = cart.findIndex((item) => {
        return item.productId === productId && item.variantLabel === variantLabel
    })

    // Display name for toasts
    const displayName = variantLabel ? `${productName} (${variantLabel})` : productName

    if (index === -1) {
        // NEW ITEM: Add to cart
        cart.push({
            productId,
            name: productName,
            slug: productSlug,
            image: productImage,
            weight: productWeight,
            stock: productStock,
            quantity: quantity,
            variantLabel,
            // Store both prices
            priceInLKR,
            priceInUSD,
            // Keep legacy price field for backward compatibility
            price: priceInLKR || priceInUSD,
        })
        toast.success(`${displayName} added to cart`)
    } else {
        // EXISTING ITEM: Update quantity (don't create duplicate)
        const newQuantity = cart[index].quantity + quantity
        const maxStock = cart[index].stock

        if (newQuantity > 0) {
            // Check stock limit
            if (maxStock && newQuantity > maxStock) {
                cart[index].quantity = maxStock
                toast.error(`Only ${maxStock} available in stock`)
            } else {
                cart[index].quantity = newQuantity
                toast.success(`${displayName} quantity updated in cart`)
            }
        } else {
            cart.splice(index, 1)
            toast.success(`${displayName} removed from cart`)
        }
        
        // Update prices if they were provided (in case of price changes)
        if (index !== -1 && cart[index]) {
            if (priceInLKR !== null) cart[index].priceInLKR = priceInLKR
            if (priceInUSD !== null) cart[index].priceInUSD = priceInUSD
            cart[index].price = priceInLKR || priceInUSD
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    return cart
}

export function emptyCart() {
    localStorage.setItem('cart', JSON.stringify([]))
    window.dispatchEvent(new Event('cartUpdated'))
    toast.success('Cart cleared')
}

export function removeFromCart(productId, variantLabel = null) {
    const cart = getCart()
    const index = cart.findIndex((item) => {
        return item.productId === productId && item.variantLabel === variantLabel
    })
    
    if (index !== -1) {
        const removedItem = cart[index]
        const displayName = removedItem.variantLabel 
            ? `${removedItem.name} (${removedItem.variantLabel})` 
            : removedItem.name
        cart.splice(index, 1)
        localStorage.setItem('cart', JSON.stringify(cart))
        window.dispatchEvent(new Event('cartUpdated'))
        toast.success(`${displayName} removed from cart`)
    }
    
    return getCart()
}

export function updateQuantity(productId, quantity, variantLabel = null) {
    const cart = getCart()
    const index = cart.findIndex((item) => {
        return item.productId === productId && item.variantLabel === variantLabel
    })

    if (index !== -1) {
        const maxStock = cart[index].stock
        
        if (quantity <= 0) {
            removeFromCart(productId, variantLabel)
        } else if (maxStock && quantity > maxStock) {
            cart[index].quantity = maxStock
            localStorage.setItem('cart', JSON.stringify(cart))
            window.dispatchEvent(new Event('cartUpdated'))
            toast.error(`Only ${maxStock} available in stock`)
        } else {
            cart[index].quantity = quantity
            localStorage.setItem('cart', JSON.stringify(cart))
            window.dispatchEvent(new Event('cartUpdated'))
        }
    }
    
    return getCart()
}

// ============================================
// CART TOTAL CALCULATIONS
// ============================================

/**
 * Get cart total in the preferred/specified currency
 * @param {string} currency - 'LKR' or 'USD' (optional, uses preferred if not specified)
 * @returns {number} - Total price
 */
export function getCartTotal(currency = null) {
    const cart = getCart()
    const curr = currency || getPreferredCurrency()
    
    return cart.reduce((total, item) => {
        const price = curr === 'USD' 
            ? (item.priceInUSD || 0) 
            : (item.priceInLKR || item.price || 0)
        return total + (price * item.quantity)
    }, 0)
}

/**
 * Get cart total formatted as string
 * @param {string} currency - 'LKR' or 'USD' (optional)
 * @returns {string} - Formatted price string
 */
export function getFormattedCartTotal(currency = null) {
    const curr = currency || getPreferredCurrency()
    const total = getCartTotal(curr)
    return formatPrice(total, curr)
}

/**
 * Get cart totals in both currencies
 * @returns {object} - { lkr: number, usd: number }
 */
export function getCartTotalBothCurrencies() {
    const cart = getCart()
    
    return cart.reduce((totals, item) => {
        const lkrPrice = item.priceInLKR || item.price || 0
        const usdPrice = item.priceInUSD || 0
        
        return {
            lkr: totals.lkr + (lkrPrice * item.quantity),
            usd: totals.usd + (usdPrice * item.quantity)
        }
    }, { lkr: 0, usd: 0 })
}

/**
 * Get item price based on currency
 * @param {object} item - Cart item
 * @param {string} currency - 'LKR' or 'USD' (optional)
 * @returns {number} - Price in specified currency
 */
export function getItemPrice(item, currency = null) {
    const curr = currency || getPreferredCurrency()
    
    if (curr === 'USD') {
        return item.priceInUSD || 0
    }
    return item.priceInLKR || item.price || 0
}

/**
 * Get item subtotal (price × quantity) based on currency
 * @param {object} item - Cart item
 * @param {string} currency - 'LKR' or 'USD' (optional)
 * @returns {number} - Subtotal in specified currency
 */
export function getItemSubtotal(item, currency = null) {
    const price = getItemPrice(item, currency)
    return price * (item.quantity || 1)
}

/**
 * Get formatted item price
 * @param {object} item - Cart item
 * @param {string} currency - 'LKR' or 'USD' (optional)
 * @returns {string} - Formatted price string
 */
export function getFormattedItemPrice(item, currency = null) {
    const curr = currency || getPreferredCurrency()
    const price = getItemPrice(item, curr)
    return formatPrice(price, curr)
}

/**
 * Get formatted item subtotal
 * @param {object} item - Cart item
 * @param {string} currency - 'LKR' or 'USD' (optional)
 * @returns {string} - Formatted subtotal string
 */
export function getFormattedItemSubtotal(item, currency = null) {
    const curr = currency || getPreferredCurrency()
    const subtotal = getItemSubtotal(item, curr)
    return formatPrice(subtotal, curr)
}

// ============================================
// CART COUNT FUNCTIONS
// ============================================

/**
 * Get number of unique items in cart (each product+variant combo counts as 1)
 * @returns {number}
 */
export function getCartItemCount() {
    const cart = getCart()
    return cart.length
}

/**
 * Get total quantity of all items in cart
 * @returns {number}
 */
export function getCartTotalQuantity() {
    const cart = getCart()
    
    return cart.reduce((count, item) => {
        return count + item.quantity
    }, 0)
}

// ============================================
// CART ITEM LOOKUP FUNCTIONS
// ============================================

/**
 * Check if specific product/variant is in cart
 * @param {string} productId
 * @param {string} variantLabel - Optional
 * @returns {boolean}
 */
export function isInCart(productId, variantLabel = null) {
    const cart = getCart()
    return cart.some(item => 
        item.productId === productId && item.variantLabel === variantLabel
    )
}

/**
 * Get quantity of specific item in cart
 * @param {string} productId
 * @param {string} variantLabel - Optional
 * @returns {number}
 */
export function getItemQuantity(productId, variantLabel = null) {
    const cart = getCart()
    const item = cart.find(item => 
        item.productId === productId && item.variantLabel === variantLabel
    )
    return item?.quantity || 0
}

/**
 * Get specific cart item
 * @param {string} productId
 * @param {string} variantLabel - Optional
 * @returns {object|null}
 */
export function getCartItem(productId, variantLabel = null) {
    const cart = getCart()
    return cart.find(item => 
        item.productId === productId && item.variantLabel === variantLabel
    ) || null
}

// ============================================
// CART VALIDATION
// ============================================

/**
 * Check if all items in cart have prices in the specified currency
 * @param {string} currency - 'LKR' or 'USD' (optional)
 * @returns {boolean}
 */
export function allItemsHavePriceInCurrency(currency = null) {
    const cart = getCart()
    const curr = currency || getPreferredCurrency()
    
    return cart.every(item => {
        const price = curr === 'USD' ? item.priceInUSD : (item.priceInLKR || item.price)
        return price && price > 0
    })
}

/**
 * Get items that are missing price in specified currency
 * @param {string} currency - 'LKR' or 'USD' (optional)
 * @returns {array}
 */
export function getItemsMissingPrice(currency = null) {
    const cart = getCart()
    const curr = currency || getPreferredCurrency()
    
    return cart.filter(item => {
        const price = curr === 'USD' ? item.priceInUSD : (item.priceInLKR || item.price)
        return !price || price <= 0
    })
}

/**
 * Check if cart can checkout in specified currency
 * @param {string} currency - 'LKR' or 'USD' (optional)
 * @returns {object} - { canCheckout: boolean, missingItems: array }
 */
export function canCheckoutInCurrency(currency = null) {
    const curr = currency || getPreferredCurrency()
    const missingItems = getItemsMissingPrice(curr)
    
    return {
        canCheckout: missingItems.length === 0,
        missingItems,
        currency: curr
    }
}

// ============================================
// CART SYNC/MIGRATION (for updating old cart format)
// ============================================

/**
 * Migrate old cart format to new format with dual currency
 * Call this once on app init if needed
 */
export function migrateCart() {
    const cart = getCart()
    let needsUpdate = false
    
    const updatedCart = cart.map(item => {
        // If item doesn't have the new price fields, add them
        if (item.priceInLKR === undefined && item.priceInUSD === undefined) {
            needsUpdate = true
            return {
                ...item,
                priceInLKR: item.price || null,
                priceInUSD: null, // Will need to be updated when product is fetched
            }
        }
        return item
    })
    
    if (needsUpdate) {
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        console.log('Cart migrated to dual currency format')
    }
    
    return updatedCart
}

/**
 * Update cart item prices from product data
 * Useful for syncing prices after currency data is fetched
 * @param {string} productId
 * @param {string} variantLabel
 * @param {object} prices - { priceInLKR, priceInUSD }
 */
export function updateCartItemPrices(productId, variantLabel, prices) {
    const cart = getCart()
    const index = cart.findIndex(item => 
        item.productId === productId && item.variantLabel === variantLabel
    )
    
    if (index !== -1) {
        if (prices.priceInLKR !== undefined) {
            cart[index].priceInLKR = prices.priceInLKR
        }
        if (prices.priceInUSD !== undefined) {
            cart[index].priceInUSD = prices.priceInUSD
        }
        // Update legacy price field
        cart[index].price = cart[index].priceInLKR || cart[index].priceInUSD
        
        localStorage.setItem('cart', JSON.stringify(cart))
        window.dispatchEvent(new Event('cartUpdated'))
    }
    
    return getCart()
}

// ============================================
// SHIPPING CALCULATIONS (example)
// ============================================

/**
 * Check if order qualifies for free shipping
 * @param {string} currency - 'LKR' or 'USD' (optional)
 * @returns {object}
 */
export function getFreeShippingStatus(currency = null) {
    const curr = currency || getPreferredCurrency()
    const total = getCartTotal(curr)
    
    const threshold = curr === 'USD' ? 25 : 5000
    const remaining = Math.max(0, threshold - total)
    const qualifies = total >= threshold
    
    return {
        qualifies,
        total,
        threshold,
        remaining,
        currency: curr,
        message: qualifies 
            ? 'You qualify for free shipping!' 
            : `Add ${formatPrice(remaining, curr)} more for free shipping`
    }
}