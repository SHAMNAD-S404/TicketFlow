import React from "react";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "./utils/toastConfig";

const App: React.FC = () => {
  return (
    <div>
      <AppRoutes />

      <ToastContainer {...toastConfig} />
    </div>
  );
};

export default App;
