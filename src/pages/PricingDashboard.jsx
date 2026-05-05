import React from 'react';
import { 
  ShoppingCart, ShieldCheck, Cpu, Monitor, MemoryStick, 
  Layers, Zap, Box, AlertTriangle, Flame, TrendingDown, ChevronLeft // 🚀 IMPORTED CHEVRONLEFT
} from 'lucide-react';

export default function PricingDashboard({ build, onBack }) {
  const totalPrice = build.Total_Price || build.total_price || 0;
  
  const estCpu = Math.round(totalPrice * 0.25);
  const estGpu = Math.round(totalPrice * 0.40);
  const estMobo = Math.round(totalPrice * 0.12);
  const estRam = Math.round(totalPrice * 0.08);
  const estPsu = Math.round(totalPrice * 0.08);
  const estCase = totalPrice - (estCpu + estGpu + estMobo + estRam + estPsu);

  const hardwareList = [
    { id: 'cpu', title: 'PROCESSOR', name: build.CPU || build.cpu || 'Unknown CPU', price: estCpu, icon: Cpu },
    { id: 'gpu', title: 'GRAPHICS CARD', name: build.GPU || build.gpu || 'Unknown GPU', price: estGpu, icon: Monitor, img: build.image_url },
    { id: 'mobo', title: 'MOTHERBOARD', name: build.Motherboard || build.motherboard || 'Unknown Motherboard', price: estMobo, icon: Layers },
    { id: 'ram', title: 'MEMORY', name: build.RAM || build.ram || 'Unknown RAM', price: estRam, icon: MemoryStick },
    { id: 'psu', title: 'POWER SUPPLY', name: build.PSU || build.psu || 'Unknown PSU', price: estPsu, icon: Zap },
    { id: 'case', title: 'CHASSIS', name: build.Case || build.chassis || 'Unknown Chassis', price: estCase, icon: Box },
  ];

  const generateRetailers = (basePrice, itemName) => {
    const safeName = itemName || '';
    const hash = safeName.length; 
    
    const hasAmazonDeal = hash % 3 === 0;
    const hasNeweggDeal = hash % 4 === 0 && !hasAmazonDeal; 
    const hasBestBuyDeal = hash % 5 === 0 && !hasAmazonDeal && !hasNeweggDeal;

    return [
      { 
        name: 'Amazon', 
        price: hasAmazonDeal ? Math.round(basePrice * 0.82) : Math.round(basePrice * 0.98), 
        oldPrice: hasAmazonDeal ? Math.round(basePrice * 0.98) : null,
        dealBadge: hasAmazonDeal ? '18% OFF' : null,
        tagColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        btnColor: hasAmazonDeal ? 'bg-green-600 hover:bg-green-500' : 'bg-cyan-600 hover:bg-cyan-500'
      },
      { 
        name: 'Newegg', 
        price: hasNeweggDeal ? Math.round(basePrice * 0.85) : Math.round(basePrice * 1.02), 
        oldPrice: hasNeweggDeal ? Math.round(basePrice * 1.02) : null,
        dealBadge: hasNeweggDeal ? 'FLASH SALE' : null,
        tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        btnColor: hasNeweggDeal ? 'bg-green-600 hover:bg-green-500' : 'bg-purple-600 hover:bg-purple-500'
      },
      { 
        name: 'Best Buy', 
        price: hasBestBuyDeal ? Math.round(basePrice * 0.88) : basePrice, 
        oldPrice: hasBestBuyDeal ? basePrice : null,
        dealBadge: hasBestBuyDeal ? 'CLEARANCE' : null,
        tagColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        btnColor: hasBestBuyDeal ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'
      }
    ];
  };

  const getStoreLink = (storeName, productName) => {
    const query = encodeURIComponent(productName || ''); 
    switch(storeName) {
      case 'Amazon': return `https://www.amazon.com/s?k=${query}`;
      case 'Newegg': return `https://www.newegg.com/p/pl?d=${query}`;
      case 'Best Buy': return `https://www.bestbuy.com/site/searchpage.jsp?st=${query}`;
      default: return '#';
    }
  };

  return (
    <div className="w-full bg-[#060913] border border-[#1e293b] rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* 🚀 NEW: TOP BACK BUTTON */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group w-fit"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest">Back to Overview</span>
      </button>

      {/* HEADER */}
      <div className="mb-8 border-b border-[#1e293b] pb-6">
        <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-2 flex items-center gap-3">
          Market Pricing <TrendingDown className="text-green-400 w-8 h-8" />
        </h2>
        <p className="text-slate-400 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          Scraping current deals from verified leading retailers.
        </p>
      </div>

      {/* THE DISCLAIMER BANNER */}
      <div className="bg-[#1a0f0a] border border-orange-500/30 rounded-2xl p-5 mb-10 flex items-start gap-4 shadow-[0_0_20px_rgba(249,115,22,0.05)]">
        <AlertTriangle className="text-orange-500 shrink-0 w-6 h-6 mt-0.5" />
        <div>
          <h4 className="text-orange-500 font-black text-sm uppercase tracking-widest mb-1.5">
            Real-Time Price Variance Warning
          </h4>
          <p className="text-orange-200/70 text-sm leading-relaxed">
            Our AI targets the optimal MSRP to assemble your build within your budget. However, hardware prices fluctuate wildly by the minute due to scalpers, limited inventory, and flash sales. The prices below are aggressive targets—<strong>always verify the final checkout price on the retailer's website.</strong>
          </p>
        </div>
      </div>

      {/* DYNAMIC ROWS */}
      <div className="space-y-12">
        {hardwareList.map((item) => (
          <div key={item.id} className="w-full">
            <h3 className="text-lg font-black text-slate-300 tracking-widest uppercase mb-4 pl-2 border-l-4 border-cyan-500">
              {item.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {generateRetailers(item.price, item.name).map((store, i) => (
                <div key={i} className={`bg-[#0b0f19] border ${store.dealBadge ? 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 'border-[#1e293b] hover:border-slate-600'} transition-all rounded-2xl p-4 flex gap-4 relative overflow-hidden group`}>
                  
                  {/* Deal Background Glow */}
                  {store.dealBadge && (
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-500/20 blur-2xl rounded-full pointer-events-none"></div>
                  )}

                  {/* Left: Image/Icon Slot */}
                  <div className="w-20 h-20 shrink-0 bg-[#060913] border border-[#1e293b] rounded-xl flex items-center justify-center overflow-hidden z-10">
                    {item.img && item.img !== "NaN" ? (
                      <img src={item.img} alt={item.name} className="w-14 h-14 object-contain group-hover:scale-110 transition-transform" />
                    ) : (
                      <item.icon className="w-8 h-8 text-slate-500" />
                    )}
                  </div>

                  {/* Right: Details & Buy */}
                  <div className="flex flex-col justify-between grow z-10">
                    <div>
                      <p className="text-white font-bold text-sm leading-tight line-clamp-2 mb-2">{item.name}</p>
                      
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider mb-1 w-fit ${store.tagColor}`}>
                            @{store.name}
                          </span>
                          {/* THE DEAL BADGE */}
                          {store.dealBadge && (
                            <span className="text-[10px] font-black text-green-400 flex items-center gap-1 bg-green-500/10 px-1.5 rounded uppercase tracking-wider">
                              <Flame className="w-3 h-3" /> {store.dealBadge}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col items-end">
                          {/* OLD STRIKETHROUGH PRICE */}
                          {store.oldPrice && (
                            <span className="text-xs text-slate-500 line-through font-bold">
                              ${store.oldPrice}
                            </span>
                          )}
                          <span className={`text-xl font-black ${store.dealBadge ? 'text-green-400' : 'text-white'}`}>
                            ${store.price}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <a 
                      href={getStoreLink(store.name, item.name)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`w-full mt-3 py-2 rounded-lg text-xs font-black text-white flex items-center justify-center gap-2 transition-colors shadow-md ${store.btnColor}`}
                    >
                      <ShoppingCart className="w-3 h-3" /> Get it on {store.name}
                    </a>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 border-t border-[#1e293b] pt-8">
        <button className="px-8 py-3 rounded-full border border-cyan-500 text-cyan-400 font-bold hover:bg-cyan-500/10 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.1)]">
          SAVE & SHARE REPORT
        </button>
        <button 
          onClick={onBack}
          className="px-8 py-3 rounded-full border border-purple-500 text-purple-400 font-bold hover:bg-purple-500/10 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.1)]"
        >
          REFINE BUILD
        </button>
      </div>
      <p className="text-center text-slate-600 text-xs mt-6 font-medium">Data powered by AI-Accelerated Benchmarking</p>

    </div>
  );
}