import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Button from "../components/Button";
import InputField from "../components/InputField";
import { loginUser } from "../services/auth";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!formData.email || !formData.password) {
      return "Please fill in all fields.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await loginUser(formData);

      const user = response.data.user ?? { email: formData.email };
      login(user, response.data.token);

      navigate("/");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-5"
      style={{
        backgroundImage: "url('/images/background.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-lg rounded-3xl border border-cyan-400/30 bg-slate-900/70 backdrop-blur-xl p-10 shadow-[0_0_40px_rgba(0,255,255,0.15)]"
      >
        <p className="uppercase tracking-[5px] text-cyan-400 text-sm mb-3">
          SYSTEM ONLINE
        </p>

        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-300 mb-8">
          Continue your learning adventure.
        </p>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500 bg-red-500/10 p-3 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "🚀 Enter Mission"}
          </Button>
        </form>

        <div className="mt-8 text-center text-gray-400">
          New Explorer?{" "}
          <Link
            to="/register"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;