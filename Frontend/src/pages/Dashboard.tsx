import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { RootState } from "../store";

function Sidebar() {
  const { authToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <ul className="mt-5 space-y-3">
        <li>
          <a href="#" className="block px-3 py-2 rounded hover:bg-gray-700">
            Accueil
          </a>
        </li>
        <li>
          <a href="#" className="block px-3 py-2 rounded hover:bg-gray-700">
            Statistiques
          </a>
        </li>
        <li>
          <a href="#" className="block px-3 py-2 rounded hover:bg-gray-700">
            Paramètres
          </a>
        </li>
        <li>
          <a href="" className="block px-3 py-2 rounded hover:bg-gray-700">
            Paramètres
          </a>
        </li>
        {!authToken ? (
          <>
            <li>
              <NavLink
                to="/login"
                className="block px-3 py-2 rounded hover:bg-gray-700"
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className="block px-3 py-2 rounded hover:bg-gray-700"
              >
                Register
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <a
              onClick={() => {
                dispatch(logout());
              }}
              className="block px-3 py-2 rounded hover:bg-gray-700 cursor-pointer"
            >
              Logout
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

function Card() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="bg-white shadow-lg rounded-lg p-5 cursor-pointer hover:shadow-2xl transition"
        onClick={() => navigate("/map")}
      >
        <h3 className="text-xl font-bold">Carte 1</h3>
        <p className="text-gray-500">Cliquez pour voir la carte</p>
      </div>
      <div
        className="bg-white shadow-lg rounded-lg p-5 cursor-pointer hover:shadow-2xl transition"
        onClick={() => navigate("/map2")}
      >
        <h3 className="text-xl font-bold">Carte 2 (Juba)</h3>
        <p className="text-gray-500">Cliquez pour voir la carte</p>
      </div>
      <div
        className="bg-white shadow-lg rounded-lg p-5 cursor-pointer hover:shadow-2xl transition"
        onClick={() => navigate("/SignUp")}
      >
        <h3 className="text-xl font-bold">Inscription</h3>
        <p className="text-gray-500">Cliquez ici pour vous inscrire !</p>
      </div>
    </>
  );
}

function Dashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-bold mb-5">Bienvenue sur le Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
          <Card />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return <Dashboard />;
}

// export default function Dashboard() {
//     return <>

//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold underline">Hello, Tailwind in React!</h1>
//       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
//         Cliquer ici
//       </button>
//     </div>
//     </>
//   }
