import { render, screen } from "@testing-library/react";
import HelloWorld from "./../pages/HelloWorld";

test('affiche "Hello, World!"', () => {
  render(<HelloWorld />);
  expect(screen.getByText("Hello, World!"));
});
