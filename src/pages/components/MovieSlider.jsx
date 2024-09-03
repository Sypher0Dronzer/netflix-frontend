import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../../utils/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MovieSlider = ({ category }) => {
  const { contentType } = useContentStore();
  const [content, setContent] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const [imgSrc, setImgSrc] = useState('');

  //this is for mobile screens to have poster rather than backdrop image
 

  const sliderRef = useRef(null);

  const formattedCategoryName =
    category.replaceAll("_", " ")[0].toUpperCase() +
    category.replaceAll("_", " ").slice(1);
  const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

  useEffect(() => {
    const getContent = async () => {
      const res = await axios.get(`/api/v1/${contentType}/${category}`);
      setContent(res.data.content);
    };

    getContent();
  }, [contentType, category]);

// to change between poster and backdrop image for different screens
  useEffect(() => {
    const updateImageSrc = () => {
      if (window.innerWidth < 640) { // Tailwind's 'sm' breakpoint is 640px
        setImgSrc('poster_path');
      } else {
        setImgSrc('backdrop_path');
      }
    };

    updateImageSrc(); // Set the initial image
    window.addEventListener('resize', updateImageSrc); // Update image on window resize

    return () => window.removeEventListener('resize', updateImageSrc); // Cleanup listener on unmount
  }, [content]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };
  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="bg-black text-white relative px-5 md:px-20"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className="mb-4 text-2xl font-bold">
        {formattedCategoryName} {formattedContentType}
      </h2>

      <div
        className="flex space-x-4 overflow-x-scroll scrollbar-hide"
        ref={sliderRef}
      >
        {content.map((item) => (
          <Link
            to={`/watch/${contentType}/${item.id}`}
            className="sm:min-w-[250px] min-w-32 drop-shadow-[2px_2px_2px_rgba(255,255,255,0.4)] relative group"
            key={item.id}
          >
            <div className="rounded-lg overflow-hidden">
              <img
                src={SMALL_IMG_BASE_URL + item[imgSrc]}
                alt="Movie image"
                className="transition-transform duration-300 ease-in-out group-hover:scale-125"
              />
            </div>
            <p className="mt-2 sm:text-lg text-md text-center">{item.title || item.name}</p>
          </Link>
        ))}
      </div>

      {showArrows && (
        <>
          <button
            className="absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            "
            onClick={scrollLeft}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            className="absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            "
            onClick={scrollRight}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};
export default MovieSlider;
