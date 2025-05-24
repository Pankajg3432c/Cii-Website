const Card = ({ title, description, image }) => {
  return (
    <div className="w-11/12 sm:w-2/3 lg:w-3/4 mx-auto transition-transform duration-300 ease-in-out transform hover:scale-105">
      <div className="bg-white border rounded-lg shadow-md h-72 overflow-hidden">
        <img
          src={image} // Directly use the imported image path
          alt={title}
          className="w-full h-36 object-contain"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
