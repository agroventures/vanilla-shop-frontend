import React from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Pure Vanilla Extract",
    desc: "Pure, concentrated, and ideal for baking or beverages.",
    img: "/images/products/non-alcoholic-extract.webp",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Gourmet Vanilla Syrup",
    desc: "Smooth sweetness for lattes, cocktails, and desserts.",
    img: "/images/products/vanilla_syrup_500ml.webp",
    tag: "Popular",
  },
  {
    id: 3,
    name: "Vanilla Infused Tea",
    desc: "A calming blend of Ceylon tea and natural vanilla.",
    img: "/images/products/Vanilla_Tea_Powder_100g.webp",
    tag: "New Arrival",
  },
  {
    id: 4,
    name: "Handmade Vanilla Soap",
    desc: "Gentle, fragrant, and naturally moisturizing.",
    img: "/images/products/handmade-vanilla-soap.jpg",
    tag: "Artisan",
  },
  {
    id: 5,
    name: "Vanilla Paste",
    desc: "Deliciously infused creations from our café kitchen.",
    img: "/images/products/vanilla_paste.webp",
    tag: "Chef's Pick",
  },
  {
    id: 6,
    name: "Vanilla Beans",
    desc: "Fine, aromatic ingredient for baking.",
    img: "/images/products/vanilla_pod_3.webp",
    tag: "Premium",
  },
];

const Products = () => {
  return (
    <section
      id="products"
      className="relative overflow-hidden py-28 px-4 md:px-12 bg-linear-to-b from-white via-vanilla-50/60 to-white"
    >
      {/* Background ambient glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(255,248,235,0.6),transparent_40%)]" />
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-300/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-300/30 to-transparent" />
      <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-gold-200/20 blur-3xl" />
      <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-vanilla-200/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center rounded-full border border-gold-400/40 bg-gold-50 px-5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-600 shadow-sm">
            Our Collection
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-serif font-bold bg-linear-to-r from-vanilla-900 via-amber-800 to-gold-600 bg-clip-text text-transparent leading-tight">
            Curated Vanilla Collection
          </h2>

          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-gold-400/70" />
            <i className="fa-solid fa-spa text-gold-400 text-xs" />
            <div className="h-px w-16 bg-linear-to-l from-transparent to-gold-400/70" />
          </div>

          <p className="mt-5 text-gray-500 max-w-md mx-auto leading-7">
            Each product is crafted for purity, taste, and inspiration — a
            true expression of Sri Lankan vanilla.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 perspective:distant">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative transform-3d transition-all duration-500 hover:transform:[translateY(-10px)] cursor-pointer"
            >
              {/* Glow on hover */}
              <div className="absolute -inset-1 rounded-4xl bg-linear-to-br from-gold-300/20 via-transparent to-gold-100/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Back depth layer */}
              <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-4xl bg-linear-to-br from-vanilla-100 to-gold-100/40" />

              {/* Main card */}
              <div className="relative rounded-4xl border border-vanilla-200/80 bg-white overflow-hidden shadow-[0_20px_60px_rgba(76,52,24,0.09)] transition-all duration-500 group-hover:border-gold-300/50 group-hover:shadow-[0_30px_80px_rgba(76,52,24,0.15),inset_0_1px_0_rgba(212,175,55,0.15)]">

                {/* Top shimmer line */}
                <div className="absolute top-0 left-0 right-0 h-px z-10 bg-linear-to-r from-transparent via-white/80 to-transparent" />

                {/* Image container */}
                <div className="relative overflow-hidden h-64">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 scale-100"
                    style={{ transform: 'scale(1.02)' }}
                  />

                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-white/5 transition-opacity duration-500" />

                  {/* Tag badge */}
                  <div className="absolute top-4 left-4 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-black backdrop-blur-md shadow-md">
                    {product.tag}
                  </div>

                  {/* Hover quick-view pill */}
                  {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-8 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs text-white backdrop-blur-md shadow-lg whitespace-nowrap">
                      <i className="fa-solid fa-eye text-[10px]" />
                      Quick View
                    </div>
                  </div> */}
                </div>

                {/* Content area */}
                <div className="p-6">
                  {/* Divider */}
                  <div className="mb-4 h-px bg-linear-to-r from-gold-200/60 via-gold-300/40 to-transparent" />

                  <h3 className="font-serif text-xl font-bold text-vanilla-900 mb-2 group-hover:text-amber-800 transition-colors duration-300">
                    {product.name}
                  </h3>

                  <p className="text-sm leading-6 text-gray-500 mb-5">
                    {product.desc}
                  </p>

                  {/* Bottom action row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600 font-semibold">
                      The Vanilla Shop
                    </span>
                    {/* <button className="flex items-center gap-2 rounded-full border border-vanilla-200 bg-vanilla-50 px-4 py-2 text-xs font-semibold text-vanilla-900 transition-all duration-300 hover:border-gold-400 hover:bg-gold-500 hover:text-white shadow-sm">
                      Explore
                      <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                    </button> */}
                  </div>
                </div>

                {/* Bottom shimmer on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold-400/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <div className="relative inline-block group">
            {/* Button glow */}
            <div className="absolute -inset-2 rounded-full bg-linear-to-r from-gold-400/30 to-amber-400/30 blur-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <Link to="/shop">
              <button className="relative flex items-center gap-3 rounded-full border border-vanilla-800/20 bg-vanilla-900 px-10 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-[0_10px_40px_rgba(76,52,24,0.25)] transition-all duration-500 hover:bg-gold-500 hover:shadow-[0_15px_50px_rgba(212,175,55,0.35)]">
                <i className="fa-solid fa-bag-shopping text-xs" />
                View Full Catalog
                <i className="fa-solid fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;