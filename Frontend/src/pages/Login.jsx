import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false); // New Loading State

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { withCredentials: true },
      );

      if (response.data.success) {
        navigate("/home");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/google",
        { token: credentialResponse.credential },
        { withCredentials: true },
      );

      if (response.data.success) {
        console.log("Google Login Success");
        navigate("/home");
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#28001a] font-sans flex flex-col items-center">
      {/* Header Banner */}
      <div className="w-full bg-[#5f003f] py-10 px-4 text-center relative border-b border-[#3e0029]">
        <h1 className="text-white text-4xl font-bold mb-2">
          Sign in to Fandom
        </h1>
        <p className="text-purple-200 text-sm">
          The world's largest fan-generated entertainment & gaming platform.
        </p>

        {/* Fandom Logo Icon */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#5f003f] p-1 rounded-full border-4 border-[#28001a]">
          <div className="bg-white rounded-full p-2">
            <img
              src="https://www.fandom.com/favicon.ico"
              alt="logo"
              className="w-8 h-8"
            />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="bg-white w-full max-w-5xl mt-12 mb-10 rounded-sm shadow-2xl flex flex-col md:flex-row overflow-hidden custom-responsive-container">
        {/* Left Side: Social Login */}
        <div className="md:w-1/2 p-10 border-b md:border-b-0 md:border-r border-gray-200">
          <button className="flex items-center text-sm font-bold text-gray-700 mb-8 uppercase tracking-widest hover:text-purple-700 transition">
            <span className="mr-2">←</span> Back
          </button>

          <h2 className="text-xl font-bold text-gray-900 mb-8">
            Sign in with account
          </h2>
          <div className="space-y-3">
            {/* Google Sign In Wrapper */}
            <div className="w-full border border-gray-300 rounded flex justify-center py-1 hover:bg-gray-50 cursor-pointer">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log("Login Failed")}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-10 bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Sign in</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                Username *
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                placeholder="Username"
                className="w-full p-4 border border-gray-400 rounded-md focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition"
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                Password *
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="w-full p-4 border border-gray-400 rounded-md focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition"
              />
              <span className="absolute right-4 top-11 text-gray-500 cursor-pointer text-xl">
                👁️
              </span>
            </div>

            <div className="text-left">
              <span className="text-[#fa005a] text-sm font-bold cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-bold py-4 rounded-md uppercase tracking-widest text-sm shadow-md transition-all cursor-pointer ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#fa005a] hover:bg-[#c40046]"
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-[11px] text-gray-500 leading-relaxed">
              By continuing, you agree to Fandom's{" "}
              <span className="text-[#fa005a] font-bold cursor-pointer">
                Terms of Use
              </span>{" "}
              and{" "}
              <span className="text-[#fa005a] font-bold cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>
          </form>

          <div className="mt-10 text-center border-t pt-6 border-gray-100">
            <p className="text-sm text-gray-700">
              Don't have an account?{" "}
              <span
                className="text-[#fa005a] font-bold cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
              >
                Register now
              </span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Legal notice */}
      <footer className="mb-10 text-center px-4">
        <p className="text-[11px] text-gray-400">
          This site is protected by reCAPTCHA and the Google{" "}
          <span className="text-gray-500 hover:underline cursor-pointer">
            Privacy Policy
          </span>{" "}
          and{" "}
          <span className="text-gray-500 hover:underline cursor-pointer">
            Terms of Service
          </span>{" "}
          apply.
        </p>
      </footer>
    </div>
  );
}
