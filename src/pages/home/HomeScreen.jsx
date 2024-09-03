import Navbar from "../components/Navbar";
import useGetTrendingContent from "../../hooks/useGetTrendingContent";
import {
  MOVIE_CATEGORIES,
  ORIGINAL_IMG_BASE_URL,
  TV_CATEGORIES,
} from "../../utils/constants";
import { Info, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useContentStore } from "../../store/content";
import { useEffect, useState } from "react";
import MovieSlider from "../components/MovieSlider";
const HomeScreen = () => {
  const { trendingContent } = useGetTrendingContent();
  const { contentType } = useContentStore();
  const [imgLoading, setImgLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('');

  //this is for mobile screens to have poster rather than backdrop image
  useEffect(() => {
    const updateImageSrc = () => {
      if (window.innerWidth < 640) { // Tailwind's 'sm' breakpoint is 640px
        setImgSrc(ORIGINAL_IMG_BASE_URL + trendingContent?.poster_path);
      } else {
        setImgSrc(ORIGINAL_IMG_BASE_URL + trendingContent?.backdrop_path);
      }
    };

    updateImageSrc(); // Set the initial image
    window.addEventListener('resize', updateImageSrc); // Update image on window resize

    return () => window.removeEventListener('resize', updateImageSrc); // Cleanup listener on unmount
  }, [trendingContent]);

  if (!trendingContent)
    return (
      <div className="h-screen text-white relative">
        <Navbar />
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
      </div>
    );

  return (
    <>
      <div className="relative sm:h-screen h-[80vh] text-white ">
        <Navbar />

        {/* COOL OPTIMIZATION HACK FOR IMAGES */}
        {imgLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer -z-10" />
        )}

<img
      src={imgSrc}
      alt="Hero img"
      className="absolute top-0 left-0 w-full h-full object-cover -z-50"
      onLoad={() => {
        setImgLoading(false);
      }}
    />

        <div
          className="absolute top-0 left-0 w-full h-full bg-black/50 -z-50"
          aria-hidden="true"
        />

        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32">
          <div
            className="bg-gradient-to-b from-black via-transparent to-transparent 
					absolute w-full h-full top-0 left-0 -z-10"
          />

          <div className="max-w-2xl">
            <h1 className="mt-4 sm:text-6xl text-4xl font-extrabold text-balance">
              {trendingContent?.title || trendingContent?.name}
            </h1>
            <p className="mt-2 sm:text-lg text-md">
              {trendingContent?.release_date?.split("-")[0] ||
                trendingContent?.first_air_date.split("-")[0]}{" "}
              | {trendingContent?.adult ? "18+" : "PG-13"}
            </p>

            <p className="mt-4 sm:text-lg text-md">
              {trendingContent?.overview.length > 200
                ? trendingContent?.overview.slice(0, 200) + "..."
                : trendingContent?.overview}
            </p>
          </div>

          <div className="flex mt-8">
            <Link
              to={`/watch/${contentType}/${trendingContent?.id}`}
              className="bg-white hover:bg-white/80 text-black font-bold py-2 px-4 rounded mr-4 flex
							 items-center"
            >
              <Play className="size-6 mr-2 fill-black" />
              Play
            </Link>

            <Link
              to={`/watch/${contentType}/${trendingContent?.id}`}
              className="bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded flex items-center"
            >
              <Info className="size-6 mr-2" />
              More Info
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 bg-black py-10">
        {contentType === "movie"
          ? MOVIE_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))
          : TV_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))}
      </div>
    </>
  );
};
export default HomeScreen;
