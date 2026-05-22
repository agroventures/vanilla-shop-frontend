import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const products = [
  {
    name: "Vanilla Extract",
    image: "/images/products/non-alcoholic-extract.webp",
    description: "Pure, concentrated, and ideal for baking or beverages.",
  },
  {
    name: "Vanilla Syrup",
    image: "/images/products/vanilla_syrup_500ml.webp",
    description: "Smooth sweetness for lattes, cocktails, and desserts.",
  },
  {
    name: "Vanilla Beans",
    image: "/images/products/vanilla_pod_3.webp",
    description: "Fine, aromatic ingredient for baking.",
  },
  {
    name: "Vanilla Paste",
    image: "/images/products/vanilla_paste.webp",
    description: "Deliciously infused creations from our café kitchen.",
  }
];

const Products = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight mb-4 text-neutral-900">
            Our Collection
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-light tracking-wide">
            Explore our carefully curated selection of premium vanilla products.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer flex flex-col"
            >
              {/* Product Image Frame */}
              <div className="relative h-96 w-full overflow-hidden bg-neutral-100 mb-5 border border-neutral-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover contrast-110 brightness-95 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Micro Dark Vignette */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500" />
              </div>

              {/* Product Metadata (Text below image adds high-end retail look) */}
              <div className="flex flex-col grow">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-serif text-xl font-normal text-neutral-900 tracking-wide group-hover:text-neutral-600 transition-colors">
                    {item.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-neutral-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
                <p className="text-sm text-neutral-500 font-light leading-relaxed tracking-wide">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-20"
        >
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-neutral-950 text-white font-medium text-sm tracking-wider uppercase transition-colors duration-300 hover:bg-neutral-800 shadow-sm"
            >
              View All Products
            </motion.button>
          </Link>
        </motion.div>
        
      </div>
    </section>
  );
};

export default Products;