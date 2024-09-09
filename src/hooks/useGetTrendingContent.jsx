import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";

const useGetTrendingContent = () => {
  const { contentType } = useContentStore();
  const [ trendingContent, setTrendingContent ] = useState(null);

  useEffect(() => {
    const getTrendingContent = async () => {
      const res = await axios.get(`https://netflix-backend-6kdl.onrender.com/api/v1/${contentType}/trending`, {
        withCredentials: true, // Add this to include cookies or authentication credentials
      });
      setTrendingContent(res.data.content);
    };
    getTrendingContent();
  }, [contentType]);

  return {trendingContent};
};

export default useGetTrendingContent;
