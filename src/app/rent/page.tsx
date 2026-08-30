"use client";

import React, { useState, useMemo } from "react";
import {
  Compass, ShieldCheck, HelpCircle, Phone, ArrowRight, ShieldAlert, CheckCircle,
  ShoppingBag, Trash2, Calendar
} from "lucide-react";

interface RentalItem {
  id: string;
  name: string;
  pricePerDay: number;
  image: string;
  description: string;
}

const RENTAL_CATALOG: RentalItem[] = [
  { id: "poles", name: "Anti-Shock Trekking Poles (Pair)", pricePerDay: 40, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=150&q=80", description: "Lightweight carbon-fiber poles with cork grips." },
  { id: "jacket", name: "Heavy Down Insulated Jacket (-10°C)", pricePerDay: 90, image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=150&q=80", description: "Waterproof windproof duck-down jacket." },
  { id: "backpack", name: "60L Expedition Backpack with Rain Cover", pricePerDay: 70, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=150&q=80", description: "Ergonomic shoulder straps and waist adjustments." },
  { id: "spikes", name: "Crampons / Microspikes (Pair)", pricePerDay: 50, image: "https://images.unsplash.com/photo-1605548230624-8d2d0419c517?auto=format&fit=crop&w=150&q=80", description: "18-point steel microspikes for safe snow hiking." },
  { id: "gaiters", name: "Waterproof Snow Gaiters", pricePerDay: 30, image: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=150&q=80", description: "Elastic cord locks to prevent mud and snow entries." }
];

export default function RentGearPage() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [days, setDays] = useState(5);
  const [pickupPoint, setPickupPoint] = useState("Sankri Base Camp");
  const [bookingRaised, setBookingRaised] = useState(false);

  const handleQtyChange = (itemId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const handleRemove = (itemId: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const cartItemsCount = useMemo(() => {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  }, [cart]);

  const totalCost = useMemo(() => {
    let sum = 0;
    Object.entries(cart).forEach(([itemId, qty]) => {
      const item = RENTAL_CATALOG.find((i) => i.id === itemId);
      if (item) {
        sum += item.pricePerDay * qty * days;
      }
    });
    return sum;
  }, [cart, days]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingRaised(true);
  };

  return (
    <div className="min-h-screen bg-brand-warm-bg py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-brand-forest/5 px-3 py-1 rounded-full inline-block">
            Equipment Hiring Center
          </span>
          <h1 className="text-3xl font-extrabold font-serif text-brand-dark-text leading-none">
            Rent A Gear
          </h1>
          <p className="text-xs text-gray-500">
            Hire high-altitude climbing equipment at nominal per-day charges. Collect items directly from your trek's basecamp village.
          </p>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          
          {/* Rent Catalog list */}
          <div className="lg:col-span-2 space-y-4 order-last lg:order-first">
            <h2 className="text-base font-extrabold text-brand-dark-text font-serif pl-1">Equipment Catalog</h2>
            
            <div className="space-y-4">
              {RENTAL_CATALOG.map((item) => {
                const qtyInCart = cart[item.id] || 0;
                return (
                  <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-4 md:p-6 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-brand-dark-text block">{item.name}</span>
                        <p className="text-[10px] text-gray-400 leading-normal">{item.description}</p>
                        <span className="text-[10px] text-brand-dusk-orange font-bold block">
                          ₹{item.pricePerDay} / day
                        </span>
                      </div>
                    </div>

                    {/* Quantity selectors */}
                    <div className="flex items-center gap-3 shrink-0">
                      {qtyInCart > 0 ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQtyChange(item.id, -1)}
                            className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-xs font-bold text-brand-forest hover:bg-gray-55 transition"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-brand-dark-text w-6 text-center">{qtyInCart}</span>
                          <button
                            onClick={() => handleQtyChange(item.id, 1)}
                            className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-xs font-bold text-brand-forest hover:bg-gray-55 transition"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-2 text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleQtyChange(item.id, 1)}
                          className="px-4 py-2 min-h-[44px] inline-flex items-center justify-center border border-brand-forest hover:bg-brand-forest hover:text-white rounded-full text-[10px] font-bold text-brand-forest shadow-xs transition"
                        >
                          Add to Hire
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rental Cart Widget — shown first on mobile */}
          <div className="space-y-6 order-first lg:order-last">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-md space-y-6">
              <h3 className="text-sm font-extrabold text-brand-dark-text font-serif border-b border-gray-100 pb-3 flex items-center gap-2">
                <ShoppingBag className="w-4.5 h-4.5 text-brand-dusk-orange" />
                <span>Hiring Summary</span>
              </h3>

              {cartItemsCount > 0 ? (
                <form onSubmit={handleCheckout} className="space-y-4">
                  
                  {/* Select rental days */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400 pl-1">Rental Duration</label>
                    <div className="flex items-center gap-2 px-3 py-2 min-h-[44px] bg-brand-warm-bg border border-gray-150 rounded-xl">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <select
                        value={days}
                        onChange={(e) => setDays(parseInt(e.target.value))}
                        className="bg-transparent border-0 text-base lg:text-xs font-bold focus:outline-none w-full min-w-0 text-brand-dark-text self-stretch py-3 -my-3"
                      >
                        {[3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                          <option key={d} value={d}>{d} Days (Trek length)</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pick up Base Camp */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400 pl-1">Collection Point</label>
                    <div className="flex items-center gap-2 px-3 py-2 min-h-[44px] bg-brand-warm-bg border border-gray-150 rounded-xl">
                      <Compass className="w-4 h-4 text-gray-400" />
                      <select
                        value={pickupPoint}
                        onChange={(e) => setPickupPoint(e.target.value)}
                        className="bg-transparent border-0 text-base lg:text-xs font-bold focus:outline-none w-full min-w-0 text-brand-dark-text self-stretch py-3 -my-3"
                      >
                        <option value="Sankri Base Camp">Sankri Base Camp (Kedarkantha/Har Ki Dun)</option>
                        <option value="Sari Village Camp">Sari Village Camp (Deoriatal Chopta)</option>
                        <option value="Lohajung Base Camp">Lohajung Base Camp (Roopkund/Brahmatal)</option>
                        <option value="Srinagar Office">Srinagar Hub (Kashmir Great Lakes)</option>
                      </select>
                    </div>
                  </div>

                  {/* Cost breakdown */}
                  <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-500 leading-none">
                    <div className="flex justify-between">
                      <span>Total Qty Items:</span>
                      <span className="font-bold text-brand-dark-text">{cartItemsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Charges:</span>
                      <span className="font-bold text-brand-dark-text">₹{totalCost / days}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-100 pt-3">
                      <span className="text-brand-forest font-bold">Grand Total (for {days} Days):</span>
                      <span className="text-sm font-extrabold text-brand-forest">₹{totalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    type="submit"
                    className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-3 rounded-full font-bold shadow-md transition flex items-center justify-center gap-2 hover:-translate-y-0.5 transform duration-200"
                  >
                    <span>Proceed to Gear Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="p-3 bg-brand-warm-bg border border-gray-150 rounded-2xl text-[9px] text-gray-450 leading-normal flex items-start gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-dusk-orange shrink-0" />
                    <span>No advance deposits required. Pay directly at basecamp picking.</span>
                  </div>

                </form>
              ) : (
                <div className="text-center py-8 text-xs text-gray-400 space-y-2">
                  <ShieldAlert className="w-8 h-8 mx-auto text-gray-300" />
                  <p>Hiring cart is currently empty. Add products from the left catalog checklist.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Confirmation Success Modal */}
      {bookingRaised && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative">
            <button
              onClick={() => setBookingRaised(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2 font-sans">
              <h3 className="text-xl font-bold text-brand-dark-text">Gear Reserved!</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Thank you! Your equipment hiring request for <strong>{cartItemsCount} item(s)</strong> has been booked at <strong>{pickupPoint}</strong>. Pay the hiring fee of <strong>₹{totalCost.toLocaleString()}</strong> upon collect.
              </p>
            </div>

            <button
              onClick={() => {
                setBookingRaised(false);
                setCart({});
              }}
              className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-3 rounded-full font-bold shadow-md transition"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Local X icon fallback if Lucide X is not imported/assigned
function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
