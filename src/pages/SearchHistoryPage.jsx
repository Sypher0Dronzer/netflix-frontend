import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function formatDate(dateString) {
  // Create a Date object from the input date string
  const date = new Date(dateString);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract the month, day, and year from the Date object
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  // Return the formatted date string
  return `${month} ${day}, ${year}`;
}

const SearchHistoryPage = () => {
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const getSearchHistory = async () => {
      try {
        const res = await axios.get(`https://netflix-backend-6kdl.onrender.com/api/v1/search/history`,{
          withCredentials: true,});
        setSearchHistory(res.data.content);
      } catch (error) {
        console.log(error)
        setSearchHistory([]);
      }
    };
    getSearchHistory();
  }, []);

  const handleDelete = async (entry) => {
    try {
      await axios.delete(`https://netflix-backend-6kdl.onrender.com/api/v1/search/history/${entry.id}`,{
        withCredentials: true,});
      setSearchHistory(searchHistory.filter((item) => item.id !== entry.id));
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete search item");
    }
  };

  if (searchHistory?.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Search History</h1>
          <div className="flex justify-center items-center h-96">
            <p className="text-xl">No search history found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Search History</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
          {searchHistory?.map((entry) => (
            <div
              key={entry.id + entry.createdAt}
              className="bg-gray-800 p-4 rounded grid grid-cols-[0.3fr_1fr_0.3fr] gap-x-2"
            >
                <Link to={entry.searchType === 'person'?`/cast/${entry.id}`: entry.searchType ==='movie'?`/watch/movie/${entry.id}`:`/watch/tv/${entry.id}`} className="rounded-full size-16 overflow-hidden mr-2">
              <img
                src={SMALL_IMG_BASE_URL + entry.image}
                alt="History image"
                className=" object-cover  "
              />
                </Link>
              <div className="flex flex-col">
                <Link to={entry.searchType === 'person'?`/cast/${entry.id}`: entry.searchType ==='movie'?`/watch/movie/${entry.id}`:`/watch/tv/${entry.id.slice}`}>
                <span className="text-white sm:text-lg ">
                {entry.title.length > 15? entry.title.slice(0,15)+'...' :entry.title}
                </span>
                </Link>
                <span className="text-gray-400 text-sm">
                  {formatDate(entry.createdAt)}
                </span>
              </div>

              <div className="flex-col-reverse flex justify-between items-end h-full ">
                <span
                  className={`py-1 px-3 min-w-20 text-center rounded-full text-sm  ml-auto ${
                    entry.searchType === "movie"
                      ? "bg-red-600"
                      : entry.searchType === "tv"
                      ? "bg-blue-600"
                      : "bg-green-600"
                  }`}
                >
                  {entry.searchType[0].toUpperCase() +
                    entry.searchType.slice(1)}
                </span>
                <Trash
                  className="size-5 ml-4 cursor-pointer hover:fill-red-600 hover:text-red-600"
                  onClick={() => handleDelete(entry)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SearchHistoryPage;
