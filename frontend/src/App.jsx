import "./App.css";
import LandingPage from "./pages/LandingPage";
import ManageGoods from "./pages/ManageGoods";
import Billing from "./pages/Billing";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import ManageUsers from "./pages/ManageUsers";
import BillTable from "./pages/BillTable";
import Analytics from "./pages/Analytics";
import { Roles } from "./constants/constants";
import { Toaster } from "react-hot-toast";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/authContext";

function App() {
  const { authUser } = useAuthContext();
  const userRole = authUser?.role;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              userRole === Roles.ADMIN || userRole === Roles.BRANCHADMIN ? (
                <LandingPage />
              ) : (
                <Navigate to="/billing" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
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
            ) : userRole !== Roles.ADMIN ? (
              <Navigate to="/" />
            ) : (
              <ManageUsers />
            )
          }
        />
        <Route
          path="/manage-goods"
          element={
            !authUser ? (
              <Navigate to="/login" />
            ) : userRole !== Roles.BRANCHADMIN ? (
              <Navigate to="/" />
            ) : (
              <ManageGoods />
            )
          }
        />
        <Route
          path="/billing"
          element={
            !authUser ? (
              <Navigate to="/login" />
            ) : userRole !== Roles.BILLER ? (
              <Navigate to="/" />
            ) : (
              <Billing />
            )
          }
        />
        <Route
          path="/billing/:billId"
          element={
            !authUser ? (
              <Navigate to="/login" />
            ) : userRole !== Roles.BILLER ? (
              <Navigate to="/" />
            ) : (
              <BillTable />
            )
          }
        />
        <Route
          path="/analytics"
          element={
            !authUser ? (
              <Navigate to="/login" />
            ) : userRole === Roles.BILLER ? (
              <Navigate to="/billing" />
            ) : (
              <Analytics />
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
