import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // ✅ Router Import
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Footer from "../components/Footer";

test("renders Card component correctly", () => {
  render(<Card title="Test Title" description="Test Desc" image="test.jpg" />);
  expect(screen.getByText("Test Title")).toBeInTheDocument();
  expect(screen.getByText("Test Desc")).toBeInTheDocument();
});

test("renders Footer component with correct text", () => {
  render(<Footer />);
  expect(screen.getByText("© 2024 All Rights Reserved")).toBeInTheDocument();
});

test("renders Navbar with links", () => {
  render(
    <MemoryRouter> {/* ✅ Router में wrap किया */}
      <Navbar />
    </MemoryRouter>
  );

  expect(screen.getByText("HOME")).toBeInTheDocument();
  expect(screen.getByText("ABOUT")).toBeInTheDocument();
  expect(screen.getByText("PROJECTS")).toBeInTheDocument();
});
