import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fireEvent } from "@testing-library/react";

test("Navbar navigation works correctly", () => {
  render(
    <MemoryRouter initialEntries={["/"]}> {/* ✅ Initial route सेट किया */}
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/projects" element={<div>Projects Page</div>} /> {/* ✅ Mock Page */}
      </Routes>
    </MemoryRouter>
  );

  const projectsLink = screen.getByRole("link", { name: /PROJECTS/i });
  fireEvent.click(projectsLink);

  expect(screen.getByText("Projects Page")).toBeInTheDocument(); // ✅ अब सही से test होगा
});
