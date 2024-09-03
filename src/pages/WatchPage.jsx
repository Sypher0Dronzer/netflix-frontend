import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "./components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from "react-player";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import { formatReleaseDate } from "../utils/dateFunction";
import WatchPageSkeleton from "./components/skeletons/WatchPageSkeleton";

//for seo
import { Helmet } from 'react-helmet';

const WatchPage = () => {
  const { id, type } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [credit, setCredit] = useState([]);
  const [similarContent, setSimilarContent] = useState({});
  const [imgSrc, setImgSrc] = useState('');


  const sliderRef = useRef(null);
  const sliderRef2 = useRef(null);

  

  // Get Trailers
  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await axios.get(`/api/v1/${type}/${id}/trailers`);
        setTrailers(res.data.trailers);
      } catch (error) {
        if (error.message.includes("404")) {
          setTrailers([]);
        }
      }
    };

    getTrailers();
  }, [type, id]);

  // Get Similar Content
  useEffect(() => {
    const getSimilarContent = async () => {
      try {
        const res = await axios.get(`/api/v1/${type}/${id}/similar`);
        setSimilarContent(res.data.similar);
      } catch (error) {
        if (error.message.includes("404")) {
          setSimilarContent([]);
        }
      }
    };

    getSimilarContent();
  }, [type, id]);

  //  Get the content details
  useEffect(() => {
    const getContentDetails = async () => {
      try {
        const res = await axios.get(`/api/v1/${type}/${id}/details`);
        setContent(res.data.content);
      } catch (error) {
        if (error.message.includes("404")) {
          setContent(null);
        }
      } finally {
        setLoading(false);
      }
    };

    getContentDetails();
  }, [type, id]);

  useEffect(() => {
    const updateImageSrc = () => {
      if (window.innerWidth > 640) { // Tailwind's 'sm' breakpoint is 640px
        setImgSrc(ORIGINAL_IMG_BASE_URL + content?.poster_path);
      } else {
        setImgSrc(ORIGINAL_IMG_BASE_URL + content?.backdrop_path);
      }
    };
    updateImageSrc(); // Set the initial image
    window.addEventListener('resize', updateImageSrc); // Update image on window resize

    return () => window.removeEventListener('resize', updateImageSrc); // Cleanup listener on unmount
  }, [content]);

  useEffect(() => {
    const getCreditData = async () => {
      try {
        const res = await axios.get(`/api/v1/${type}/${id}/credits`);
        const data = res.data.credits.cast;
        setCredit(data);
      } catch (error) {
        console.log(error);
      }
    };

    getCreditData();
  }, [type, id]);

  const handleNext = () => {
    if (currentTrailerIdx < trailers.length - 1)
      setCurrentTrailerIdx(currentTrailerIdx + 1);
  };
  const handlePrev = () => {
    if (currentTrailerIdx > 0) setCurrentTrailerIdx(currentTrailerIdx - 1);
  };

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

  if (loading)
    return (
      <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );

  if (!content) {
    return (
      <div className="bg-black text-white h-screen">
        <div className="max-w-6xl mx-auto">
          <Navbar />
          <div className="text-center mx-auto px-4 py-8 h-full mt-40">
            <h2 className="text-2xl sm:text-5xl font-bold text-balance">
              Content not found 😥
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (<>
  <Helmet>
      <title>{content?.title || content?.name}</title>
      <meta property="og:title" content={content?.title || content?.name} />
      <meta property="og:description" content={`Get details about ${content?.name || content?.title}. Visit us for more!`} />
      <meta property="og:image" content={SMALL_IMG_BASE_URL + content?.backdrop_path} />
      <meta property="og:url" content={`https://netflix-clone-7ldf.onrender.com/watch/${type}/${id}`} />
      <meta property="og:type" content="website" />
    </Helmet>
  
    <div className="bg-black min-h-screen text-white">
        <Navbar />
      <div className="mx-auto max-w-6xl px-4 pb-8 h-full">

        {/* movie details */}
        <div
          className="flex flex-col-reverse md:flex-row mt-4 items-center justify-between gap-16 
				max-w-6xl mx-auto"
        >
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl sm:text-5xl font-bold text-balance">
              {content?.title || content?.name}
            </h2>

            <p className="mt-2 text-md sm:text-lg">
              {formatReleaseDate(
                content?.release_date || content?.first_air_date
              )}{" "}
              |{" "}
              {content?.adult ? (
                <span className="text-red-600">18+</span>
              ) : (
                <span className="text-green-600">PG-13</span>
              )}{" "}
            </p>
            <p className="mt-4 text-md sm:text-lg">{content?.overview}</p>
          </div>
          <img
            src={imgSrc}
            alt="Poster image"
            className="sm:max-h-[530px] max-h-[300px] rounded-md"
          />
        </div>

{/* Trailer buttons */}
        {trailers.length > 0 && (
          <div className="flex justify-between items-center mt-8 mb-4">
            <button
              className={`
							bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerIdx === 0 ? "opacity-50 cursor-not-allowed " : ""
              }}
							`}
              disabled={currentTrailerIdx === 0}
              onClick={handlePrev}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className={`
							bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerIdx === trailers.length - 1
                  ? "opacity-50 cursor-not-allowed "
                  : ""
              }}
							`}
              disabled={currentTrailerIdx === trailers.length - 1}
              onClick={handleNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}


        

        {/* trailer video */}
        <div className="aspect-video sm:mb-6 mb-2 p-2 sm:px-4  ">
          {trailers.length > 0 && (
            <ReactPlayer
              controls={true}
              width={"100%"}
              height={"85%"}
              className="mx-auto overflow-hidden rounded-lg "
              url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`}
            />
          )}

          {trailers?.length === 0 && (
            <h2 className="text-xl text-center mt-5">
              No trailers available for{" "}
              <span className="font-bold text-red-600">
                {content?.title || content?.name}
              </span>{" "}
              😥
            </h2>
          )}
        </div>

        {/*Credits*/}
        <div className="mt-1 mx-auto relative max-w-6xl text-white">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">Casts</h3>
          <div
            className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group"
            ref={sliderRef2}
          >
            {credit.map((cast) => {
              if(cast.profile_path == null ) return null
              return (
                <Link key={cast.id} to={`/cast/${cast.id}`}>
                  <div className=" flex-none drop-shadow-[2px_2px_2px_rgba(255,255,255,0.4)] sm:w-48 w-32">
                    <div className="sm:w-48 w-32 sm:h-64 overflow-hidden rounded-md ">
                      <img
                        src={ORIGINAL_IMG_BASE_URL + cast.profile_path}
                        alt=""
                      />
                    </div>

                    <h1 className="mt-2 font-bold">{cast.name}</h1>
                    <p className="mt-1 text-sm sm:text-md text-white/80">{cast.character && `(as ${cast.character})`}</p>
                  </div>
                </Link>
              );
            })}
            <ChevronRight
              className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 hidden sm:block
										opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
										 bg-red-600 text-white rounded-full"
              onClick={scrollRight2}
            />
            <ChevronLeft
              className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0  hidden sm:block
								group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 
								text-white rounded-full"
              onClick={scrollLeft2}
            />
          </div>
        </div>

        {similarContent.length > 0 && (
          <div className="mt-12 max-w-6xl mx-auto relative">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Similar Movies / Tv Show
            </h3>

            <div
              className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group"
              ref={sliderRef}
            >
              {similarContent.map((content) => {
                if (content.poster_path === null) return null;
                return (
                  <Link
                    key={content.id}
                    to={`/watch/${type}/${content.id}`}
                    className="sm:w-48 w-32 drop-shadow-[2px_2px_2px_rgba(255,255,255,0.4)] flex-none"
                  >
                    <img
                      src={SMALL_IMG_BASE_URL + content.poster_path}
                      alt="Poster path"
                      className="w-full h-auto rounded-md"
                    />
                    <h4 className="mt-2 sm:text-lg text-md font-semibold">
                      {content.title || content.name}
                    </h4>
                  </Link>
                );
              })}

              <ChevronRight
                className="hidden sm:block absolute top-48 right-2 w-9 h-9
										opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
										 bg-red-600 text-white rounded-full"
                onClick={scrollRight}
              />
              <ChevronLeft
                className="hidden sm:block absolute top-48 left-2 w-9 h-9 opacity-0 
								group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 
								text-white rounded-full"
                onClick={scrollLeft}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  </>
  );
};
export default WatchPage;
