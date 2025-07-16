import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({
    productName: '',
    productType: '',
    productDetails: '',
    price: '',
    imageFile: null,
    imageUrl: null,
  });

  const fetchMyProducts = async () => {
    try {
      const data = await api.get('/user/myProducts', token);
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load your products');
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchMyProducts();
    }
  }, [user, token]);

  const handleAdd = async () => {
    const { productName, productType, productDetails, price, imageFile } = form;

    if (!productName || !productType || !productDetails || !price || !imageFile) {
      toast.error('Please fill all fields and select an image');
      return;
    }

    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('productName', productName);
    formData.append('productType', productType);
    formData.append('description', productDetails);
    formData.append('price', price);
    formData.append('image', imageFile);

    try {
      await api.upload('/user/saveProduct', formData, token);
      toast.success('Product added');
      setShowPopup(false);
      setForm({
        productName: '',
        productType: '',
        productDetails: '',
        price: '',
        imageFile: null,
        imageUrl: null,
      });
      fetchMyProducts();
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Add failed');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (!confirm) return;

    try {
      await api.delete(`/user/deleteProduct/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Product deleted');
      fetchMyProducts();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Welcome, {user?.username}</h2>
      <p className="text-lg mb-6 text-gray-600">Email: {user?.username}</p>

      <button
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() => setShowPopup(true)}
      >
        + Add Product
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-3/4 max-w-4xl flex rounded-xl overflow-hidden">
            <div className="w-1/2 p-4 bg-gray-100 flex items-center justify-center">
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt={form.productName}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/no-image.png';
                  }}
                  className="w-full max-h-80 object-contain"
                />
              ) : (
                <div className="text-gray-400">No image selected</div>
              )}
            </div>
            <div className="w-1/2 p-6">
              <h3 className="text-xl font-bold mb-4">Add New Product</h3>
              <input
                type="text"
                placeholder="Product Name"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                className="input input-bordered w-full mb-3"
              />
              <input
                type="text"
                placeholder="Product Type"
                value={form.productType}
                onChange={(e) => setForm({ ...form, productType: e.target.value })}
                className="input input-bordered w-full mb-3"
              />
              <input
                type="text"
                placeholder="Product Details"
                value={form.productDetails}
                onChange={(e) => setForm({ ...form, productDetails: e.target.value })}
                className="input input-bordered w-full mb-3"
              />
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input input-bordered w-full mb-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setForm({
                    ...form,
                    imageFile: file,
                    imageUrl: file ? URL.createObjectURL(file) : null,
                  });
                }}
                className="file-input file-input-bordered w-full mb-4"
              />
              <div className="flex justify-between">
                <button className="btn btn-success" onClick={handleAdd}>Submit</button>
                <button className="btn btn-outline" onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id || uuidv4()} className="card bg-base-100 shadow-md">
            <figure>
              <img
                className="w-full h-48 object-cover"  // 👈 this is key
                src={product.imageUrl || 'https://via.placeholder.com/300'}
                alt={product.productName}
              />

            </figure>
            <div className="p-3 flex justify-between">
              <div>
                <h2 className="card-title">{product.productName}</h2>
              <p>₹{product.price}</p>
              </div>
              <div className="card-actions justify-end">
                <button className="btn btn-error" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
