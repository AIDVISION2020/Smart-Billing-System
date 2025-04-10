import "./App.css";
import LandingPage from "./pages/LandingPage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import ManageUsers from "./pages/ManageUsers";
import { Roles } from "./constants/constants";
import { Toaster } from "react-hot-toast";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/authContext";

function App() {
  const { authUser } = useAuthContext();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={authUser ? <LandingPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/manage-users"
          element={
            !authUser ? (
              <Navigate to="/login" />
            ) : authUser.role !== Roles.ADMIN ? (
              <Navigate to="/" />
            ) : (
              <ManageUsers />
            )
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
