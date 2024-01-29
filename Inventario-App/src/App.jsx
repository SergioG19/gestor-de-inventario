import React, { useState, useEffect } from 'react';

const InventarioApp = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    currency: 'USD',
    code: '',
    description: '',
    quantity: ''
  });
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('');

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
    console.log("Productos cargados desde localStorage:", savedProducts);
    setProducts(savedProducts);
  }, []);
  
  useEffect(() => {
    console.log("Guardando productos en localStorage:", products);
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);
  

  const handleAddProduct = () => {
    if (
      newProduct.name.trim() !== '' &&
      /^\d+(\.\d{1,2})?$/.test(newProduct.price) &&
      newProduct.code.trim() !== '' &&
      newProduct.description.trim() !== '' &&
      /^\d+$/.test(newProduct.quantity) // Validar que la cantidad sea un número entero
    ) {
      if (editingProduct) {
        // Editar producto existente
        const updatedProducts = products.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...newProduct, price: `${newProduct.currency} ${newProduct.price}` }
            : product
        );
        setProducts(updatedProducts);
        setEditingProduct(null);
        notifyUser('Producto actualizado correctamente!', 'success');
      } else {
        // Agregar nuevo producto
        const newProductObj = {
          id: Date.now(),
          name: newProduct.name,
          price: `${newProduct.currency} ${newProduct.price}`,
          code: newProduct.code,
          description: newProduct.description,
          quantity: newProduct.quantity
        };
        setProducts((prevProducts) => [...prevProducts, newProductObj]);
        notifyUser('¡Producto añadido correctamente!', 'success');
      }

      setNewProduct({
        name: '',
        price: '',
        currency: 'USD',
        code: '',
        description: '',
        quantity: ''
      });
    } else {
      notifyUser('Rellene todos los campos con datos válidos.', 'error');
    }
  };

  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    if (productToEdit) {
      const [currency, price] = productToEdit.price.split(' ');
      setNewProduct({
        name: productToEdit.name,
        price: price,
        currency: currency,
        code: productToEdit.code,
        description: productToEdit.description,
        quantity: productToEdit.quantity
      });
      setEditingProduct(productToEdit);
    }
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
    setEditingProduct(null);
    notifyUser('Producto eliminado correctamente', 'success');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (type) => {
    setSortType(type);
  };

  const sortedProducts = () => {
    switch (sortType) {
      case 'nameAZ':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'nameZA':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      case 'quantityAsc':
        return [...products].sort((a, b) => a.quantity - b.quantity);
      case 'quantityDesc':
        return [...products].sort((a, b) => b.quantity - a.quantity);
      default:
        return products;
    }
  };

  const filteredProducts = sortedProducts().filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const notifyUser = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Ocultar la notificación después de 3 segundos
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      price: '',
      currency: 'USD', // o cualquier valor por defecto que quieras
      code: '',
      description: '',
      quantity: ''
    });
    setEditingProduct(null); // Asegurarse de que no estamos editando un producto
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex flex-col w-full">
  <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-10 text-center">Gestor de inventario</h1>
      {notification && (
        <div
        className={`mb-6 p-4 rounded-lg text-white text-center text-sm ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {notification.message}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6 space-y-2">

      <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
    Nombre del Producto
      </label>
      <input
        type="text"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        placeholder="Introduzca el nombre del producto"
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
    Precio del Producto
      </label>
        <input
          type="text"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          placeholder="Introduzca el precio del producto"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <label htmlFor="productCurrency" className="block text-sm font-medium text-gray-700">
    Moneda
      </label>
        <select
          value={newProduct.currency}
          onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md"
        >
          <option value="USD">USD - Dolar Estadounidense</option>
          <option value="EUR">EUR - Euro</option>
          <option value="VES">VES - Bolivar</option>
        </select>
        <label htmlFor="productCode" className="block text-sm font-medium text-gray-700 mb-1 ">
    Codigo del producto
      </label>
        <input
          type="text"
          value={newProduct.code}
          onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
          placeholder="Introduzca el código del producto"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
    Descripción del producto
      </label>
        <input
          type="text"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          placeholder="Introduzca la descripción del producto"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <label htmlFor="productQuantity" className="block text-sm font-medium text-gray-700 mb-1">
    Cantidad del Producto
      </label>
        <input
          type="text"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          placeholder="Introduzca la cantidad de producto"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex justify-center">
      <button onClick={handleAddProduct} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-200 w-48 flex justify-center items-center">
        {editingProduct ? 'Actualizar Producto' : 'Añadir Producto'}
        <div className="flex justify-start mt-6 gap-4"></div>
      </button>
      </div>
      <div className="flex justify-center mt-4">
      {editingProduct && (
        <button onClick={resetForm} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-200 w-48 flex justify-center items-center">
          Cancelar Edición 
        </button>
      )}
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-5"> Buscar Producto </h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Buscar por nombre del producto"
        className="p-2 border border-gray-300 rounded mb-4 w-full"
      />
      <div className="flex mb-4 space-x-4">
        <span className="mr-2">Filtrar Por:</span>
        <button onClick={() => handleSort('nameAZ')} className="bg-blue-300 hover:bg-blue-400 text-black font-semibold py-2 px-4 rounded shadow-lg transition duration-200">
          Nombre de la A-Z
        </button>
        <button onClick={() => handleSort('nameZA')} className="bg-blue-300 hover:bg-blue-400 text-black font-semibold py-2 px-4 rounded shadow-lg transition duration-200">
          Nombre de la Z-A
        </button>
        <button onClick={() => handleSort('quantityAsc')} className="bg-blue-300 hover:bg-blue-400 text-black font-semibold py-2 px-4 rounded shadow-lg transition duration-200">
          Cantidad Asc
        </button>
        <button onClick={() => handleSort('quantityDesc')} className="bg-blue-300 hover:bg-blue-400 text-black font-semibold py-2 px-4 rounded shadow-lg transition duration-200">Cantidad Desc</button>
      </div >
      <div className="table-container">
      <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-r border-gray-300">Nombre</th>
            <th className="py-2 px-4 border-r border-gray-300">Precio</th>
            <th className="py-2 px-4 border-r border-gray-300">Codigo</th>
            <th className="py-2 px-4 border-r border-gray-300">Descripción</th>
            <th className="py-2 px-4 border-r border-gray-300">Cantidad</th>
            <th className="py-2 px-4 border-r border-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className="border-b border-gray-300">
              <td className="py-2 px-4 border-r border-gray-300">{product.name}</td>
              <td className="py-2 px-4 border-r border-gray-300">{product.price}</td>
              <td className="py-2 px-4 border-r border-gray-300">{product.code}</td>
              <td className="py-2 px-4 border-r border-gray-300">{product.description}</td>
              <td className="py-2 px-4 border-r border-gray-300">{product.quantity}</td>
              <td className="py-2 px-4 border-r border-gray-300">
  <div className="action-buttons space-x-4 ">
    <button onClick={() => handleEditProduct(product.id)} className="bg-green-300 hover:bg-green-400 text-black-800 font-semibold py-1 px-2 rounded shadow transition duration-200">
      Editar
    </button>
    <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-300 hover:bg-red-400 text-red-800 font-semibold py-1 px-2 rounded shadow transition duration-200">
      Eliminar
    </button>
  </div>
</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
    </div>
  );

};

export default InventarioApp;
