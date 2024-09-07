import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ProductContext } from "../context/ProductContext";

const ProductDetails = () => {
  const { id } = useParams(); 
  const { products } = useContext(ProductContext); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

       
        const productFromContext = products.find((p) => p.id === id);
        if (productFromContext) {
          setProduct(productFromContext);
        } else {
          
          const response = await axios.get(
            `https://cdn.drcode.ai/interview-materials/products/${id}.json`
          );
          setProduct(response.data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, products]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <div className="animate-spin border-t-4 border-blue-500 border-solid h-16 w-16 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600">
        <p className="text-lg font-semibold">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-200 shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row items-center">
        <div className="flex-shrink-0">
          
          <img
            src={product.image || "https://via.placeholder.com/400x300"}
            alt={product.title}
            className="w-full md:w-64 h-64 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="md:ml-6 mt-4 md:mt-0">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            {product.title}
          </h1>
          <p className="text-gray-700 text-lg mb-2">
            Price: <span className="font-semibold">${product.price}</span>
          </p>
          <p className="text-gray-700 text-lg mb-4">
            Popularity:{" "}
            <span className="font-semibold">{product.popularity}</span>
          </p>
          <p className="text-gray-700 text-lg mb-6">
            Description: {product.description || "No description available"}
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md text-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
