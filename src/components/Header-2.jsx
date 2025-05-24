import { motion } from 'framer-motion';

// Import the image
import ciiImage from '../assets/images/cii-1.jpg';

const Header2 = () => {
  return (
    <div>
    <motion.div
      className="max-w-[145vh] min-h-40 mx-auto shadow-custom-lg mt-8  "
      initial={{ boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)' }} // Light shadow initially
      animate={{ boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)' }} // Default state after hover is removed
      whileHover={{
        boxShadow: '10px 20px 40px rgba(0, 0, 0, 0.5)', // Shadow on hover
        transition: { duration: 0.6, ease: "easeInOut" }, // Smooth transition on hover
      }}
      exit={{
        boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)', // Smooth return to normal shadow
        transition: { duration: 0.6, ease: "easeInOut" }, // Smooth transition back
      }}
    >
      <div className="flex justify-center items-center h-[20vh] ">
        {/* Image with 3D rotation and scale effect on hover */}
        <motion.img
          src={ciiImage} // Use the imported image
          alt="Center of Innovation and Incubation"
          className="w-[20vh] h-[20vh]"
        />

        {/* Text with sliding and fading effect */}
        <motion.div
          className="flex items-center pt-5 justify-center h-full pl-8 "
          initial={{ opacity: 0, x: -50 }} // Text starts invisible and off-screen
          animate={{ opacity: 1, x: 0 }} // Text fades in and slides into position
          transition={{ duration: 1, ease: 'easeInOut' }} // Animation for text
        >
          <motion.span
            className="font-light text-[30px] font-montserrat "
            whileHover={{ color: '#F3771E', scale: 1.05 }} // Change text color and scale on hover
            transition={{ duration: 0.3 }}
          >
            CENTER OF INNOVATION AND INCUBATION
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
    </div>
  );
};

export default Header2;
