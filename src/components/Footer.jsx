import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-2">CII - Center of Innovation & Incubation</h3>
          <p className="text-gray-400">Geetanjali Institute of Technical Studies</p>
          <p className="text-gray-400">Airport Road, Dabok, Udaipur, Rajasthan - 313022</p>
        </div>

        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://www.facebook.com/gitsudr/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
            <FaFacebook size={24} />
          </a>
          <a href="https://x.com/gitsudr" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
            <FaTwitter size={24} />
          </a>
          <a href="https://www.instagram.com/gitsudr/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
            <FaInstagram size={24} />
          </a>
          <a href="https://www.linkedin.com/school/geetanjali-institute-of-technical-studies-udaipur/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
            <FaLinkedin size={24} />
          </a>
        </div>

        <p className="text-gray-500 text-sm">
          Copyrights © {currentYear} All Rights Reserved by CII GITS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;