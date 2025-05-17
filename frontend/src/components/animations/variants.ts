import { Variants } from "framer-motion";

// Fade up animation - good for content sections
export const fadeUpVariant: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: (custom = 0) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut",
      delay: custom * 0.2
    }
  })
};

// Stagger children - good for lists of elements
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

// Scale up on hover - good for feature cards
export const scaleHoverVariant: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { type: "spring", stiffness: 300 }
  },
  tap: { scale: 0.98 }
};

// Animation for the navbar
export const navbarVariant: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// For items that slide in from the side
export const slideInVariant: Variants = {
  hidden: (direction = 1) => ({ 
    opacity: 0, 
    x: direction > 0 ? 100 : -100 
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1.0] // Custom easing
    }
  }
};

// For modal animations
export const modalVariant: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// For overlay/backdrop
export const overlayVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

// For text reveal animation
export const textRevealVariant: Variants = {
  hidden: { width: "0%" },
  visible: { 
    width: "100%", 
    transition: { 
      duration: 1.2, 
      ease: "easeInOut" 
    } 
  }
};

// For accordion animation
export const accordionVariant: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: "auto", 
    opacity: 1,
    transition: { 
      height: {
        duration: 0.3
      },
      opacity: {
        duration: 0.2,
        delay: 0.1
      }
    }
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      opacity: {
        duration: 0.2
      },
      height: {
        duration: 0.3,
        delay: 0.1
      }
    }
  }
};