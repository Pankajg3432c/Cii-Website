import { motion } from 'framer-motion'; // Importing motion for animations

// Import images explicitly
import logo from '../assets/images/logo.png';
import rtuLogo from '../assets/images/rtu.jpg';

const Header = () => {
  return (
    <div className='bg-[#1864a4] w-full'>
    <motion.div
      className="flex justify-evenly items-center h-[20vh] pt-20 pb-20 font-montserrat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }} // Fade-in effect on the entire header
    >
      {/* Left Logo */}
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }} // Scale-up effect for the logo
      >
        <img width="110px" src={logo} alt="Geetanjali Institute Logo" />
      </motion.span>

      {/* Text in the Center */}
      <motion.div
        className="text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }} // Slide-down effect for text
      >
        <motion.h1
          // className="text-5xl font-medium text-[#24315D] mb-1  "
          className='text-white text-5xl font-medium mb-1'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          GEETANJALI INSTITUTE OF TECHNICAL STUDIES
        </motion.h1>
        <motion.p
          className="text-xl font-medium text-[#F3771E] mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Affiliated to Rajasthan Technical University, Kota and Approved by AICTE, New Delhi
        </motion.p>
        <motion.p
          className="text-xl font-normal font-medium text-[#e0aaff]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          NAAC A Grade Accredited Institute | NBA Approved B.Tech & MBA Program
        </motion.p>
      </motion.div>

      {/* Right Logo */}
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img width="110px" src={rtuLogo} alt="RTU Logo" />
      </motion.span>
    </motion.div>
    </div>
  );
  
};

export default Header;
