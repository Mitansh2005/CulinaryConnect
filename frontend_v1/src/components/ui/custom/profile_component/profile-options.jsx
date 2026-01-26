import { MdOutlineArrowForwardIos } from "react-icons/md";
export function ProfileOptions({ heading, subheading , onClickEvent }) {
	return (
		<>
			<div className="flex flex-row w-full items-center justify-between m-4 border-t-2 border-b-2 p-7 hover:bg-gray-50 hover:cursor-pointer " onClick={onClickEvent}>
				<div>
					<h2 className="font-bold text-xl">{heading}</h2>
					<p className="text-sm mt-2 text-gray-500">{subheading}</p>
				</div>
				<div>
					<MdOutlineArrowForwardIos/>
				</div>
			</div>
		</>
	);
}
