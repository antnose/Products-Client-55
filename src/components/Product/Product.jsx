import React from "react";
import { Link } from "react-router";

const Product = ({ product }) => {
  const {
    title,
    price_min,
    price_max,
    image,
    category,
    condition,
    usage,
    description,
    location,
    seller_name,
    seller_image,
    seller_contact,
    email,
    created_at,
    status,
  } = product;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative">
        <img src={image} alt={title} className="w-full h-64 object-cover" />
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status?.charAt(0).toUpperCase() + status?.slice(1)}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
            {category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Title and Price */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">
              ${price_min}
            </span>
            {price_max > price_min && (
              <>
                <span className="text-gray-400">-</span>
                <span className="text-xl font-semibold text-gray-600">
                  ${price_max}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Condition and Usage */}
        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            {condition?.charAt(0).toUpperCase() + condition?.slice(1)}
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
            {usage?.charAt(0).toUpperCase() + usage?.slice(1)}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Location and Date */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{location}</span>
          </div>
          <span>{formatDate(created_at)}</span>
        </div>

        {/* Contact Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/productDetails/${product._id}`}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-center font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
