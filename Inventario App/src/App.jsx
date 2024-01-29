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

};

export default InventarioApp;
