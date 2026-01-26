const Spinner = ({ className ="" }) => {
	return (
			<div className="flex items-center justify-center space-y-2">
				<div className={`w-6 h-6 border-4 mr-4 mt-2 border-beige-100 border-t-transparent rounded-full animate-spin ${className}`}></div>
				<p className="text-xl text-beige-100 ">Loading …</p>
			</div>
	);
};

export default Spinner;
