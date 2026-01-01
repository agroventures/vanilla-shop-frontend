import toast from "react-hot-toast"

export function getCart() {
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
    const productPrice = product.variant?.price ?? product.price
    const productStock = product.variant?.stock ?? product.stock ?? null
    const productWeight = product.variant?.weight || product.weight || null
    
    // Use passed quantity, or product.quantity, or default to 1
    const quantity = quantityToAdd ?? product.quantity ?? 1

    // Check if product (with same variant) is already in cart
    // Same productId + same variantLabel = same cart item
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
            price: productPrice,
            image: productImage,
            slug: productSlug,
            stock: productStock,
            weight: productWeight,
            quantity: quantity,
            variantLabel,
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
                toast.success(`${displayName} quantity updated to ${newQuantity}`)
            }
        } else {
            cart.splice(index, 1)
            toast.success(`${displayName} removed from cart`)
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    return cart
}

export function emptyCart() {
    localStorage.setItem('cart', JSON.stringify([]))
    window.dispatchEvent(new Event('cartUpdated'))
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

export function getCartTotal() {
    const cart = getCart()
    
    return cart.reduce((total, item) => {
        return total + (item.price * item.quantity)
    }, 0)
}

export function getCartItemCount() {
    const cart = getCart()
    return cart.length  // Each unique product+variant combo is one entry
}


export function getCartTotalQuantity() {
    const cart = getCart()
    
    return cart.reduce((count, item) => {
        return count + item.quantity
    }, 0)
}

// Check if specific product/variant is in cart
export function isInCart(productId, variantLabel = null) {
    const cart = getCart()
    return cart.some(item => 
        item.productId === productId && item.variantLabel === variantLabel
    )
}

// Get quantity of specific item in cart
export function getItemQuantity(productId, variantLabel = null) {
    const cart = getCart()
    const item = cart.find(item => 
        item.productId === productId && item.variantLabel === variantLabel
    )
    return item?.quantity || 0
}