import React from 'react';

const Magasin = () => {
  // Sample product data (replace with your actual data)
  const products = [
    {
      id: 1,
      name: 'Chaussures de course',
      price: '99.99€',
      image: '/images/shoes.jpg', // Replace with your image path
    },
    {
      id: 2,
      name: 'T-shirt sportif',
      price: '29.99€',
      image: '/images/tshirt.jpg', // Replace with your image path
    },
    {
      id: 3,
      name: 'Gants de boxe',
      price: '49.99€',
      image: '/images/gloves.jpg', // Replace with your image path
    },
    {
      id: 4,
      name: 'Bouteille d\'eau',
      price: '14.99€',
      image: '/images/water-bottle.jpg', // Replace with your image path
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Notre Magasin de Produits Sportifs</h1>
        <p className="text-gray-600 mt-2">Découvrez nos produits de qualité pour tous les sports.</p>
      </header>

      {/* Product Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Product Image */}
              <div className="relative h-56">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 mt-1">{product.price}</p>

                {/* Add to Cart Button */}
                <button className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Magasin;