import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const SocialIcons = () => {
  return (
    <div className="fixed top-1/2 left-0 transform -translate-y-1/2 flex flex-col space-y-4 z-50">
      <a
        href="https://www.facebook.com/gitsudr/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="bg-blue-600 text-white p-3 rounded-md transition-transform duration-300"
      >
        <FaFacebook size={24} />
      </a>

      <a
        href="https://x.com/gitsudr"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter"
        className="bg-blue-400 text-white p-3 rounded-md transition-transform duration-300"
      >
        <FaTwitter size={24} />
      </a>

      <a
        href="https://www.instagram.com/gitsudr/p/DAV6H8AsNDj/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="bg-pink-500 text-white p-3 rounded-md transition-transform duration-300"
      >
        <FaInstagram size={24} />
      </a>

      <a
        href="https://www.linkedin.com/school/geetanjali-institute-of-technical-studies-udaipur/?originalSubdomain=in"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="bg-blue-700 text-white p-3 rounded-md transition-transform duration-300"
      >
        <FaLinkedin size={24} />
      </a>
    </div>
  );
};

export default SocialIcons;
