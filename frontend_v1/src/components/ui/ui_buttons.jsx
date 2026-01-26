import { Button } from "./button";
export const NormalButtons = ({onClick ,className}) => {
	return (
		<Button
			type="submit"
			className={` transition-all duration-75 ease-linear  hover:bg-green-500 px-8 text-lg hover:text-black py-2 rounded-md ${className}`}
      onClick={onClick}
		>
			Save
		</Button>
	);
};
