import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";
import MyEvents from "./pages/MyEvents";
import CreateEvent from "./pages/CreateEvent";
import MyRegistrations from "./pages/MyRegistrations";
import EventRegistrations from "./pages/EventRegistrations";

interface PrivateRouteProps {
  children: JSX.Element;
  role?: "organizer" | "attendee";
}

function PrivateRoute({ children, role }: PrivateRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={user ? <Navigate to="/" replace /> : <Signup />} 
      />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/events"
        element={
          <PrivateRoute role="attendee">
            <EventsList />
          </PrivateRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <PrivateRoute role="attendee">
            <EventDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-events"
        element={
          <PrivateRoute role="organizer">
            <MyEvents />
          </PrivateRoute>
        }
      />
      <Route
        path="/events/:id/registrations"
        element={
          <PrivateRoute role="organizer">
            <EventRegistrations />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-event"
        element={
          <PrivateRoute role="organizer">
            <CreateEvent />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-registrations"
        element={
          <PrivateRoute role="attendee">
            <MyRegistrations />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;