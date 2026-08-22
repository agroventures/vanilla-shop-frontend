import { useEffect, useState } from "react";
import { Search, Plus, Minus, Trash2, ShoppingCart, X, Loader2, Package, CheckCircle, Banknote, CreditCard, Building, Printer } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import PageTitle from "../../components/admin/PageTitle";
import { getProducts } from "../../api/data.api";
import useSEO from "../../hooks/useSEO";

const PAYMENT_METHODS = [
    { id: "cod", label: "Cash", icon: Banknote },
    { id: "card", label: "Card", icon: CreditCard },
    { id: "bank", label: "Bank", icon: Building },
];

const formatPrice = (p) => `LKR ${(p || 0).toLocaleString()}`;

export default function AdminPOS() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [placing, setPlacing] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [printMode, setPrintMode] = useState(false);

    useSEO({ title: "POS - The Vanilla Shop", url: window.location.href });

    useEffect(() => {
        getProducts()
            .then((res) => setProducts(res.filter((p) => p.isActive)))
            .catch(() => toast.error("Failed to load products"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    const addToCart = (product, variant = null) => {
        const id = variant ? `${product._id}-${variant.label}` : product._id;
        const price = variant ? variant.priceInLKR : product.priceInLKR;
        const image = variant?.images?.[0] || product.images?.[0] || null;
        const name = variant ? `${product.name} (${variant.label})` : product.name;

        setCart((prev) => {
            const existing = prev.find((i) => i.id === id);
            if (existing) return prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { id, name, price, image, quantity: 1, productId: product._id, variantLabel: variant?.label || null }];
        });
    };

    const updateQty = (id, delta) => {
        setCart((prev) =>
            prev.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
        );
    };

    const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const placeOrder = async () => {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/orders`,
            {
                firstName: "POS",
                lastName: "Sale",
                email: "pos@vanillashop.com",
                phone: "N/A",
                currency: "LKR",
                orderItems: cart.map((i) => ({
                    name: i.name,
                    quantity: i.quantity,
                    image: i.image || "",
                    price: i.price,
                    priceInLKR: i.price,
                    product: i.productId,
                })),
                shippingAddress: { address: "In-Store", city: "In-Store", state: "In-Store", zipCode: "00000", country: "Sri Lanka" },
                paymentMethod,
                itemsPrice: total,
                shippingPrice: 0,
                totalPrice: total,
                source: "pos",
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        return res.data;
    };

    const printBill = (orderData) => {
        const paymentLabel = PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label || paymentMethod;
        const date = new Date().toLocaleString();
        const orderId = orderData?.order?._id || orderData?._id || "";

        const html = `
            <html><head><title>Receipt</title><style>
                body { font-family: monospace; font-size: 13px; width: 300px; margin: 0 auto; padding: 16px; }
                h2 { text-align: center; margin: 0 0 4px; font-size: 16px; }
                p { text-align: center; margin: 2px 0; font-size: 11px; color: #555; }
                hr { border: none; border-top: 1px dashed #999; margin: 10px 0; }
                .row { display: flex; justify-content: space-between; margin: 4px 0; }
                .total { font-weight: bold; font-size: 14px; }
                .footer { text-align: center; margin-top: 12px; font-size: 11px; color: #777; }
            </style></head><body>
                <h2>The Vanilla Shop</h2>
                <p>In-Store Sale</p>
                <p>${date}</p>
                ${orderId ? `<p>Order: ${orderId}</p>` : ""}
                <hr/>
                ${cart.map((i) => `
                    <div class="row">
                        <span>${i.name} x${i.quantity}</span>
                        <span>LKR ${(i.price * i.quantity).toLocaleString()}</span>
                    </div>`).join("")}
                <hr/>
                <div class="row total">
                    <span>Total</span>
                    <span>LKR ${total.toLocaleString()}</span>
                </div>
                <div class="row"><span>Payment</span><span>${paymentLabel}</span></div>
                <div class="footer">Thank you for your purchase!</div>
            </body></html>`;

        const win = window.open("", "_blank", "width=400,height=600");
        win.document.write(html);
        win.document.close();
        win.focus();
        win.print();
        win.close();
    };

    const handleSave = async () => {
        if (cart.length === 0) return toast.error("Cart is empty");
        setPlacing(true);
        setPrintMode(false);
        try {
            await placeOrder();
            toast.success("Order saved!");
            setCart([]);
            setShowCart(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to place order");
        } finally {
            setPlacing(false);
        }
    };

    const handleSaveAndPrint = async () => {
        if (cart.length === 0) return toast.error("Cart is empty");
        setPlacing(true);
        setPrintMode(true);
        try {
            const data = await placeOrder();
            toast.success("Order saved!");
            printBill(data);
            setCart([]);
            setShowCart(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to place order");
        } finally {
            setPlacing(false);
            setPrintMode(false);
        }
    };

    const CartPanel = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-vanilla-200">
                <h2 className="font-bold font-serif text-vanilla-900 text-lg">Cart ({cart.length})</h2>
                <button onClick={() => setShowCart(false)} className="lg:hidden p-1 text-vanilla-500 hover:text-vanilla-900">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-vanilla-400">
                        <ShoppingCart className="w-10 h-10 mb-2" />
                        <p className="text-sm">Cart is empty</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 bg-white border border-vanilla-200 rounded-xl p-3">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                            ) : (
                                <div className="w-12 h-12 bg-vanilla-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Package className="w-5 h-5 text-vanilla-400" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-vanilla-900 truncate">{item.name}</p>
                                <p className="text-xs text-gold-600 font-bold">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-vanilla-200 hover:bg-vanilla-100 text-vanilla-700">
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-7 text-center text-sm font-bold text-vanilla-900">{item.quantity}</span>
                                <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-vanilla-200 hover:bg-vanilla-100 text-vanilla-700">
                                    <Plus className="w-3 h-3" />
                                </button>
                                <button onClick={() => removeItem(item.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-vanilla-400 hover:text-red-600 ml-1">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t border-vanilla-200 space-y-4 bg-vanilla-50">
                {/* Payment Method */}
                <div>
                    <p className="text-xs font-bold text-vanilla-600 uppercase tracking-wider mb-2">Payment Method</p>
                    <div className="grid grid-cols-3 gap-2">
                        {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setPaymentMethod(id)}
                                className={`flex flex-col items-center gap-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${paymentMethod === id ? "border-gold-500 bg-white text-vanilla-900 shadow-sm" : "border-vanilla-200 bg-white text-vanilla-500 hover:border-vanilla-300"}`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Total & Checkout */}
                <div className="flex items-center justify-between">
                    <span className="font-bold text-vanilla-900">Total</span>
                    <span className="font-bold text-xl text-gold-600 font-serif">{formatPrice(total)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={handleSave}
                        disabled={placing || cart.length === 0}
                        className="py-3 bg-vanilla-900 text-white rounded-xl font-bold hover:bg-vanilla-800 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-md text-sm"
                    >
                        {placing && !printMode ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Save
                    </button>
                    <button
                        onClick={handleSaveAndPrint}
                        disabled={placing || cart.length === 0}
                        className="py-3 bg-gold-600 text-black rounded-xl font-bold hover:bg-gold-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-md text-sm"
                    >
                        {placing && printMode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                        Save & Print
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full font-sans">
            {/* Products Panel */}
            <div className="flex-1 space-y-4 min-w-0">
                <div className="flex items-center justify-between gap-4">
                    <PageTitle title="POS" subtitle="Create in-store orders" />
                    <button
                        onClick={() => setShowCart(true)}
                        className="lg:hidden relative p-2.5 bg-vanilla-900 text-white rounded-xl"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {cart.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gold-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {cart.reduce((s, i) => s + i.quantity, 0)}
                            </span>
                        )}
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-vanilla-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm bg-white text-vanilla-900"
                    />
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filtered.map((product) => {
                            const hasVariants = product.variants?.length > 0;
                            return (
                                <div key={product._id} className="bg-white border border-vanilla-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                    <div className="aspect-square bg-vanilla-50 overflow-hidden">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-8 h-8 text-vanilla-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="font-semibold text-vanilla-900 text-sm truncate">{product.name}</p>
                                        {!hasVariants && (
                                            <p className="text-xs text-gold-600 font-bold mt-0.5">{formatPrice(product.priceInLKR)}</p>
                                        )}
                                        {hasVariants ? (
                                            <div className="mt-2 space-y-1">
                                                {product.variants.map((v) => (
                                                    <button
                                                        key={v.label}
                                                        onClick={() => addToCart(product, v)}
                                                        className="w-full flex items-center justify-between px-2 py-1.5 bg-vanilla-50 hover:bg-gold-50 border border-vanilla-200 hover:border-gold-400 rounded-lg text-xs transition-all"
                                                    >
                                                        <span className="font-medium text-vanilla-800 truncate">{v.label}</span>
                                                        <span className="font-bold text-gold-600 shrink-0 ml-1">{formatPrice(v.priceInLKR)}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 bg-vanilla-900 hover:bg-vanilla-800 text-white rounded-lg text-xs font-semibold transition-all"
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {filtered.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 text-vanilla-400">
                                <Package className="w-12 h-12 mb-3" />
                                <p className="font-medium">No products found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Cart Sidebar — Desktop */}
            <div className="hidden lg:flex flex-col w-80 bg-vanilla-50 border border-vanilla-200 rounded-2xl shadow-xl overflow-hidden shrink-0">
                <CartPanel />
            </div>

            {/* Cart Drawer — Mobile */}
            {showCart && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-vanilla-900/60 backdrop-blur-sm" onClick={() => setShowCart(false)} />
                    <div className="relative ml-auto w-full max-w-sm bg-white h-full flex flex-col shadow-2xl">
                        <CartPanel />
                    </div>
                </div>
            )}
        </div>
    );
}
