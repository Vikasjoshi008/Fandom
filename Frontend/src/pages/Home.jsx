import React from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed");
    }
  };
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Simple Fandom Navbar */}
      <nav className="bg-[#5f003f] p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-4">
          <img
            src="https://www.fandom.com/favicon.ico"
            alt="logo"
            className="w-8 h-8 bg-white rounded-full p-1"
          />
          <span className="text-white font-bold text-xl tracking-tighter">
            FANDOM
          </span>
        </div>
        <div className="space-x-6 text-white text-sm font-bold uppercase">
          <span className="cursor-pointer hover:text-purple-300">Games</span>
          <span className="cursor-pointer hover:text-purple-300">Movies</span>
          <span className="cursor-pointer hover:text-purple-300">TV</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-[#fa005a] hover:bg-white hover:text-[#fa005a] text-white px-4 py-2 rounded font-bold text-xs uppercase transition-all cursor-pointer border border-[#fa005a]"
        >
          Logout
        </button>
      </nav>

      {/* Hero Section */}
      <header className="bg-[#28001a] py-16 px-6 text-center text-white">
        <h1 className="text-5xl font-extrabold mb-4">Explore your fandoms.</h1>
        <p className="text-lg text-purple-200 mb-8">
          The entertainment site where fans create the content.
        </p>
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for a community..."
            className="w-full p-4 rounded-full text-black outline-none"
          />
        </div>
      </header>

      {/* Content Grid */}
      <main className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded shadow-sm overflow-hidden hover:shadow-lg transition"
          >
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">Trending Wiki {i}</h3>
              <p className="text-gray-600 text-sm">
                Discover the latest updates from the community.
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
