import { motion, AnimatePresence } from "framer-motion";

export default function FlyToCart({ isAnimating, productImage }) {
  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.img
          src={productImage}
          initial={{ 
            position: "fixed", 
            top: "50%", 
            left: "50%", 
            translateX: "-50%",
            translateY: "-50%",
            width: 120, 
            height: 120, 
            borderRadius: "12px",
            zIndex: 99999,
            opacity: 1,
            boxShadow: "0 0 20px rgba(0, 255, 136, 0.5)"
          }}
          animate={{ 
            top: "40px", 
            left: "85%", 
            width: 30, 
            height: 30, 
            opacity: 0,
            scale: 0.1,
            rotate: 360
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "backIn" }}
          style={{ objectFit: "cover", pointerEvents: "none" }}
        />
      )}
    </AnimatePresence>
  );
}