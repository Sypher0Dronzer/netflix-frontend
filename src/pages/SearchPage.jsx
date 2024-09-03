import { useState } from "react";
import { useContentStore } from "../store/content";
import Navbar from "./components/Navbar";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const SearchPage = () => {
	const [activeTab, setActiveTab] = useState("movie");
	const [searchTerm, setSearchTerm] = useState("");

	const [results, setResults] = useState([]);
	const { setContentType } = useContentStore();

	const handleTabClick = (tab) => {
		setActiveTab(tab);
		tab === "movie" ? setContentType("movie") : setContentType("tv");
		setResults([]);
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.get(`/api/v1/search/${activeTab}/${searchTerm}`);
			setResults(res.data.content);
		} catch (error) {
			if (error.response.status === 404) {
				toast.error("Nothing found, make sure you are searching under the right category");
			} else {
				toast.error("An error occurred, please try again later");
			}
		}
	};

	return (<>
	
	<Helmet>
      <title>Search</title>
      <meta property="og:title" content='Search' />
      <meta property="og:description" content="Search for  movies, TV shows, and cast details in our Netflix clone." />      
      <meta property="og:image" content="https://ibb.co/r0Z8q6c"/>
      <meta property="og:url" content={`https://netflix-clone-7ldf.onrender.com/search`} />
      <meta property="og:type" content="website" />
    </Helmet>
		<div className='bg-black min-h-screen text-white'>
			<Navbar />
			<div className='container mx-auto px-4 py-8'>
				<div className='flex justify-center gap-3 mb-4'>
					<button
						className={`py-2 px-4 rounded ${
							activeTab === "movie" ? "bg-red-600" : "bg-gray-800"
						} hover:bg-red-700`}
						onClick={() => handleTabClick("movie")}
					>
						Movies
					</button>
					<button
						className={`py-2 px-4 rounded ${
							activeTab === "tv" ? "bg-red-600" : "bg-gray-800"
						} hover:bg-red-700`}
						onClick={() => handleTabClick("tv")}
					>
						TV Shows
					</button>
					<button
						className={`py-2 px-4 rounded ${
							activeTab === "person" ? "bg-red-600" : "bg-gray-800"
						} hover:bg-red-700`}
						onClick={() => handleTabClick("person")}
					>
						Person
					</button>
				</div>

				<form className='flex gap-2 items-stretch mb-8 max-w-2xl mx-auto' onSubmit={handleSearch}>
					<input
						type='text'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder={"Search for a " + activeTab}
						className='w-full p-2 rounded bg-gray-800 text-white'
					/>
					<button className='bg-red-600 hover:bg-red-700 text-white p-2 rounded'>
						<Search className='size-6' />
					</button>
				</form>

				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
					{results.map((result) => {
						if (!result.poster_path && !result.profile_path) return null;

						return (
							<div key={result.id} className=' pb-4  border-white/20 border rounded-md'>
								{activeTab === "person" ? (
									<Link className='flex flex-col items-center' to={"/cast/"+ result.id}>
										<img
											src={ORIGINAL_IMG_BASE_URL + result.profile_path}
											alt={result.name}
											className='max-h-96 rounded mx-auto'
										/>
										<h2 className='mt-2 text-md sm:text-lg font-semibold px-1'>{result.name}</h2>
									</Link>
								) : (
									<Link
                                    to={`/watch/${activeTab}/${result.id}`}
										onClick={() => {
											setContentType(activeTab);
										}}
									>
										<img
											src={ORIGINAL_IMG_BASE_URL + result.poster_path}
											alt={result.title || result.name}
											className='w-full h-auto rounded'
										/>
										<h2 className='mt-2 text-md sm:text-lg font-semibold px-1'>{result.title || result.name}</h2>
									</Link>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	</>
	);
};
export default SearchPage;