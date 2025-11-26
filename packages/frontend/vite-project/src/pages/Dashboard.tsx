import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      <div className="space-y-2">
        {user.role === "organizer" && (
          <>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              onClick={() => navigate("/my-events")}
            >
              My Events
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
              onClick={() => navigate("/create-event")}
            >
              Create Event
            </button>
          </>
        )}
        {user.role === "attendee" && (
          <>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              onClick={() => navigate("/events")}
            >
              Browse Events
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
              onClick={() => navigate("/my-registrations")}
            >
              My Registrations
            </button>
          </>
        )}
      </div>
    </div>
  );
}
