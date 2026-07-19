import { useEffect, type JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { setUser, clearUser } from "./store/authSlice";
import type { RootState, AppDispatch } from "./store/store";

import Login from "./pages/Login/Login";
import Board from "./pages/Dashboard/Board";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/" replace />;

  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
        Loading...
      </div>
    );
  if (user) return <Navigate to="/board" replace />;

  return children;
};

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(setUser({ uid: currentUser.uid, email: currentUser.email }));
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/board"
          element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
