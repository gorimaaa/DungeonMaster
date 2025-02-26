import { Outlet, Link } from "react-router";

export default function MainLayout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/plateau">Plateau</Link>
      </nav>
      <Outlet />
    </div>
  );
}
