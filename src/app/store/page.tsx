"use client";

import React, { useState } from "react";
import { ShoppingBag, Star, HelpCircle, Phone, ArrowRight, ShieldCheck, Tag } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Alpine Down Jacket (-15°C)", price: 4499, rating: 4.8, image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=350&q=80", category: "Apparel" },
  { id: "p2", name: "Carbon Fiber Trekking Poles", price: 1899, rating: 4.9, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=350&q=80", category: "Hardware" },
  { id: "p3", name: "Waterproof Hiking Boots (High Ankle)", price: 3499, rating: 4.7, image: "https://images.unsplash.com/photo-1605548230624-8d2d0419c517?auto=format&fit=crop&w=350&q=80", category: "Footwear" },
  { id: "p4", name: "65L Himalayan Expedition Backpack", price: 2999, rating: 4.8, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=350&q=80", category: "Bags" },
  { id: "p5", name: "Polarized UV400 Mountain Goggles", price: 999, rating: 4.6, image: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=350&q=80", category: "Accessories" },
  { id: "p6", name: "Thermal Woolen Trail Socks (3 Pairs)", price: 499, rating: 4.9, image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=350&q=80", category: "Apparel" }
];

export default function StoreCatalogPage() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState("All");

  const handleAddToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const filteredProducts = PRODUCTS.filter(p => activeCategory === "All" || p.category === activeCategory);

  const cartTotal = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-brand-warm-bg py-8 sm:py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/5 px-3 py-1 rounded-full inline-block">
              Adventure Store
            </span>
            <h1 className="text-2xl font-extrabold font-serif text-brand-dark-text">TripMySoul Gear Shop</h1>
            <p className="text-xs text-gray-500">Pick premium outdoor brands validated for extreme Himalayan winter conditions.</p>
          </div>

          <div className="flex items-center gap-2 bg-brand-forest text-white px-5 py-2.5 rounded-full font-bold shadow-md text-xs shrink-0 relative">
            <ShoppingBag className="w-4.5 h-4.5" />
            <span>Shopping Cart ({cartTotal})</span>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex overflow-x-auto scroll-touch no-scrollbar gap-2 whitespace-nowrap pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {["All", "Apparel", "Hardware", "Footwear", "Bags", "Accessories"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-4.5 py-2 rounded-full border font-bold transition ${
                activeCategory === cat
                  ? "bg-brand-forest text-white border-brand-forest"
                  : "bg-white text-gray-600 border-gray-150 hover:border-brand-forest/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const qty = cart[p.id] || 0;
            return (
              <div key={p.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                
                {/* Product Thumbnail */}
                <div className="aspect-video relative bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-brand-forest/80 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {p.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-brand-dark-text leading-snug line-clamp-2 flex-1 min-w-0">{p.name}</span>
                      <div className="flex items-center gap-0.5 text-amber-400 shrink-0 text-[10px] font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{p.rating}</span>
                      </div>
                    </div>
                    <span className="text-xs text-brand-forest font-mono font-bold block">
                      ₹{p.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-brand-dusk-orange" />
                      <span>Free Delivery</span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(p.id)}
                      className={`px-4 py-2.5 rounded-full text-xs font-bold shadow-xs transition min-h-[44px] shrink-0 ${
                        qty > 0
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-brand-forest text-white hover:bg-brand-forest-light"
                      }`}
                    >
                      {qty > 0 ? `Added to Cart (${qty})` : "Purchase Gear"}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
