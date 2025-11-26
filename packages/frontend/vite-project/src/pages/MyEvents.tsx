import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function MyEvents() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={() => navigate("/")}
              className="text-lg font-medium text-gray-900 hover:text-blue-600"
            >
              ← Back to Dashboard
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-4">My Events</h1>
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          This feature is coming soon! You'll be able to see all events you've created here.
        </div>
      </main>
    </div>
  );
}
