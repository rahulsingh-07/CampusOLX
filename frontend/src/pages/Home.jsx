import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      const data = await api.get(`/public/all?page=${page}&size=6&sortBy=productName`);
      const embedded = data._embedded;
      const items = embedded?.productResponseDTOList || [];
      setProducts(items);
      setTotalPages(data.page.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handlePrev = () => setPage((prev) => Math.max(0, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages - 1, prev + 1));

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <div key={index} className="card bg-base-100 shadow-md">
            <figure>
              <img
                src={product.imageUrl || '/images/no-image.png'}
                alt={product.productName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/no-image.png';
                }}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{product.productName}</h2>
              <p>₹{product.price}</p>
              <div className="card-actions justify-end">
                <Link to={`/productdetails/${product.productId}`} className="btn btn-primary">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="join flex justify-center mt-6">
        <button className="join-item btn" onClick={handlePrev} disabled={page === 0}>«</button>
        <button className="join-item btn">Page {page + 1}</button>
        <button className="join-item btn" onClick={handleNext} disabled={page + 1 >= totalPages}>»</button>
      </div>
    </div>
  );
};

export default Home;
