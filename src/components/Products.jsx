import React from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Pure Vanilla Extract",
    desc: "Pure, concentrated, and ideal for baking or beverages.",
    img: "/images/products/non-alcoholic-extract.webp",
  },
  {
    id: 2,
    name: "Gourmet Vanilla Syrup",
    desc: "Smooth sweetness for lattes, cocktails, and desserts.",
    img: "/images/products/vanilla_syrup_500ml.webp",
  },
  {
    id: 3,
    name: "Vanilla Infused Tea",
    desc: "A calming blend of Ceylon tea and natural vanilla.",
    img: "/images/products/Vanilla_Tea_Powder_100g.webp",
  },
  {
    id: 4,
    name: "Handmade Vanilla Soap",
    desc: "Gentle, fragrant, and naturally moisturizing.",
    img: "/images/products/handmade-vanilla-soap.jpg",
  },
  {
    id: 5,
    name: "Vanilla Paste",
    desc: "Deliciously infused creations from our café kitchen.",
    img: "/images/products/vanilla_paste.webp",
  },
  {
    id: 6,
    name: "Vanilla Beans",
    desc: "Fine, aromatic ingredient for baking.",
    img: "/images/products/vanilla_pod_3.webp",
  },
];

const Products = () => {
  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-vanilla-900">
            Curated Vanilla Collection
          </h2>
          <p className="text-gray-500 mt-4">
            Crafted for purity, taste, and inspiration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
                />
              </div>
              <h3 className="text-xl font-serif font-bold">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.desc}</p>
              {/* <span className="text-gold-500 font-bold">{product.price}</span> */}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/shop">
            <button className="bg-vanilla-900 text-white px-8 py-3 rounded-full cursor-pointer hover:bg-gold-500 transition shadow-lg">
              View Full Catalog
            </button></Link>
        </div>
      </div>
    </section>
  );
};

export default Products;
