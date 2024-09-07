import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ProductContext } from "../context/ProductContext";
import { Link, generatePath } from "react-router-dom";

const ProductList = () => {
  const { products, setProducts } = useContext(ProductContext);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [popularityRange, setPopularityRange] = useState("all");
  const [sort, setSort] = useState("price-asc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "https://cdn.drcode.ai/interview-materials/products.json"
        );
        console.log("API Response:", response.data);

        if (response.data && response.data.products) {
          // Convert products object to an array with id
          const productsArray = Object.entries(response.data.products).map(
            ([id, product]) => ({ id, ...product })
          );
          setProducts(productsArray);
        } else {
          console.error("Unexpected data format:", response.data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setProducts]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handlePriceRange = (e) => setPriceRange(e.target.value);
  const handlePopularityRange = (e) => setPopularityRange(e.target.value);
  const handleSort = (e) => setSort(e.target.value);
  const handlePageChange = (newPage) => setPage(newPage);

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

  const filteredProducts = (Array.isArray(products) ? products : [])
    .filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((product) => {
      if (priceRange === "all") return true;
      const [min, max] = priceRange.split("-").map(Number);
      return product.price >= min && (max === "inf" || product.price <= max);
    })
    .filter((product) => {
      if (popularityRange === "all") return true;
      const [min, max] = popularityRange.split("-").map(Number);
      return (
        product.popularity >= min &&
        (max === "inf" || product.popularity <= max)
      );
    })
    .sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "popularity-asc":
          return a.popularity - b.popularity;
        case "popularity-desc":
          return b.popularity - a.popularity;
        default:
          return 0;
      }
    });

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Product List</h1>
        <input
          type="text"
          placeholder="Search by title"
          className="border border-gray-300 rounded-lg p-3 w-full mb-4"
          value={search}
          onChange={handleSearch}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Price Range:
            </label>
            <select
              onChange={handlePriceRange}
              value={priceRange}
              className="border border-gray-300 rounded-lg p-3 w-full"
            >
              <option value="all">All</option>
              <option value="0-5000">0 - 5000</option>
              <option value="5000-10000">5000 - 10000</option>
              <option value="10000-20000">10000 - 20000</option>
              <option value="20000-inf">20000+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Popularity Range:
            </label>
            <select
              onChange={handlePopularityRange}
              value={popularityRange}
              className="border border-gray-300 rounded-lg p-3 w-full"
            >
              <option value="all">All</option>
              <option value="0-10000">0 - 10000</option>
              <option value="10000-30000">10000 - 30000</option>
              <option value="30000-50000">30000 - 50000</option>
              <option value="50000-inf">50000+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sort by:</label>
            <select
              onChange={handleSort}
              value={sort}
              className="border border-gray-300 rounded-lg p-3 w-full"
            >
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="popularity-asc">Popularity (Low to High)</option>
              <option value="popularity-desc">Popularity (High to Low)</option>
            </select>
          </div>
        </div>
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500">No products found.</p>
        )}
        {paginatedProducts.map((product) => (
          <div
            key={product.id} // Unique key for each product
            className="border border-gray-200 rounded-lg shadow-md p-4 bg-white mb-4"
          >
            <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
            <p className="text-gray-700 mb-2">
              Price: <span className="font-bold">${product.price}</span>
            </p>
            <p className="text-gray-700 mb-4">
              Popularity:{" "}
              <span className="font-bold">{product.popularity}</span>
            </p>
            {product.id ? (
              <Link
                to={generatePath("/product/:id", { id: product.id })}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
              >
                View Details
              </Link>
            ) : (
              <p className="text-red-600">No ID available</p>
            )}
          </div>
        ))}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
