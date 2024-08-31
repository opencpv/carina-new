import svgCollection from "../public/imgs/Group 141.png";
import congratsAnimation from "../public/lottie/congrats.json";
import connectAnimation from "../public/lottie/connection.json";
import healthAnimation from "../public/lottie/health.json";
import successAnimation from "../public/lottie/success.json";

const useAssets = () => {
  return {
    lottie: { healthAnimation, congratsAnimation, connectAnimation, successAnimation },
    image: {
      svgCollection,
    },
  };
};

export default useAssets;
