import { Link, useLocation } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa'; // Import an icon
import { useAuth } from '../contexts/AuthContext'; // Import useAuth to check login state

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth(); // Get current user state

  return (
    <div className="w-full bg-gray-50 shadow-sm sticky top-0 z-50"> {/* Make Navbar full width and sticky */}
      <div className="container mx-auto flex justify-between items-center py-3 px-4"> {/* justify-between */}
        {/* Optional: Add a small logo or brand name on the left if desired */}
        <div>
            {/* <Link to="/" className="text-xl font-bold text-blue-600">CII GITS</Link> */}
        </div>

        <nav className="flex items-center space-x-3 md:space-x-4 text-sm md:text-base"> {/* Responsive text size */}
          <Link
            to="/"
            className={`px-3 py-2 font-sans transition duration-200 ease-in-out rounded-md hover:bg-gray-200 ${
              location.pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
          >
            HOME
          </Link>
          <Link
            to="/about"
            className={`px-3 py-2 font-sans transition duration-200 ease-in-out rounded-md hover:bg-gray-200 ${
              location.pathname === '/about' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
          >
            ABOUT
          </Link>
          <Link
            to="/projects"
            className={`px-3 py-2 font-sans transition duration-200 ease-in-out rounded-md hover:bg-gray-200 ${
              location.pathname === '/projects' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
          >
            PROJECTS
          </Link>
          <Link
            to="/contact"
            className={`px-3 py-2 font-sans transition duration-200 ease-in-out rounded-md hover:bg-gray-200 ${
              location.pathname === '/contact' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
          >
            CONTACT US
          </Link>
          
          {/* Admin Login/Dashboard Button */}
          {user ? (
            <Link
              to="/admin/dashboard"
              className="ml-4 px-3 py-2 font-sans transition duration-200 ease-in-out rounded-md text-sm text-white bg-green-500 hover:bg-green-600 flex items-center"
            >
              <FaSignInAlt className="mr-1 md:mr-2" />
              Admin Panel
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="ml-4 px-3 py-2 font-sans transition duration-200 ease-in-out rounded-md text-sm text-white bg-blue-500 hover:bg-blue-600 flex items-center"
            >
              <FaSignInAlt className="mr-1 md:mr-2" />
              Admin Login
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;