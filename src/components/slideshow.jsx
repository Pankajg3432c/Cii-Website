import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Import images
import rnd4Image from "../assets/images/GITS_RND_4-1.jpg";
import rnd5Image from "../assets/images/GITS_RND_5.jpg";
import rnd7Image from "../assets/images/GITS_RND_7.jpg";

const slides = [rnd4Image, rnd4Image, rnd5Image, rnd7Image];

const Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative mx-auto w-[95%] max-w-7xl p-10 bg-transparent mt-4 mb-10">
      
      {/* Slideshow Container */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden rounded-lg shadow-lg">
        {slides.map((image, index) => (
          <motion.div
            key={index}
            className="absolute w-full h-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={index === currentIndex ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentIndex ? "bg-gray-800 scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow;