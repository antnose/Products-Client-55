import React, { use } from "react";
import Product from "../Product/Product";

const LatestProducts = ({ latestProductsPromise }) => {
  const products = use(latestProductsPromise);
  return (
    <>
      <h1 className="text-center pt-5 text-7xl font-bold text-purple-600">
        Recent Products
      </h1>
      <div className="grid lg:grid-cols-3 gap-5 max-w-7xl mx-auto mt-10">
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </>
  );
};

export default LatestProducts;
