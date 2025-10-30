import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Image,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { Link } from "react-router";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    imageUrl: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState("");

  const { createUserEmailAndPass, loading, setLoading, googleSignin } =
    use(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Handle image preview
    if (name === "imageUrl" && value) {
      setPreviewImage(value);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid image URL";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (error) {
      {
        error;
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Use await to wait for the registration promise to resolve
      const userCredential = await createUserEmailAndPass(
        formData.email,
        formData.password
      );

      // Handle successful registration with SweetAlert2
      const user = userCredential.user;
      Swal.fire({
        title: "Registration Success!",
        text: `Account created for ${user.email}. You are now logged in.`,
        icon: "success",
        confirmButtonColor: "#48bb78",
      });

      // Optionally: Redirect user or clear form data here
    } catch (error) {
      // Handle registration failure
      // console.error("Registration failed:", error);

      let errorMessage =
        error.message || "An unknown error occurred during registration.";
      // Clean up common Firebase error messages for better user experience
      if (
        errorMessage.includes("Firebase: Error (auth/email-already-in-use)")
      ) {
        errorMessage = "This email address is already in use.";
      }

      // Show error message using SweetAlert2
      Swal.fire({
        title: "Registration Failed!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#f56565",
      });
    } finally {
      // Ensure loading state is reset regardless of success or failure
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // 1. Start loading state
    setLoading(true);

    googleSignin().then((userCredential) => {
      // --- START OF .then() ACTIONS ---

      // A. Clear the loading indicator now that the operation is successful
      setLoading(false);

      // B. Handle the successful sign-in with SweetAlert2
      const user = userCredential.user;

      // Create user in the database
      const newUser = {
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
      };
      // --- 👇 CORRECTED FETCH CHAIN 👇 ---
      fetch(`http://localhost:3001/users`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          // console.log("User data saved to DB:", data);
        })
        .catch((fetchError) => {
          // console.error("Database save failed:", fetchError);
        });

      Swal.fire({
        title: "User Created Successfully",
        text: `Welcome, ${user.displayName || "User"}! You are signed in.`,
        icon: "success",
        draggable: true,
        confirmButtonColor: "#48bb78", // Optional: added a nice green color
      });
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imagePreviewVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.h1
            className="text-3xl font-bold text-gray-900 mb-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Join Smart Deals
          </motion.h1>
          <p className="text-gray-600">
            Create your account to start bidding on amazing products
          </p>
        </motion.div>

        {/* Image Preview */}
        {previewImage && (
          <motion.div
            variants={imagePreviewVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <img
                src={previewImage}
                alt="Profile preview"
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-1 -right-1"
              >
                <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Image URL Field */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Profile Image URL{" "}
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.imageUrl ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>
            {errors.imageUrl && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.imageUrl}
              </motion.p>
            )}
            {previewImage && !errors.imageUrl && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-green-600 flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Image URL looks good!
              </motion.p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.password}
              </motion.p>
            )}
            {formData.password && !errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-green-600 flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Strong password!
              </motion.p>
            )}
          </motion.div>

          {/* Password Requirements */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600"
          >
            <p className="font-medium mb-2">Password must contain:</p>
            <ul className="space-y-1">
              <li
                className={`flex items-center gap-2 ${
                  formData.password.length >= 8 ? "text-green-600" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    formData.password.length >= 8
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
                At least 8 characters
              </li>
              <li
                className={`flex items-center gap-2 ${
                  /(?=.*[a-z])/.test(formData.password) ? "text-green-600" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    /(?=.*[a-z])/.test(formData.password)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
                One lowercase letter
              </li>
              <li
                className={`flex items-center gap-2 ${
                  /(?=.*[A-Z])/.test(formData.password) ? "text-green-600" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    /(?=.*[A-Z])/.test(formData.password)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
                One uppercase letter
              </li>
              <li
                className={`flex items-center gap-2 ${
                  /(?=.*\d)/.test(formData.password) ? "text-green-600" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    /(?=.*\d)/.test(formData.password)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
                One number
              </li>
            </ul>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <motion.div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Creating Account...
              </motion.div>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <motion.div variants={itemVariants} className="flex items-center my-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </motion.div>

        {/* Google Sign Up */}
        <motion.button
          variants={itemVariants}
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </motion.button>

        {/* Footer Links */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <p>
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
          <p className="mt-2 text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
