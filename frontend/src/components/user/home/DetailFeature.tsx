import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { slideInVariant } from "../../animations/variants";

type FeatureProps = {
  header: string;
  text: string;
  subHeader1: string;
  subText1: string;
  subHeader2: string;
  subText2: string;
  image: string;
  reverse?: boolean;
};

const DetailFeature: React.FC<FeatureProps> = ({
  header,
  text,
  subHeader1,
  subText1,
  subHeader2,
  subText2,
  image,
  reverse = false,
}) => {
  // Create a ref for this component
  const ref = React.useRef<HTMLElement>(null);

  // Get scroll progress for this specific section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Transform scroll into motion values
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [0.2, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);
  const textX = useTransform(scrollYProgress, [0, 0.5], [reverse ? 50 : -50, 0]);

  return (
    <motion.section
      ref={ref}
      className={`bg-blue-50 flex flex-col items-center justify-between gap-8 lg:flex-row 
            ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} py-6 px-6 md:px-12 overflow-hidden`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}>
      {/* Text section */}
      <motion.div
        className="lg:w-1/2 text-center p-2 space-y-6"
        style={{ x: textX }}
        variants={slideInVariant}
        custom={reverse ? 1 : -1}>
        <motion.h2
          className="phone:text-xl sm:text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          {header}
        </motion.h2>
        <motion.p
          className="phone:text-sm sm:text-base font-medium text-gray-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}>
          {text}
        </motion.p>
        <motion.div
          className="flex gap-4 lg:gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}>
          {/*Sub Section1 */}
          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", stiffness: 300 },
            }}>
            <h3 className="phone:text-lg sm:text-xl font-semibold">{subHeader1}</h3>
            <p className="phone:text-sm sm:text-base text-gray-700">{subText1}</p>
          </motion.div>
          {/* Sub Section2 */}
          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", stiffness: 300 },
            }}>
            <h3 className="phone:text-lg sm:text-xl font-semibold">{subHeader2}</h3>
            <p className="phone:text-sm sm:text-base text-gray-700">{subText2}</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Image Section */}
      <motion.div
        className="lg:w-1/2"
        style={{
          scale: imageScale,
          opacity: imageOpacity,
        }}
        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 100,
        }}>
        <motion.img
          src={image}
          alt="Feature image"
          className="w-full"
          whileHover={{
            scale: 1.02,
            transition: { type: "spring", stiffness: 200 },
          }}
        />
      </motion.div>
    </motion.section>
  );
};

export default DetailFeature;
