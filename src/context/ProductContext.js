

// // /// ProductContext.js
// // import React, { createContext, useState } from 'react';

// // export const ProductContext = createContext();

// // export const ProductProvider = ({ children }) => {
// //     const [products, setProducts] = useState([]);

// //     return (
// //         <ProductContext.Provider value={{ products, setProducts }}>
// //             {children}
// //         </ProductContext.Provider>
// //     );
// // };

// import React, { createContext, useState, useEffect } from "react";
// import { fetchProducts } from "../api/ProductApi";

// export const ProductContext = createContext();

// export const ProductProvider = ({ children }) => {
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const data = await fetchProducts();
//         setProducts(data);
//       } catch (error) {
//         setError("Failed to fetch products");
//       }
//     };

//     loadProducts();
//   }, []);

//   return (
//     <ProductContext.Provider value={{ products, error }}>
//       {children}
//     </ProductContext.Provider>
//   );
// };


// src/context/ProductContext.jsx
import React, { createContext, useState, useMemo } from "react";
import PropTypes from "prop-types";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Memoize the context value to avoid unnecessary re-renders
  const value = useMemo(() => ({ products, setProducts }), [products]);

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

// PropTypes validation for the children prop
ProductProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

