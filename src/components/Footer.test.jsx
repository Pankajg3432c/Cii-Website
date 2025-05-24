import { render, screen } from "@testing-library/react";
import Footer from "../components/Footer";

test("renders footer with correct heading", () => {
  render(<Footer />);
  expect(screen.getByText("Innovation & Incubation")).toBeInTheDocument();
});

test("renders address correctly", () => {
  render(<Footer />);
  expect(screen.getByText(/Geetanjali Institute of Technical Studies/i)).toBeInTheDocument();
});

test("renders all social media icons", () => {
  render(<Footer />);
  expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Twitter" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Instagram" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument();
});

test("displays copyright text", () => {
  render(<Footer />);
  expect(screen.getByText(/Copyrights © 2024 All Rights Reserved/i)).toBeInTheDocument();
});
