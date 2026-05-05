import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import { Link } from "react-router-dom";

const products = [
  {
    name: "Vanilla Extract",
    image: "/images/products/non-alcoholic-extract.webp",
    description: "Pure, concentrated, and ideal for baking or beverages.",
    gradient: "from-vanilla-500 to-amber-600"
  },
  {
    name: "Vanilla Syrup",
    image: "/images/products/vanilla_syrup_500ml.webp",
    description: "Smooth sweetness for lattes, cocktails, and desserts.",
    gradient: "from-vanilla-500 to-amber-600"
  },
  {
    name: "Vanilla Beans",
    image: "/images/products/vanilla_pod_3.webp",
    description: "Fine, aromatic ingredient for baking.",
    gradient: "from-vanilla-500 to-amber-600"
  },
  {
    name: "Vanilla Paste",
    image: "/images/products/vanilla_paste.webp",
    description: "Deliciously infused creations from our café kitchen.",
    gradient: "from-vanilla-500 to-amber-600"
  }
];

const Products = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="section-title">Our Collection</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our carefully curated selection of premium vanilla products
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((collection, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden mb-6 shadow-xl">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-linear-to-t from-vanilla-900/80 to-vanilla-900/10 opacity-60 group-hover:opacity-70 transition-opacity`} />

                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="font-serif text-2xl font-bold mb-2">
                      {collection.name}
                    </h3>
                    <p className="text-sm mb-3 opacity-90">
                      {collection.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
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