// src/components/ProductList.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import { ProductProvider } from "../context/ProductContext";
import ProductList from "./ProductList";

// Mock axios
jest.mock("axios");
const mockedAxios = axios;

describe("ProductList Component", () => {
  test("renders loading state", () => {
    mockedAxios.get.mockResolvedValue({ data: { products: [] } });

    render(
      <ProductProvider>
        <ProductList />
      </ProductProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error message when API call fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Failed to fetch"));

    render(
      <ProductProvider>
        <ProductList />
      </ProductProvider>
    );

    expect(
      await screen.findByText(
        "Failed to fetch products. Please try again later."
      )
    ).toBeInTheDocument();
  });

  test("renders products correctly", async () => {
    const mockProducts = [
      {
        id: "6834",
        title: "Micromax Canvas Spark",
        price: "4999",
        popularity: "51936",
      },
      {
        id: "5530",
        title: "Samsung Galaxy Grand Max",
        price: "12950",
        popularity: "48876",
      },
    ];
    mockedAxios.get.mockResolvedValue({ data: { products: mockProducts } });

    render(
      <ProductProvider>
        <ProductList />
      </ProductProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Micromax Canvas Spark")).toBeInTheDocument();
      expect(screen.getByText("$4999")).toBeInTheDocument();
      expect(screen.getByText("Popularity: 51936")).toBeInTheDocument();
      expect(screen.getByText("Samsung Galaxy Grand Max")).toBeInTheDocument();
      expect(screen.getByText("$12950")).toBeInTheDocument();
      expect(screen.getByText("Popularity: 48876")).toBeInTheDocument();
    });
  });

  test("filters and sorts products correctly", async () => {
    const mockProducts = [
      { id: "1", title: "Product A", price: "500", popularity: "1000" },
      { id: "2", title: "Product B", price: "1500", popularity: "2000" },
    ];
    mockedAxios.get.mockResolvedValue({ data: { products: mockProducts } });

    render(
      <ProductProvider>
        <ProductList />
      </ProductProvider>
    );

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText("Search by title"), {
        target: { value: "Product A" },
      });
      fireEvent.change(screen.getByLabelText("Price Range:"), {
        target: { value: "0-1000" },
      });
      fireEvent.change(screen.getByLabelText("Sort by:"), {
        target: { value: "price-asc" },
      });

      expect(screen.getByText("Product A")).toBeInTheDocument();
      expect(screen.queryByText("Product B")).not.toBeInTheDocument();
    });
  });
});
