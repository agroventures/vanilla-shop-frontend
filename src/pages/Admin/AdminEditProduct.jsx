import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  Image as ImageIcon,
  GripVertical,
  AlertCircle,
  Check,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Package,
  Layers,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import useSEO from "../../hooks/useSEO";

// --- Shared Styles ---
const INPUT_CLASSES = "w-full px-4 py-2.5 rounded-lg bg-white border border-vanilla-200 text-vanilla-900 placeholder-vanilla-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition text-sm";
const LABEL_CLASSES = "block text-sm font-bold text-vanilla-900 mb-2";
const CARD_CLASSES = "bg-white rounded-xl border border-vanilla-200 shadow-sm overflow-hidden";
const SECTION_HEADER_CLASSES = "p-6 border-b border-vanilla-200 bg-vanilla-50/50";

// --- Variant Card Component ---
const VariantCard = ({
  variant,
  index,
  onUpdate,
  onRemove,
  onAddImage,
  onRemoveImage,
  onAddHighlight,
  onRemoveHighlight,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [newImage, setNewImage] = useState("");
  const [newHighlight, setNewHighlight] = useState("");

  return (
    <div className="border border-vanilla-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
      {/* Variant Header */}
      <div
        className="flex items-center justify-between p-4 bg-vanilla-50 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <GripVertical className="w-5 h-5 text-vanilla-400" />
          <span className="font-bold text-vanilla-900">
            Variant {index + 1}
            {variant.label && <span className="font-normal text-vanilla-600">: {variant.label}</span>}
          </span>
          <div className="flex gap-2">
            {variant.priceInLKR && (
              <span className="text-sm px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                LKR {Number(variant.priceInLKR).toLocaleString()}
              </span>
            )}
            {variant.priceInUSD && (
              <span className="text-sm px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                $ {Number(variant.priceInUSD).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
            className="p-2 text-vanilla-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-vanilla-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-vanilla-400" />
          )}
        </div>
      </div>

      {/* Variant Content */}
      {expanded && (
        <div className="p-5 space-y-5 border-t border-vanilla-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Label */}
            <div>
              <label className={LABEL_CLASSES}>
                Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={variant.label || ""}
                onChange={(e) => onUpdate(index, "label", e.target.value)}
                placeholder="e.g., Small, 250g"
                className={INPUT_CLASSES}
              />
            </div>

            {/* Price LKR */}
            <div>
              <label className={LABEL_CLASSES}>
                Price (LKR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={variant.priceInLKR || ""}
                onChange={(e) => onUpdate(index, "priceInLKR", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={INPUT_CLASSES}
              />
            </div>

            {/* Price USD */}
            <div>
              <label className={LABEL_CLASSES}>
                Price (USD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={variant.priceInUSD || ""}
                onChange={(e) => onUpdate(index, "priceInUSD", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={INPUT_CLASSES}
              />
            </div>

            {/* Stock */}
            <div>
              <label className={LABEL_CLASSES}>
                Stock
              </label>
              <input
                type="number"
                value={variant.stock || ""}
                onChange={(e) => onUpdate(index, "stock", e.target.value)}
                placeholder="0"
                min="0"
                className={INPUT_CLASSES}
              />
            </div>

            {/* Weight */}
            <div>
              <label className={LABEL_CLASSES}>
                Weight
              </label>
              <input
                type="text"
                value={variant.weight || ""}
                onChange={(e) => onUpdate(index, "weight", e.target.value)}
                placeholder="e.g., 500g"
                className={INPUT_CLASSES}
              />
            </div>
          </div>

          {/* Variant Images */}
          <div>
            <label className={LABEL_CLASSES}>
              Variant Images
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Enter image URL"
                className={INPUT_CLASSES}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (newImage.trim()) {
                      onAddImage(index, newImage);
                      setNewImage("");
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (newImage.trim()) {
                    onAddImage(index, newImage);
                    setNewImage("");
                  }
                }}
                className="px-4 py-2 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 transition shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {variant.images && variant.images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {variant.images.map((img, imgIndex) => (
                  <div
                    key={imgIndex}
                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-vanilla-100 border border-vanilla-200 group"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index, imgIndex)}
                      className="absolute inset-0 bg-vanilla-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variant Highlights */}
          <div>
            <label className={LABEL_CLASSES}>
              Variant Highlights
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="Add highlight for this variant"
                className={INPUT_CLASSES}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (newHighlight.trim()) {
                      onAddHighlight(index, newHighlight);
                      setNewHighlight("");
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (newHighlight.trim()) {
                    onAddHighlight(index, newHighlight);
                    setNewHighlight("");
                  }
                }}
                className="px-4 py-2 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 transition shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {variant.highlights && variant.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {variant.highlights.map((hl, hlIndex) => (
                  <span
                    key={hlIndex}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 text-gold-700 border border-gold-200 rounded-full text-xs font-medium"
                  >
                    {hl}
                    <button
                      type="button"
                      onClick={() => onRemoveHighlight(index, hlIndex)}
                      className="hover:text-red-600 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Edit Product Page Component ---
export default function AdminEditProduct() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const url = window.location.href;

  useSEO({
    title: "Edit Product - The Vanilla Shop",
    url,
    image_alt: "Edit Product",
    twitter_card: "summary_large_image",
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    description: "",
    priceInLKR: "",
    priceInUSD: "",
    stock: "",
    weight: "",
    isActive: true,
    images: [],
    ingredients: [],
    highlights: [],
    usageTips: [],
    variants: [],
  });

  const [originalData, setOriginalData] = useState(null);

  // Temporary input states
  const [newImage, setNewImage] = useState("");
  const [newIngredient, setNewIngredient] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newUsageTip, setNewUsageTip] = useState("");

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/${slug}`
        );

        const product = response.data;

        const productData = {
          name: product.name || "",
          slug: product.slug || "",
          category: product.category || "",
          description: product.description || "",
          priceInLKR: product.priceInLKR || product.price || "",
          priceInUSD: product.priceInUSD || "",
          stock: product.stock || "",
          weight: product.weight || "",
          isActive: product.isActive ?? true,
          images: product.images || [],
          ingredients: product.ingredients || [],
          highlights: product.highlights || [],
          usageTips: product.usageTips || [],
          variants: product.variants || [],
        };

        setFormData(productData);
        setOriginalData(productData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Failed to load product data");
        }
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  // Update slug when name changes (optional for edit)
  const regenerateSlug = () => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  // Array field handlers
  const addArrayItem = (field, value, setter) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setter("");
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Variant handlers
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          label: "",
          priceInLKR: "",
          priceInUSD: "",
          stock: "",
          weight: "",
          images: [],
          highlights: [],
        },
      ],
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      ),
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const addVariantImage = (variantIndex, imageUrl) => {
    if (imageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.map((v, i) =>
          i === variantIndex
            ? { ...v, images: [...(v.images || []), imageUrl.trim()] }
            : v
        ),
      }));
    }
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === variantIndex
          ? { ...v, images: v.images.filter((_, j) => j !== imageIndex) }
          : v
      ),
    }));
  };

  const addVariantHighlight = (variantIndex, highlight) => {
    if (highlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.map((v, i) =>
          i === variantIndex
            ? { ...v, highlights: [...(v.highlights || []), highlight.trim()] }
            : v
        ),
      }));
    }
  };

  const removeVariantHighlight = (variantIndex, highlightIndex) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === variantIndex
          ? {
            ...v,
            highlights: v.highlights.filter((_, j) => j !== highlightIndex),
          }
          : v
      ),
    }));
  };

  // Reset form to original data
  const resetForm = () => {
    if (originalData) {
      setFormData(originalData);
      setError("");
    }
  };

  // Check if form has changes
  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Validation
    if (!formData.name || !formData.category || !formData.description) {
      setError("Please fill in all required fields (Name, Category, Description)");
      setSaving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (formData.images.length === 0) {
      setError("Please add at least one product image");
      setSaving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (formData.variants.length === 0) {
      if (!formData.priceInLKR) {
        setError("Please add LKR price or create variants");
        setSaving(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    for (let i = 0; i < formData.variants.length; i++) {
      if (!formData.variants[i].label || !formData.variants[i].priceInLKR) {
        setError(`Variant ${i + 1}: Label and both Prices (LKR & USD) are required`);
        setSaving(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    try {
      const productData = {
        ...formData,
        priceInLKR: formData.priceInLKR ? Number(formData.priceInLKR) : undefined,
        priceInUSD: formData.priceInUSD ? Number(formData.priceInUSD) : null,
        stock: formData.stock ? Number(formData.stock) : 0,
        variants: formData.variants.map((v) => ({
          ...v,
          priceInLKR: Number(v.priceInLKR),
          priceInUSD: Number(v.priceInUSD),
          stock: v.stock ? Number(v.stock) : 0,
        })),
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/products/${slug}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(true);
      setOriginalData(formData);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      toast.success("Product updated successfully!");
      navigate("/admin/products");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
      toast.error(error);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  // Check if has variants
  const hasVariants = formData.variants.length > 0;

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
          <p className="text-vanilla-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Package className="w-16 h-16 text-vanilla-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-serif text-vanilla-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-vanilla-600 mb-6">
            The product you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate("/admin/products")}
            className="px-5 py-2.5 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 transition shadow-md"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/products")}
            className="p-2 bg-white border border-vanilla-200 hover:bg-vanilla-50 rounded-lg transition text-vanilla-600 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-serif text-vanilla-900">Edit Product</h1>
            <p className="text-sm text-vanilla-500">
              Update product information
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges() && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2.5 border border-vanilla-200 bg-white text-vanilla-600 rounded-lg hover:bg-vanilla-50 hover:text-red-600 transition font-medium shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2.5 border border-vanilla-200 bg-white text-vanilla-900 rounded-lg hover:bg-vanilla-50 transition font-medium shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !hasChanges()}
            className="flex items-center gap-2 px-5 py-2.5 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 shadow-sm">
          <Check className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">Product updated successfully!</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Unsaved Changes Warning */}
      {hasChanges() && !success && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-700 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">You have unsaved changes</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className={CARD_CLASSES}>
          <div className={SECTION_HEADER_CLASSES}>
            <h2 className="text-lg font-bold font-serif text-vanilla-900">
              Basic Information
            </h2>
            <p className="text-sm text-vanilla-500 mt-1">
              Update the basic details of your product
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className={LABEL_CLASSES}>
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={INPUT_CLASSES}
                />
              </div>

              {/* Slug */}
              <div>
                <label className={LABEL_CLASSES}>
                  Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="product-slug"
                    className={INPUT_CLASSES}
                  />
                  <button
                    type="button"
                    onClick={regenerateSlug}
                    className="px-3 py-2.5 bg-vanilla-100 text-vanilla-900 rounded-lg hover:bg-vanilla-200 transition border border-vanilla-200"
                    title="Regenerate from name"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-vanilla-400 mt-1">
                  URL-friendly identifier. Must be unique.
                </p>
              </div>

              {/* Category */}
              <div>
                <label className={LABEL_CLASSES}>
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Honey, Oils, Gifts"
                  className={INPUT_CLASSES}
                />
              </div>

              {/* Weight */}
              <div>
                <label className={LABEL_CLASSES}>
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g., 500g, 1kg"
                  disabled={hasVariants}
                  className={`${INPUT_CLASSES} disabled:bg-vanilla-50 disabled:cursor-not-allowed disabled:text-vanilla-400`}
                />
              </div>

              {/* Price LKR */}
              <div>
                <label className={LABEL_CLASSES}>
                  Price (LKR){" "}
                  {!hasVariants && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="number"
                  name="priceInLKR"
                  value={formData.priceInLKR}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={hasVariants}
                  className={`${INPUT_CLASSES} disabled:bg-vanilla-50 disabled:cursor-not-allowed disabled:text-vanilla-400`}
                />
                {hasVariants && (
                  <p className="text-xs text-gold-600 mt-1 font-medium">
                    Price is managed per variant
                  </p>
                )}
              </div>

              {/* Price USD */}
              <div>
                <label className={LABEL_CLASSES}>
                  Price (USD){" "}
                  {!hasVariants && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="number"
                  name="priceInUSD"
                  value={formData.priceInUSD}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={hasVariants}
                  className={`${INPUT_CLASSES} disabled:bg-vanilla-50 disabled:cursor-not-allowed disabled:text-vanilla-400`}
                />
                {hasVariants && (
                  <p className="text-xs text-gold-600 mt-1 font-medium">
                    Price is managed per variant
                  </p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className={LABEL_CLASSES}>
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  disabled={hasVariants}
                  className={`${INPUT_CLASSES} disabled:bg-vanilla-50 disabled:cursor-not-allowed disabled:text-vanilla-400`}
                />
                {hasVariants && (
                  <p className="text-xs text-gold-600 mt-1 font-medium">
                    Stock is managed per variant
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={LABEL_CLASSES}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
                className={`${INPUT_CLASSES} resize-none`}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-4 p-4 bg-vanilla-50 rounded-xl border border-vanilla-100">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-vanilla-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
              </label>
              <div>
                <span className="text-sm font-bold text-vanilla-900 flex items-center gap-2">
                  {formData.isActive ? (
                    <>
                      <Eye className="w-4 h-4 text-green-600" />
                      Product is Active
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-vanilla-400" />
                      Product is Inactive
                    </>
                  )}
                </span>
                <p className="text-xs text-vanilla-500">
                  {formData.isActive
                    ? "Visible to customers on your store"
                    : "Hidden from customers on your store"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className={CARD_CLASSES}>
          <div className={SECTION_HEADER_CLASSES}>
            <h2 className="text-lg font-bold font-serif text-vanilla-900">Product Images</h2>
            <p className="text-sm text-vanilla-500 mt-1">
              Add image URLs for your product. First image will be the main
              image.
            </p>
          </div>

          <div className="p-6 space-y-4">
            {/* Add Image Input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Enter image URL (https://...)"
                className={INPUT_CLASSES}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addArrayItem("images", newImage, setNewImage);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addArrayItem("images", newImage, setNewImage)}
                className="px-5 py-2.5 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 transition flex items-center gap-2 shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Add</span>
              </button>
            </div>

            {/* Image Grid */}
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-xl overflow-hidden bg-vanilla-50 border border-vanilla-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="absolute inset-0 items-center justify-center bg-vanilla-100 hidden w-full h-full"
                      style={{ display: "none" }}
                    >
                      <ImageIcon className="w-8 h-8 text-vanilla-300" />
                    </div>
                    {index === 0 && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-vanilla-900/90 text-white text-[10px] uppercase font-bold tracking-wider rounded backdrop-blur-sm">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("images", index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-vanilla-900/80 backdrop-blur-sm text-white text-[10px] p-2 truncate opacity-0 group-hover:opacity-100 transition">
                      {image}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-vanilla-200 rounded-xl p-10 text-center bg-vanilla-50/50">
                <ImageIcon className="w-12 h-12 text-vanilla-300 mx-auto mb-3" />
                <p className="text-vanilla-900 font-medium">
                  No images added yet
                </p>
                <p className="text-sm text-vanilla-500 mt-1">
                  Add image URLs above to showcase your product
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className={CARD_CLASSES}>
          <div className={SECTION_HEADER_CLASSES}>
            <h2 className="text-lg font-bold font-serif text-vanilla-900">Product Details</h2>
            <p className="text-sm text-vanilla-500 mt-1">
              Add ingredients, highlights, and usage tips
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Ingredients */}
            <div>
              <label className={LABEL_CLASSES}>
                Ingredients
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Add ingredient"
                  className={INPUT_CLASSES}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addArrayItem(
                        "ingredients",
                        newIngredient,
                        setNewIngredient
                      );
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem("ingredients", newIngredient, setNewIngredient)
                  }
                  className="px-4 py-2 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 transition shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {formData.ingredients.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.ingredients.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-vanilla-100 text-vanilla-900 border border-vanilla-200 rounded-full text-sm font-medium"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("ingredients", index)}
                        className="text-vanilla-500 hover:text-red-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-vanilla-400 italic">
                  No ingredients added
                </p>
              )}
            </div>

            {/* Highlights */}
            <div>
              <label className={LABEL_CLASSES}>
                Highlights
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add highlight"
                  className={INPUT_CLASSES}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addArrayItem("highlights", newHighlight, setNewHighlight);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem("highlights", newHighlight, setNewHighlight)
                  }
                  className="px-4 py-2 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 transition shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {formData.highlights.length > 0 ? (
                <div className="space-y-2">
                  {formData.highlights.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-vanilla-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-green-100 text-green-600">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium text-vanilla-900">{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeArrayItem("highlights", index)}
                        className="text-vanilla-400 hover:text-red-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-vanilla-400 italic">
                  No highlights added
                </p>
              )}
            </div>

            {/* Usage Tips */}
            <div>
              <label className={LABEL_CLASSES}>
                Usage Tips
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newUsageTip}
                  onChange={(e) => setNewUsageTip(e.target.value)}
                  placeholder="Add usage tip"
                  className={INPUT_CLASSES}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addArrayItem("usageTips", newUsageTip, setNewUsageTip);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem("usageTips", newUsageTip, setNewUsageTip)
                  }
                  className="px-4 py-2 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 transition shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {formData.usageTips.length > 0 ? (
                <div className="space-y-2">
                  {formData.usageTips.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-vanilla-50 rounded-lg border border-vanilla-200"
                    >
                      <span className="text-sm text-vanilla-900">
                        <span className="font-bold text-vanilla-400 mr-3">
                          {index + 1}.
                        </span>
                        {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem("usageTips", index)}
                        className="text-vanilla-400 hover:text-red-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-vanilla-400 italic">
                  No usage tips added
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Variants */}
        <div className={CARD_CLASSES}>
          <div className={SECTION_HEADER_CLASSES}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold font-serif text-vanilla-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-gold-500" />
                  Product Variants
                  {formData.variants.length > 0 && (
                    <span className="px-2 py-0.5 bg-vanilla-200 text-vanilla-800 text-xs rounded-full font-sans">
                      {formData.variants.length}
                    </span>
                  )}
                </h2>
                <p className="text-sm text-vanilla-500 mt-1">
                  Add variants for different sizes, flavors, or options
                </p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 px-4 py-2 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 transition text-sm font-medium shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Variant
              </button>
            </div>
          </div>

          <div className="p-6">
            {formData.variants.length > 0 ? (
              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <VariantCard
                    key={index}
                    variant={variant}
                    index={index}
                    onUpdate={updateVariant}
                    onRemove={removeVariant}
                    onAddImage={addVariantImage}
                    onRemoveImage={removeVariantImage}
                    onAddHighlight={addVariantHighlight}
                    onRemoveHighlight={removeVariantHighlight}
                  />
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-vanilla-200 rounded-xl p-10 text-center bg-vanilla-50/50">
                <Layers className="w-12 h-12 text-vanilla-300 mx-auto mb-3" />
                <p className="text-vanilla-900 font-medium">
                  No variants added
                </p>
                <p className="text-sm text-vanilla-500 mt-1 mb-6">
                  Add variants if your product comes in different sizes or
                  options
                </p>
                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-vanilla-300 text-vanilla-900 rounded-lg hover:bg-vanilla-50 transition text-sm font-medium shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Variant
                </button>
              </div>
            )}

            {hasVariants && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> When variants are added, the main
                  product price and stock fields are disabled. Each variant will
                  have its own price and stock configuration.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-vanilla-200 shadow-md">
          <div className="text-sm text-vanilla-600">
            {hasChanges() ? (
              <span className="text-amber-600 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                You have unsaved changes
              </span>
            ) : (
              <span className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                All changes saved
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {hasChanges() && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 sm:flex-none px-4 py-2.5 border border-vanilla-200 text-vanilla-700 rounded-lg hover:bg-vanilla-50 hover:text-red-600 transition font-medium"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="flex-1 sm:flex-none px-6 py-2.5 border border-vanilla-200 text-vanilla-900 rounded-lg hover:bg-vanilla-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !hasChanges()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 transition font-medium disabled:opacity-70 shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}