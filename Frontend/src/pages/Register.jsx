import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "username") {
      setIsUsernameAvailable(null);
    }
  };

  const checkUsername = async () => {
    if (!formData.username) return;
    try {
      // const res = await axios.get(
      //   `http://localhost:5000/api/auth/check/${formData.username}`,
      // );
      // setIsUsernameAvailable(res.data.available);
      setIsUsernameAvailable(true);
    } catch (err) {
      setIsUsernameAvailable(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData,
        { withCredentials: true },
      );

      console.log("Registration Successful:", response.data);
      alert("Registration successful! Redirecting to Home...");
      navigate("/home");
    } catch (err) {
      console.error("Registration Error:", err.response?.data?.message);
      alert(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#28001a] font-sans flex flex-col items-center">
      <div className="w-full bg-[#5f003f] py-8 px-4 text-center relative">
        <h1 className="text-white text-3xl font-bold mb-2">
          Join Fandom Today
        </h1>
        <p className="text-purple-200 text-sm">
          The world's largest fan-generated entertainment & gaming platform.
        </p>
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

      <main className="bg-white w-full max-w-5xl mt-10 rounded-sm shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Social */}
        <div className="md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-bold text-gray-500 mb-6 uppercase tracking-wider cursor-pointer hover:text-purple-700"
          >
            <span className="mr-2">←</span> Back
          </button>
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Connect an account
          </h2>
          <div className="flex justify-center border p-2 rounded cursor-pointer hover:bg-gray-50 transition">
            <GoogleLogin
              onSuccess={(res) =>
                axios.post("http://localhost:5000/api/auth/google", {
                  token: res.credential,
                })
              }
              onError={() => console.log("Google Register Failed")}
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-8 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Register</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded focus:border-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Username *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={checkUsername} // Checks availability when user clicks away
                  required
                  placeholder="Choose a username"
                  className={`w-full p-3 border-2 rounded outline-none ${
                    isUsernameAvailable === true
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {isUsernameAvailable === true && (
                <p className="text-green-600 text-xs mt-1">
                  ✓ Nice! This username is available.
                </p>
              )}
              {isUsernameAvailable === false && (
                <p className="text-red-600 text-xs mt-1">
                  ✗ Sorry, this username is taken.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded focus:border-purple-600 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-bold py-3 rounded uppercase transition cursor-pointer ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#fa005a] hover:bg-purple-800"
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <span
              className="text-[#fa005a] font-bold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
