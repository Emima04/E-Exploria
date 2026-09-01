import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { registerUser } from "../services/auth";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "explorer",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return "Please fill in all fields.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
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
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      navigate("/login");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message === "Network Error" || err.code === "ERR_NETWORK" || !err.response) {
        setError("Cannot connect to server. Please make sure the backend server is running on port 8080.");
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="
          w-full
          max-w-2xl
          rounded-3xl
          border
          border-cyan-400/40
          bg-slate-900/60
          backdrop-blur-2xl
          p-10
          shadow-[0_0_60px_rgba(34,211,238,0.25)]
        "
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />

          <p className="uppercase tracking-[0.3em] text-green-300 text-xs font-semibold">
            SYSTEM ONLINE
          </p>
        </div>

        <h1 className="text-5xl font-black text-white tracking-wide">
          CREATE PROFILE
        </h1>

        <p className="mt-3 text-gray-300 leading-7">
          Create your Explorer account and begin your journey through the
          worlds of knowledge.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                      <InputField
            label="Explorer Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your explorer name"
          />

          <div className="space-y-2">
            <label className="block text-cyan-300 text-sm tracking-widest uppercase">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                border-cyan-500/40
                bg-white/5
                px-4
                py-3
                text-white
                placeholder:text-gray-400
                backdrop-blur-lg
                outline-none
                focus:border-cyan-300
                focus:ring-2
                focus:ring-cyan-500/30
                transition-all
              "
            >
              <option value="explorer">Explorer</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <InputField
            label="Email Address"
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
            placeholder="Create a password"
          />

          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />

          <div className="pt-3">
            <Button type="submit" disabled={loading}>
              {loading
                ? "CREATING PROFILE..."
                : formData.role === "faculty"
                ? "CREATE FACULTY"
                : "🚀 CREATE EXPLORER"}
            </Button>
          </div>
        </form>

        <div className="mt-8 border-t border-cyan-400/20 pt-6 text-center">
          <p className="text-gray-400">
            Already an Explorer?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              LOGIN
            </Link>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-cyan-400/70">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          EXPLORIA SECURITY PROTOCOL ACTIVE
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default Register;