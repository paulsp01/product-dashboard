import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ProductDetails from "./ProductDetailModel";

describe("ProductDetails Component", () => {
  test("renders product details correctly", () => {
    const mockProduct = {
      name: "Test Product",
      description: "This is a test product.",
      price: 100,
    };

    render(<ProductDetails product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("This is a test product.")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
  });
});
