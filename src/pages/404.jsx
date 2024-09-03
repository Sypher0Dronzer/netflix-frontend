import { Link } from "react-router-dom";

const NotFoundPage = () => {
	return (
		<>
		
			<header className=' p-4 bg-black w-full '>
				<Link to={"/"}>
					<img src='/netflix-logo.png' alt='Netflix' className='h-8' />
				</Link>
			</header>
		<div
			className='min-h-screen px-2 bg-cover bg-center flex flex-col justify-center items-center text-white'
			style={{ backgroundImage: `url('/404.png')` }}
		>
			<main className='text-center error-page--content z-10'>
				<h1 className='md:text-7xl text-4xl sm:text-6xl font-semibold mb-4'>Lost your way?</h1>
				<p className='mb-6 sm:text-xl text-lg'>
					Sorry, we can't find that page. You'll find lots to explore on the home page.
				</p>
				<Link to={"/"} className='bg-red-700 text-white font-semibold py-2 px-4 rounded hover:text-black hover:bg-white transition-all duration-300'>
					Netflix Home
				</Link>
			</main>
		</div>
		</>
	);
};
export default NotFoundPage;