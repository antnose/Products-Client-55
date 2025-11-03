import LatestProducts from "../LatestProducts/LatestProducts";

const latestProductsPromise = fetch(
  `http://localhost:3001/latest-products`
).then((res) => res.json());
const Home = () => {
  return (
    <div>
      <LatestProducts latestProductsPromise={latestProductsPromise} />
    </div>
  );
};

export default Home;
