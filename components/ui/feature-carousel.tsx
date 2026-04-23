"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Zap, Wind, Waves, TrendingUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { type Ground } from "@/lib/grounds";

const AUTO_PLAY_INTERVAL = 4000;
const ITEM_HEIGHT = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface FeatureCarouselProps {
  grounds: Ground[];
  onSelectGround: (index: number) => void;
}

export function FeatureCarousel({ grounds, onSelectGround }: FeatureCarouselProps) {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % grounds.length) + grounds.length) % grounds.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + grounds.length) % grounds.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = grounds.length;

    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  // Helper to get icon for ground based on its primary trait
  const getGroundIcon = (g: Ground) => {
    if (g.traits.Spin > 80) return <TrendingUp size={18} />;
    if (g.traits.Pace > 70) return <Zap size={18} />;
    if (g.traits.Swing > 60) return <Wind size={18} />;
    if (g.traits.Bounce > 70) return <Waves size={18} />;
    return <Map size={18} />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto md:p-8">
      <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] flex flex-col lg:flex-row min-h-[600px] lg:aspect-video border border-white/10 bg-zinc-950">
        <div className="w-full lg:w-[40%] min-h-[350px] md:min-h-[450px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-16 lg:pl-16 bg-zinc-900/50">
          <div className="absolute inset-x-0 top-0 h-12 md:h-20 lg:h-16 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-transparent z-40" />
          <div className="absolute inset-x-0 bottom-0 h-12 md:h-20 lg:h-16 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-40" />
          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
            {grounds.map((ground, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(grounds.length / 2),
                grounds.length / 2,
                distance
              );

              return (
                <motion.div
                  key={ground.id}
                  style={{
                    height: ITEM_HEIGHT,
                    width: "fit-content",
                  }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 22,
                    mass: 1,
                  }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative flex items-center gap-4 px-6 md:px-10 lg:px-8 py-3.5 md:py-5 lg:py-4 rounded-full transition-all duration-700 text-left group border",
                      isActive
                        ? "bg-zinc-50 text-black border-zinc-50 z-10"
                        : "bg-transparent text-white/40 border-white/10 hover:border-white/20 hover:text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center transition-colors duration-500",
                        isActive ? "text-black" : "text-white/40"
                      )}
                    >
                      {getGroundIcon(ground)}
                    </div>

                    <span className="font-semibold text-sm md:text-[15px] tracking-tight whitespace-nowrap uppercase">
                      {ground.short}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-h-[500px] md:min-h-[600px] lg:h-full relative bg-zinc-900/20 flex items-center justify-center py-16 md:py-24 lg:py-16 px-6 md:px-12 lg:px-10 overflow-hidden border-t lg:border-t-0 lg:border-l border-white/5">
          <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
            {grounds.map((ground, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={ground.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 rounded-[2rem] md:rounded-[2.8rem] overflow-hidden border-4 md:border-8 border-zinc-950 bg-zinc-950 origin-center cursor-pointer group"
                  onClick={() => isActive && onSelectGround(index)}
                >
                  <Image
                    src={ground.tsimage.url}
                    alt={ground.tsimage.alt}
                    fill
                    priority={isActive}
                    sizes="(max-width: 768px) 100vw, 420px"
                    className={cn(
                      "object-cover transition-all duration-700",
                      isActive
                        ? "grayscale-0 blur-0 scale-100"
                        : "grayscale blur-[2px] brightness-50 scale-110"
                    )}
                  />

                  {/* Specification: Separate gradient overlay for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-10" />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-x-0 bottom-0 p-10 pt-32 flex flex-col justify-end pointer-events-none z-20"
                      >
                        <div className="bg-zinc-50 text-black px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] w-fit shadow-lg mb-3">
                          {ground.city}
                        </div>
                        <h3 className="text-white font-bold text-2xl md:text-3xl leading-tight mb-2 tracking-tighter">
                          {ground.name}
                        </h3>
                        <p className="text-zinc-300 font-medium text-sm md:text-base leading-relaxed line-clamp-2">
                          {ground.narrative}
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-zinc-50 text-xs font-bold uppercase tracking-widest px-1">
                          Explore intelligence <Search size={14} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "absolute top-8 left-8 flex items-center gap-3 transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_#2dd4bf]" />
                    <span className="text-white/80 text-[10px] font-bold uppercase tracking-[0.3em] font-mono">
                      Live Ground Intel
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
