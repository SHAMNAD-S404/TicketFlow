import React from "react";
import { useNavigate } from "react-router-dom";
import Page404img from "../assets/images/404.png"; // Adjust the path as needed

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${Page404img})` }} // Dynamically set the background image
    >
      <div className="bg-white/80 p-6 rounded-2xl shadow-lg text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-lg text-gray-600 mt-2">Oops! Page Not Found</p>
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
