import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ProductContext } from "../context/ProductContext";
import { useContext } from "react";

const ProductDetails = () => {
  const { id } = useParams(); // Extract the ID from the route parameters
  const { products } = useContext(ProductContext); // Get products from context
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if the product is already in the context
        const productFromContext = products.find((p) => p.id === id);
        if (productFromContext) {
          setProduct(productFromContext);
        } else {
          // Fetch product data if not in the context
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
      <div className="container mx-auto p-4 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        Product not found
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
      <p className="text-gray-700 mb-2">Price: ${product.price}</p>
      <p className="text-gray-700 mb-4">Popularity: {product.popularity}</p>
      <p className="text-gray-700 mb-4">Description: </p>
      <Link
        to="/"
        className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
      >
        Back to Products
      </Link>
    </div>
  );
};

export default ProductDetails;
