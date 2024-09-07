// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://cdn.drcode.ai/interview-materials/products.json`
        );
        const product = (
          Array.isArray(response.data.products) ? response.data.products : []
        ).find((p) => p.id === id);

        if (product) {
          setProduct(product);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">{product.title}</h2>
      <p>
        <strong>Price:</strong> ${product.price}
      </p>
      <p>
        <strong>Popularity:</strong> {product.popularity}
      </p>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductDetails;
