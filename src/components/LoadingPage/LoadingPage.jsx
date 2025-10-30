import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LoadingPage = () => {
  const [loadingText, setLoadingText] = useState("Loading amazing deals...");

  useEffect(() => {
    const texts = [
      "Loading amazing deals...",
      "Preparing your bidding experience...",
      "Almost ready...",
      "Getting the best products...",
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const logoVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const barVariants = {
    initial: { width: "0%" },
    animate: {
      width: "100%",
      transition: {
        duration: 3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center text-white"
      >
        {/* Animated Logo */}
        <motion.div
          variants={logoVariants}
          initial="initial"
          animate="pulse"
          className="mb-8"
        >
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4"
            variants={itemVariants}
          >
            Smart Deals
          </motion.h1>
          <motion.p className="text-xl text-purple-200" variants={itemVariants}>
            Your Ultimate Bidding Destination
          </motion.p>
        </motion.div>

        {/* Animated Spinner */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-8"
        >
          <motion.div
            variants={spinnerVariants}
            animate="animate"
            className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full"
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.p
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-light text-purple-100"
          >
            {loadingText}
          </motion.p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          variants={itemVariants}
          className="w-80 max-w-full mx-auto bg-purple-800 rounded-full h-2 mb-4 overflow-hidden"
        >
          <motion.div
            variants={barVariants}
            initial="initial"
            animate="animate"
            className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
          />
        </motion.div>

        {/* Floating Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-purple-400 rounded-full opacity-20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
              }}
              animate={{
                y: -100,
                x: Math.random() * window.innerWidth - window.innerWidth / 2,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Tips Section */}
        <motion.div
          variants={itemVariants}
          className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl max-w-md mx-auto"
        >
          <h3 className="text-lg font-semibold text-purple-200 mb-2">
            💡 Pro Tip
          </h3>
          <p className="text-purple-100 text-sm">
            Set your maximum bid early and be patient - the best deals often
            come to those who wait!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingPage;
