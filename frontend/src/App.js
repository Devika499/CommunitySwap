import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PostItem from './pages/PostItem';
import Items from './pages/Items';
import EditItem from './pages/EditItem';
import Notifications from './pages/Notifications';
import Navbar from './components/Navbar';
import MySwaps from './pages/MySwaps';
import Chats from './pages/Chats';
import './App.css';

// A proper private route component using AuthContext
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register' && <Navbar />}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/post-item"
            element={
              <PrivateRoute>
                <PostItem />
              </PrivateRoute>
            }
          />
          <Route
            path="/items"
            element={
              <PrivateRoute>
                <Items />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/edit-item/:id"
            element={
              <PrivateRoute>
                <EditItem />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-swaps" element={<MySwaps />} />
          <Route
            path="/chats"
            element={
              <PrivateRoute>
                <Chats />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
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
