const Footer = () => {
	return (
		<footer className='py-4 md:px-8 md:py-0 bg-black text-white border-t border-gray-800'>
			<div className='md:py-8'>
				<p className='text-center  text-sm '>
					A creation of {" "}
					<a
						href='https://github.com/Sypher0Dronzer'
						target='_blank'
						className='font-medium hover:underline underline-offset-4 hover:text-red-500'
					>
						Sypher Dronzer
					</a>
					{" "}😎
					. 
				</p>
                
			</div>
		</footer>
	);
};
export default Footer;