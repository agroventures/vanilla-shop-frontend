import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  Upload,
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
} from "lucide-react";
import axios from "axios";

// Variant Card Component
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
    <div className="border border-vanilla-200 rounded-xl overflow-hidden bg-white">
      {/* Variant Header */}
      <div
        className="flex items-center justify-between p-4 bg-vanilla-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <GripVertical className="w-5 h-5 text-vanilla-400" />
          <span className="font-medium text-dark">
            Variant {index + 1}
            {variant.label && `: ${variant.label}`}
          </span>
          {variant.price && (
            <span className="text-sm text-vanilla-500">
              - LKR {Number(variant.price).toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-vanilla-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-vanilla-500" />
          )}
        </div>
      </div>

      {/* Variant Content */}
      {expanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={variant.label}
                onChange={(e) => onUpdate(index, "label", e.target.value)}
                placeholder="e.g., Small, 250g"
                className="w-full px-3 py-2 rounded-lg bg-cream border border-vanilla-200 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-vanilla-300"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Price (LKR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={variant.price}
                onChange={(e) => onUpdate(index, "price", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 rounded-lg bg-cream border border-vanilla-200 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-vanilla-300"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Stock
              </label>
              <input
                type="number"
                value={variant.stock}
                onChange={(e) => onUpdate(index, "stock", e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 rounded-lg bg-cream border border-vanilla-200 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-vanilla-300"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Weight
              </label>
              <input
                type="text"
                value={variant.weight}
                onChange={(e) => onUpdate(index, "weight", e.target.value)}
                placeholder="e.g., 500g"
                className="w-full px-3 py-2 rounded-lg bg-cream border border-vanilla-200 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-vanilla-300"
              />
            </div>
          </div>

          {/* Variant Images */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Variant Images
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1 px-3 py-2 rounded-lg bg-cream border border-vanilla-200 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-vanilla-300"
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
                className="px-3 py-2 bg-vanilla-200 text-dark rounded-lg hover:bg-vanilla-300 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {variant.images && variant.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {variant.images.map((img, imgIndex) => (
                  <div
                    key={imgIndex}
                    className="relative w-16 h-16 rounded-lg overflow-hidden bg-vanilla-100 group"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index, imgIndex)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variant Highlights */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Variant Highlights
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="Add highlight for this variant"
                className="flex-1 px-3 py-2 rounded-lg bg-cream border border-vanilla-200 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-vanilla-300"
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
                className="px-3 py-2 bg-vanilla-200 text-dark rounded-lg hover:bg-vanilla-300 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {variant.highlights && variant.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {variant.highlights.map((hl, hlIndex) => (
                  <span
                    key={hlIndex}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-vanilla-100 text-dark rounded-full text-xs"
                  >
                    {hl}
                    <button
                      type="button"
                      onClick={() => onRemoveHighlight(index, hlIndex)}
                      className="hover:text-red-500"
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

// Main Add Product Page Component
export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    weight: "",
    isActive: true,
    images: [],
    ingredients: [],
    highlights: [],
    usageTips: [],
    variants: [],
  });

  // Temporary input states
  const [newImage, setNewImage] = useState("");
  const [newIngredient, setNewIngredient] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newUsageTip, setNewUsageTip] = useState("");

  // Auto-generate slug
  useEffect(() => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
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
          price: "",
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

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.name || !formData.category || !formData.description) {
      setError("Please fill in all required fields (Name, Category, Description)");
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (formData.images.length === 0) {
      setError("Please add at least one product image");
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (formData.variants.length === 0 && !formData.price) {
      setError("Please add a price or create variants");
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    for (let i = 0; i < formData.variants.length; i++) {
      if (!formData.variants[i].label || !formData.variants[i].price) {
        setError(`Variant ${i + 1}: Label and Price are required`);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    try {
      const productData = {
        ...formData,
        price: formData.price ? Number(formData.price) : undefined,
        stock: formData.stock ? Number(formData.stock) : 0,
        variants: formData.variants.map((v) => ({
          ...v,
          price: Number(v.price),
          stock: v.stock ? Number(v.stock) : 0,
        })),
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  // Check if has variants
  const hasVariants = formData.variants.length > 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/products")}
            className="p-2 hover:bg-vanilla-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-dark" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-dark">Add New Product</h1>
            <p className="text-sm text-vanilla-600">
              Create a new product for your store
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2.5 border border-vanilla-200 text-dark rounded-lg hover:bg-vanilla-100 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-dark text-cream rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Product
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
          <Check className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            Product created successfully! Redirecting...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-cream rounded-2xl border border-vanilla-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-vanilla-200">
            <h2 className="text-lg font-semibold text-dark">
              Basic Information
            </h2>
            <p className="text-sm text-vanilla-600 mt-1">
              Enter the basic details of your product
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-vanilla-200 text-dark placeholder-vanilla-400 focus:outline-none focus:ring-2 focus:ring-vanilla-300"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="product-slug"
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-vanilla-200 text-dark placeholder-vanilla-400 focus:outline-none focus:ring-2 focus:ring-vanilla-300"
                />
                <p className="text-xs text-vanilla-500 mt-1">
                  Auto-generated from name. Must be unique.
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Honey, Oils, Gifts"
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-vanilla-200 text-dark placeholder-vanilla-400 focus:outline-none focus:ring-2 focus:ring-vanilla-300"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g., 500g, 1kg"
                  disabled={hasVariants}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-vanilla-200 text-dark placeholder-vanilla-400 focus:outline-none focus:ring-2 focus:ring-vanilla-300 disabled:bg-vanilla-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Price (LKR){" "}
                  {!hasVariants && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={hasVariants}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-vanilla-200 text-dark placeholder-vanilla-400 focus:outline-none focus:ring-2 focus:ring-vanilla-300 disabled:bg-vanilla-100 disabled:cursor-not-allowed"
                />
                {hasVariants && (
                  <p className="text-xs text-vanilla-500 mt-1">
                    Price is set per variant
                  </p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
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
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-vanilla-200 text-dark placeholder-vanilla-400 focus:outline-none focus:ring-2 focus:ring-vanilla-300 disabled:bg-vanilla-100 disabled:cursor-not-allowed"
                />
                {hasVariants && (
                  <p className="text-xs text-vanilla-500 mt-1">
                    Stock is set per variant
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-vanilla-200 text-dark placeholder-vanilla-400 focus:outline-none focus:ring-2 focus:ring-vanilla-300 resize-none"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3 p-4 bg-vanilla-50 rounded-xl">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-vanilla-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-vanilla-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
              <div>
                <span className="text-sm font-medium text-dark flex items-center gap-2">
                  {formData.isActive ? (
                    <>
                      <Eye className="w-4 h-4 text-green-600" />
                      Product is Active
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-vanilla-500" />
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
        <div className="bg-cream rounded-2xl border border-vanilla-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-vanilla-200">
            <h2 className="text-lg font-semibold text-dark">Product Images</h2>
            <p className="text-sm text-vanilla-600 mt-1">
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
                className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-vanilla-200 text-dark placeholder-vanilla-400 focus:outline-none focus:ring-2 focus:ring-vanilla-300"
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
                className="px-4 py-2.5 bg-dark text-cream rounded-lg hover:opacity-90 transition flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>

            {/* Image Grid */}
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-xl overflow-hidden bg-vanilla-100 border border-vanilla-200"
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
                      className="absolute inset-0 items-center justify-center bg-vanilla-100 hidden"
                      style={{ display: "none" }}
                    >
                      <ImageIcon className="w-8 h-8 text-vanilla-400" />
                    </div>
                    {index === 0 && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-dark text-cream text-xs rounded-full font-medium">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("images", index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate opacity-0 group-hover:opacity-100 transition">
                      {image}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-vanilla-300 rounded-xl p-8 text-center">
                <ImageIcon className="w-12 h-12 text-vanilla-400 mx-auto mb-3" />
                <p className="text-vanilla-600 font-medium">
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
        <div className="bg-cream rounded-2xl border border-vanilla-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-vanilla-200">
            <h2 className="text-lg font-semibold text-dark">Product Details</h2>
            <p className="text-sm text-vanilla-600 mt-1">
              Add ingredients, highlights, and usage tips
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Ingredients
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Add ingredient"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-vanilla-200 text-dark placeholder-vanilla-400 focus:outline-none focus:ring-2 focus:ring-vanilla-300"
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
                  className="px-4 py-2.5 bg-dark text-cream rounded-lg hover:opacity-90 transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {formData.ingredients.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.ingredients.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-vanilla-100 text-dark rounded-full text-sm"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("ingredients", index)}
                        className="hover:text-red-500 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-vanilla-500 italic">
                  No ingredients added
                </p>
              )}
            </div>

            {/* Highlights */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Highlights
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add highlight"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-vanilla-200 text-dark placeholder-vanilla-400 focus:outline-none focus:ring-2 focus:ring-vanilla-300"
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
                  className="px-4 py-2.5 bg-dark text-cream rounded-lg hover:opacity-90 transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {formData.highlights.length > 0 ? (
                <div className="space-y-2">
                  {formData.highlights.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-vanilla-50 rounded-lg border border-vanilla-100"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-dark">{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeArrayItem("highlights", index)}
                        className="text-vanilla-500 hover:text-red-500 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-vanilla-500 italic">
                  No highlights added
                </p>
              )}
            </div>

            {/* Usage Tips */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Usage Tips
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newUsageTip}
                  onChange={(e) => setNewUsageTip(e.target.value)}
                  placeholder="Add usage tip"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-vanilla-200 text-dark placeholder-vanilla-400 focus:outline-none focus:ring-2 focus:ring-vanilla-300"
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
                  className="px-4 py-2.5 bg-dark text-cream rounded-lg hover:opacity-90 transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {formData.usageTips.length > 0 ? (
                <div className="space-y-2">
                  {formData.usageTips.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-vanilla-50 rounded-lg border border-vanilla-100"
                    >
                      <span className="text-sm text-dark">
                        <span className="font-medium text-vanilla-600 mr-2">
                          {index + 1}.
                        </span>
                        {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem("usageTips", index)}
                        className="text-vanilla-500 hover:text-red-500 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-vanilla-500 italic">
                  No usage tips added
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Variants */}
        <div className="bg-cream rounded-2xl border border-vanilla-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-vanilla-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-dark flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Product Variants
                  {formData.variants.length > 0 && (
                    <span className="px-2 py-0.5 bg-vanilla-200 text-vanilla-700 text-sm rounded-full">
                      {formData.variants.length}
                    </span>
                  )}
                </h2>
                <p className="text-sm text-vanilla-600 mt-1">
                  Add variants for different sizes, flavors, or options
                </p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 px-4 py-2.5 bg-dark text-cream rounded-lg hover:opacity-90 transition text-sm font-medium"
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
              <div className="border-2 border-dashed border-vanilla-300 rounded-xl p-8 text-center">
                <Layers className="w-12 h-12 text-vanilla-400 mx-auto mb-3" />
                <p className="text-vanilla-600 font-medium">
                  No variants added
                </p>
                <p className="text-sm text-vanilla-500 mt-1 mb-4">
                  Add variants if your product comes in different sizes or
                  options
                </p>
                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-vanilla-100 text-dark rounded-lg hover:bg-vanilla-200 transition text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Variant
                </button>
              </div>
            )}

            {hasVariants && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> When variants are added, the main
                  product price and stock fields are disabled. Each variant will
                  have its own price and stock.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-vanilla-50 rounded-2xl border border-vanilla-200">
          <div className="text-sm text-vanilla-600">
            <span className="text-red-500">*</span> Required fields must be
            filled before saving
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="flex-1 sm:flex-none px-6 py-2.5 border border-vanilla-200 text-dark rounded-lg hover:bg-vanilla-100 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-dark text-cream rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Product
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}