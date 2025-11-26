import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Event Platform</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user.email}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {user.role}
              </span>
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
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.role === "organizer" && (
            <>
              <button
                className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 transition"
                onClick={() => navigate("/create-event")}
              >
                <h3 className="text-xl font-semibold mb-2">Create Event</h3>
                <p className="text-blue-100">Create a new event for attendees</p>
              </button>
              <button
                className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 transition"
                onClick={() => navigate("/events")}
              >
                <h3 className="text-xl font-semibold mb-2">View All Events</h3>
                <p className="text-green-100">See all events in the platform</p>
              </button>
            </>
          )}
          {user.role === "attendee" && (
            <>
              <button
                className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 transition"
                onClick={() => navigate("/events")}
              >
                <h3 className="text-xl font-semibold mb-2">Browse Events</h3>
                <p className="text-blue-100">Discover and register for events</p>
              </button>
              <button
                className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 transition"
                onClick={() => navigate("/my-registrations")}
              >
                <h3 className="text-xl font-semibold mb-2">My Registrations</h3>
                <p className="text-green-100">View your registered events</p>
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
