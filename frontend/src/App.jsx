import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Login from "./components/auth_components/Login";
import Logout from "./components/auth_components/Logout";
import Dash from "./components/dashboard_components/Dash";
import DashboardMain from "./components/dashboard_pages/DashboardMain";
import ChangePassword from "./components/auth_components/ChangePassword";
import DeviceManager from "./components/auth_components/DeviceManager";
import NotFound from "./components/pages/NotFound";
import Loading from "./components/pages/Loading";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard" element={<Dash />}>
            <Route path="" index element={<DashboardMain />} />
            <Route path="change_password" element={<ChangePassword />} />
            <Route path="device_manager" element={<DeviceManager />} />
          </Route>
          <Route path="/loading" element={<Loading />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
