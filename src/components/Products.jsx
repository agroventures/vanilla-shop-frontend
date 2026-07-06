import React from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Pure Vanilla Extract",
    desc: "Pure, concentrated, and ideal for baking or beverages.",
    img: "https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/products/non-alcoholic-extract.webp",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Gourmet Vanilla Syrup",
    desc: "Smooth sweetness for lattes, cocktails, and desserts.",
    img: "https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/products/vanilla_syrup_500ml.webp",
    tag: "Popular",
  },
  {
    id: 3,
    name: "Vanilla Infused Tea",
    desc: "A calming blend of Ceylon tea and natural vanilla.",
    img: "https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/products/natural_vanilla_tea_1.jpg",
    tag: "New Arrival",
  },
  {
    id: 4,
    name: "Handmade Vanilla Soap",
    desc: "Gentle, fragrant, and naturally moisturizing.",
    img: "https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/products/handmade-vanilla-soap.jpg",
    tag: "Artisan",
  },
  {
    id: 5,
    name: "Vanilla Paste",
    desc: "Deliciously infused creations from our café kitchen.",
    img: "https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/products/vanilla_paste.webp",
    tag: "Chef's Pick",
  },
  {
    id: 6,
    name: "Vanilla Beans",
    desc: "Fine, aromatic ingredient for baking.",
    img: "https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/products/pods_1.jpg",
    tag: "Premium",
  },
];

const Products = () => {
  return (
    <section id="products" className="relative overflow-hidden py-28 px-6 md:px-12 bg-white">
      {/* One quiet top rule, matches other sections */}
      <div className="absolute top-0 left-0 w-full h-px bg-gold-500/20" />

      <div className="relative max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-[11px] uppercase tracking-[0.5em] text-gold-600/80 mb-6">
            Our Collection
          </p>

          <h2 className="font-serif text-4xl md:text-5xl leading-[1.15] text-vanilla-950">
            Curated Vanilla<br />
            <span className="italic font-light text-gold-600">Collection</span>
          </h2>

          <div className="w-12 h-px bg-gold-500 mx-auto mt-7 mb-7" />

          <p className="text-vanilla-800/60 max-w-md mx-auto leading-7 text-[15px]">
            Each product is crafted for purity, taste, and inspiration — a
            true expression of Sri Lankan vanilla.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">

              {/* Image — the photography does the work, frame stays quiet */}
              <div className="relative overflow-hidden bg-vanilla-50 mb-5">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-72 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Tag — flat text label, no glass pill */}
                <div className="absolute top-4 left-4">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/90 bg-vanilla-950/70 px-3 py-1.5">
                    {product.tag}
                  </span>
                </div>

                {/* Underline draws in on hover, echoes hero button treatment */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gold-500 transition-all duration-500 ease-out group-hover:w-full" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl text-vanilla-950 mb-1.5 transition-colors duration-300 group-hover:text-gold-700">
                {product.name}
              </h3>

              <p className="text-sm leading-6 text-vanilla-800/55 mb-3">
                {product.desc}
              </p>

              <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600/70">
                The Vanilla Shop
              </span>
            </div>
          ))}
        </div>

        {/* CTA — matches hero's sweep-fill button exactly */}
        <div className="text-center mt-20">
          <Link
            to="/shop"
            className="group relative inline-block px-10 py-4 text-xs uppercase tracking-[0.3em] font-medium text-white bg-vanilla-950 overflow-hidden"
          >
            <span className="relative z-10">View Full Catalog</span>
            <span className="absolute inset-0 bg-gold-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;