import React from "react";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "./utils/toastConfig";
import store from "./redux/store";
import { Provider } from "react-redux";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>

        <AppRoutes />
        <ToastContainer {...toastConfig} />
        
      </div>
    </Provider>
  );
};

export default App;
