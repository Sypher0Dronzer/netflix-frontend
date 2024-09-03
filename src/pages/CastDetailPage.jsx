import { Link, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { formatDateOfBirth } from "../utils/dateFunction";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { Helmet } from "react-helmet";

const CastDetailPage = () => {
  const [details, setDetails] = useState("null");
  const [moviesCasted, setMoviesCasted] = useState([]);
  const [tvsCasted, setTvsCasted] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const [showArrows2, setShowArrows2] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const sliderRef = useRef();
  const sliderRef2 = useRef();

  const { id } = useParams();
  useEffect(() => {
    const getCastDetails = async (id) => {
      try {
        const res = await axios.get(`/api/v1/cast/${id}`);
        setTvsCasted(res.data.tvs.cast);
        setMoviesCasted(res.data.movies.cast);
        setDetails(res.data.castDetails);
        setIsLoading(false);
      } catch {
        setIsLoading(false);
        setDetails(false);
      }
    };
    getCastDetails(id);
  }, [id]);

  const scrollLeft = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };
  const scrollRight = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };
  const scrollLeft2 = () => {
    if (sliderRef2.current)
      sliderRef2.current.scrollBy({
        left: -sliderRef2.current.offsetWidth,
        behavior: "smooth",
      });
  };
  const scrollRight2 = () => {
    if (sliderRef2.current)
      sliderRef2.current.scrollBy({
        left: sliderRef2.current.offsetWidth,
        behavior: "smooth",
      });
  };

  if (isLoading)
    return (
      <div className='h-screen'>
				<div className='flex justify-center items-center bg-black h-full'>
					<Loader className='animate-spin text-red-600 size-10' />
				</div>
			</div>
    );

  if (!details) {
    return (
      <div className="bg-black text-white h-screen">
        <div className="max-w-6xl mx-auto">
          <Navbar />
          <div className=" flex items-center justify-center h-[80vh]  px-4  ">
            <h2 className="text-2xl sm:text-5xl font-bold ">
              Content not found 😥
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (<>
  <Helmet>
      <title>{details?.name}</title>
      <meta property="og:title" content={details?.name} />
      <meta property="og:description" content={`Know more about ${details?.name }. Visit us for more!`} />
      <meta property="og:image" content={SMALL_IMG_BASE_URL + details?.profile_path} />
      <meta property="og:url" content={`https://netflix-clone-7ldf.onrender.com/cast/${id}`} />
      <meta property="og:type" content="website" />
    </Helmet>
    <div className="bg-black  min-h-screen text-white">
        <Navbar />
      <div className="mx-auto max-w-6xl px-4  h-full">
        <div className="flex flex-col sm:flex-row mt-4 gap-x-6 md:gap-x-12 ">
          <div className="sm:w-72 w-52 flex-none mx-auto md:mx-0">
            <img
              src={SMALL_IMG_BASE_URL + details?.profile_path}
              alt="Profile pic"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="md:text-4xl text-2xl font-bold mt-4 md:mt-0">{details.name}</h1>

            <h3 className="font-semibold md:text-xl text-md mt-4">Place of birth</h3>
            <p className="md:mt-2 text-sm md:text-md"> {details.place_of_birth}</p>

            <h3 className="font-semibold md:text-xl text-md mt-4">Birthday</h3>
            <p className="md:mt-2 text-sm md:text-md">{formatDateOfBirth(details.birthday)}</p>

            <h3 className="font-semibold md:text-xl text-md mt-4">Biography</h3>
            <p className="md:mt-2 text-sm md:text-lg leading-loose">
        {isExpanded
          ? details?.biography
          : details?.biography.length > 460
          ? details?.biography.slice(0, 460) + "..."
          : details?.biography}
      </p>
      {details?.biography.length > 460 && (
        <button
          onClick={toggleExpand}
          className="mt-2 text-red-700 hover:underline"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
          </div>
        </div>

        {/* Movies Casted */}

        <h2 className="mt-8 text-2xl font-bold">Movies Casted</h2>
        <div
          className="relative mt-4 "
          onMouseEnter={() => setShowArrows(true)}
          onMouseLeave={() => setShowArrows(false)}
        >
          <div
            className="flex space-x-4 overflow-x-scroll scrollbar-hide"
            ref={sliderRef}
          >
            {moviesCasted.map((item) => {
              if (item.poster_path === null) return null;
              return (
                <Link
                  to={`/watch/movie/${item.id}`}
                  className="sm:w-48 w-32 drop-shadow-[2px_2px_2px_rgba(255,255,255,0.4)] flex-none relative group"
                  key={item.id + item.character}
                >
                  <div className="rounded-lg overflow-hidden">
                      
                    <img
                      src={SMALL_IMG_BASE_URL + item.poster_path}
                      alt="Movie image"
                      className="transition-transform duration-300 ease-in-out group-hover:scale-125"
                    />
                  </div>
                  <p className="mt-2 text-center">{item.title} </p>
                </Link>
              );
            })}
          </div>
          {showArrows && (
            <>
              <button
                className="absolute top-32  left-2 hidden sm:flex items-center justify-center 
            size-12 rounded-full bg-red-700 bg-opacity-80 hover:bg-opacity-95 text-white z-10
            "
                onClick={scrollLeft}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                className="absolute top-32  right-2 hidden sm:flex items-center justify-center
            size-12 rounded-full bg-red-700 bg-opacity-60 hover:bg-opacity-95 text-white z-10
            "
                onClick={scrollRight}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Tv Casted */}
        <h2 className="sm:mt-6 text-2xl font-bold">TV Series Casted</h2>
        <div
          className="relative mt-4 pb-8 "
          onMouseEnter={() => setShowArrows2(true)}
          onMouseLeave={() => setShowArrows2(false)}
        >
          <div
            className="flex space-x-4 overflow-x-scroll scrollbar-hide"
            ref={sliderRef2}
          >
            {tvsCasted.map((item) => {
              if (item.poster_path === null) return null;
              return (
                <Link
                  to={`/watch/tv/${item.id}`}
                  className="sm:w-48 w-32 flex-none drop-shadow-[2px_2px_2px_rgba(255,255,255,0.4)] relative group"
                  key={item.id + item.character}
                >
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={SMALL_IMG_BASE_URL + item.poster_path}
                      alt="Movie image"
                      className="transition-transform duration-300 ease-in-out group-hover:scale-125"
                    />
                  </div>
                  <p className="mt-2 text-center">{item.name} </p>
                </Link>
              );
            })}
          </div>
          {showArrows2 && (
            <>
              <button
                className="absolute top-32  left-2 hidden sm:flex items-center justify-center 
            size-12 rounded-full bg-red-700 bg-opacity-80 hover:bg-opacity-95 text-white z-10
            "
                onClick={scrollLeft2}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                className="absolute top-32  right-2 hidden sm:flex items-center justify-center
            size-12 rounded-full bg-red-700 bg-opacity-60 hover:bg-opacity-95 text-white z-10
            "
                onClick={scrollRight2}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  </>
  );
};

export default CastDetailPage;
