import React, { useEffect, useState } from 'react';
import { FaBoxOpen, FaTimes, FaShoppingCart, FaTrash, FaPlus, FaMinus, FaTrashAlt, FaCheck } from 'react-icons/fa';

const Magasin = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Sportif',
    image: '',
    stock: 0,
  });
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);

  const URL = "http://127.0.0.1:8000/api/";
  
  // Safely parse user from localStorage with fallback
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : { role: 'client', is_confirmed: 0 };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${URL}produits`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits');
      }
      const data = await response.json();
      // Initialize products with selectedQuantity property
      const productsWithQuantity = data.products.map(product => ({
        ...product,
        selectedQuantity: 0
      }));
      setProducts(productsWithQuantity);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to update product quantity selection
  const updateQuantity = (productId, amount) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              selectedQuantity: Math.max(0, (product.selectedQuantity || 0) + amount),
            }
          : product
      )
    );
  };

  const addToCart = (product) => {
    if (!product.selectedQuantity || product.selectedQuantity === 0 || product.stock < product.selectedQuantity) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.selectedQuantity }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url,
            quantity: product.selectedQuantity,
          },
        ];
      }
    });

    // Réduire le stock du produit
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === product.id
          ? { ...p, stock: p.stock - product.selectedQuantity, selectedQuantity: 0 }
          : p
      )
    );
  };

  const removeFromCart = (productId) => {
    // Trouver l'article à supprimer du panier
    const itemToRemove = cart.find(item => item.id === productId);
    if (!itemToRemove) return;

    // Vérifier si le produit existe encore dans la liste des produits
    const productExists = products.some(p => p.id === productId);
    
    if (productExists) {
      // Si le produit existe encore, augmenter son stock
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId ? { ...p, stock: p.stock + itemToRemove.quantity } : p
        )
      );
    }
    // Si le produit n'existe plus (il a été supprimé), on ne fait rien avec le stock

    // Supprimer l'article du panier dans tous les cas
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const addNewProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.stock) {
      return;
    }
    
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('category', 'Sportif');
    if (newProduct.image instanceof File && newProduct.image.type.startsWith('image/')) {
      formData.append('image', newProduct.image);
    } else {
      console.error('The image field must be a valid image file.');
      return;
    }
    formData.append('stock', newProduct.stock);

    fetch(`${URL}produits`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: formData,
    })
      .then((response) => {
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du produit');
      }
      return response.json();
      })
      .then((data) => {
        // Add selectedQuantity to the new product
        const newProductWithQuantity = {
          ...data.product,
          selectedQuantity: 0
        };
        setProducts([...products, newProductWithQuantity]);
        setNewProduct({
          name: '',
          description: '',
          price: 0,
          category: 'Sportif',
          image: '',
          stock: 0,
        });
        setShowAddProductForm(false);
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
  };

  // Activer/désactiver le mode suppression
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedForDeletion([]); // Réinitialiser la sélection quand on sort du mode suppression
  };

  // Ajouter/supprimer un produit de la liste de suppression
  const toggleProductSelection = (productId) => {
    if (selectedForDeletion.includes(productId)) {
      setSelectedForDeletion(selectedForDeletion.filter(id => id !== productId));
    } else {
      setSelectedForDeletion([...selectedForDeletion, productId]);
    }
  };

  // Supprimer les produits sélectionnés sans vérifier le panier
  const deleteSelectedProducts = () => {
    if (selectedForDeletion.length === 0) return;

    // Supprimer les produits sélectionnés (même s'ils sont dans le panier)
    setProducts(products.filter(product => !selectedForDeletion.includes(product.id)));
    
    // Also remove these products from cart if they exist there
    setCart(cart.filter(item => !selectedForDeletion.includes(item.id)));
    
    setSelectedForDeletion([]);
    setDeleteMode(false);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Check if user has permissions to manage products
  const canManageProducts = user && (user.role === 'admin' || (user.role === 'vendeur' && user.is_confirmed === 1));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Panier */}
      {cart.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-8 mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaShoppingCart /> Panier
            </h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} article(s)
            </span>
          </div>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <div className="flex items-center space-x-3">
                  {item.image && (
                    <img
                      src={`http://localhost:8000/storage/${item.image}`}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Non+Disponible';
                      }}
                    />
                  )}
                  <div>
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-gray-500 text-xs">{item.price} DH × {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 font-medium">
                    {(item.price * item.quantity).toFixed(2)} DH
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Supprimer"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="font-semibold">Total:</span>
            <span className="font-bold text-lg">{total.toFixed(2)} DH</span>
          </div>
          <div className="flex justify-end mt-2">
            <button className="bg-blue-600 hover:bg-blue-700 shadow-xl hover:scale-105 text-white p-2 rounded-xl flex items-center gap-2 transition-all">
              <FaCheck className="text-lg" /> Confirmer la commande
            </button>
          </div>
        </div>
      )}

      {/* En-tête */}
      <header className="text-center mb-8 px-4 pt-20">
        <h1 className="text-3xl font-bold text-green-900">Boutique Sportive</h1>
        <p className="text-green-600 mt-2">Des équipements de qualité pour votre performance</p>
      </header>

      {/* Boutons de contrôle */}
      <div className="container mx-auto px-4 mb-4 flex justify-end gap-3">
        {/* Boutons mode suppression */}
        {deleteMode ? (
          <>
            <button
              onClick={deleteSelectedProducts}
              className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg focus:outline-none transition-all duration-300 ${
                selectedForDeletion.length === 0
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
              }`}
              disabled={selectedForDeletion.length === 0}
              aria-label="Supprimer les produits sélectionnés"
            >
              <FaTrashAlt className="text-lg" /> Supprimer ({selectedForDeletion.length})
            </button>
            <button
              onClick={toggleDeleteMode}
              className="flex items-center gap-2 font-bold py-2 px-4 rounded-lg focus:outline-none transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
              aria-label="Annuler la suppression"
            >
              <FaTimes className="text-lg" /> Annuler
            </button>
          </>
        ) : (
          <>
            {/* Admin/Vendor Controls */}
            {canManageProducts && (
              <>
                <button
                  onClick={toggleDeleteMode}
                  className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg focus:outline-none transition-all duration-300 ${
                    products.length === 0
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
                  }`}
                  disabled={products.length === 0}
                  aria-label="Sélectionner les produits à supprimer"
                >
                  <FaTrashAlt className="text-lg" /> Supprimer Produits
                </button>
                <button
                  onClick={() => setShowAddProductForm(!showAddProductForm)}
                  className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg focus:outline-none transition-all duration-300 ${
                    showAddProductForm
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                  }`}
                  aria-label={showAddProductForm ? "Fermer le formulaire" : "Ajouter un produit"}
                >
                  {showAddProductForm ? (
                    <>
                      <FaTimes className="text-lg" /> Fermer
                    </>
                  ) : (
                    <>
                      <FaBoxOpen className="text-lg" /> Nouveau Produit
                    </>
                  )}
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Formulaire d'ajout de produit */}
      {showAddProductForm && (
        <div className="container mx-auto px-4 mb-8 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Ajouter un nouveau produit</h2>

            {/* Nom */}
            <div className="mb-4">
              <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="name">
                Nom
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                id="name"
                type="text"
                placeholder="Nom du produit"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                id="description"
                placeholder="Description du produit"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>

            {/* Prix */}
            <div className="mb-4">
              <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="price">
                Prix (DH)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="Prix"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              />
            </div>

            {/* Catégorie - maintenant en lecture seule avec la valeur "Sportif" */}
            <div className="mb-4">
              <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="category">
                Catégorie
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight bg-gray-100"
                id="category"
                type="text"
                value="Sportif"
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="image">
              Image
              </label>
              <input
                className="shadow cursor-pointer appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.type.startsWith('image/')) {
                    setNewProduct({ ...newProduct, image: file });
                  }
                }}
              />
            </div>
            {/* Stock */}
            <div className="mb-4">
              <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="stock">
                Quantité en stock
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                id="stock"
                type="number"
                min="0"
                placeholder="Quantité en stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
              />
            </div>

            {/* Bouton Ajouter */}
            <button
              onClick={addNewProduct}
              disabled={!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.stock}
              className={`bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                !newProduct.name || !newProduct.price || !newProduct.image || !newProduct.stock
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-green-700'
              }`}
            >
              Ajouter le produit
            </button>
          </div>
        </div>
      )}

      {/* Grille de produits */}
      <div className="container mx-auto px-4 pb-12">
        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun produit disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden border ${
                  deleteMode
                    ? selectedForDeletion.includes(product.id)
                      ? 'border-red-500 ring-2 ring-red-500'
                      : 'border-gray-200'
                    : 'border-gray-200'
                } hover:shadow-md transition-shadow duration-200 relative`}
              >
                {/* Overlay de sélection pour le mode suppression */}
                {deleteMode && (
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer z-10"
                    onClick={() => toggleProductSelection(product.id)}
                  >
                    <div className={`w-8 h-8 rounded-full ${
                      selectedForDeletion.includes(product.id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-700'
                      } flex items-center justify-center`}
                    >
                      {selectedForDeletion.includes(product.id) && <FaCheck />}
                    </div>
                  </div>
                )}

                {/* Image du produit */}
                <div className="relative h-48">
                  <img
                    src={`http://localhost:8000/storage/${product.image_url}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Non+Disponible';
                    }}
                  />
                </div>

                {/* Détails du produit */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-1">Catégorie: Sportif</p>
                  <p className="text-gray-500 text-xs mb-2">{product.description}</p>
                  <p className="text-green-600 font-medium">{product.price} DH</p>
                  <p className="text-gray-500 text-xs">Stock restant: {product.stock}</p>

                  {/* Sélecteur de quantité (visible uniquement en mode normal) */}
                  {!deleteMode && (
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className={`px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors ${(product.selectedQuantity || 0) === 0 ? 'cursor-not-allowed' : ''}`}
                          disabled={(product.selectedQuantity || 0) === 0}
                          aria-label="Réduire la quantité"
                        >
                          <FaMinus />
                        </button>
                        <span className="px-3 py-1 text-center min-w-[2rem]">
                          {product.selectedQuantity || 0}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className={`px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors ${product.stock <= (product.selectedQuantity || 0) ? 'cursor-not-allowed' : ''}`}
                          disabled={product.stock <= (product.selectedQuantity || 0)}
                          aria-label="Augmenter la quantité"
                        >
                          <FaPlus />
                        </button>
                      </div>

                      {/* Bouton "Ajouter au panier" */}
                      <button
                        onClick={() => addToCart(product)}
                        disabled={(product.selectedQuantity || 0) === 0 || product.stock < (product.selectedQuantity || 0)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                          (product.selectedQuantity || 0) === 0 || product.stock < (product.selectedQuantity || 0)
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        <FaShoppingCart /> Ajouter
                      </button>
                    </div>
                  )}

                  {/* Message d'erreur si le stock est insuffisant */}
                  {!deleteMode && (product.selectedQuantity || 0) > product.stock && (
                    <p className="text-red-500 text-xs mt-1">Stock insuffisant</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Magasin;