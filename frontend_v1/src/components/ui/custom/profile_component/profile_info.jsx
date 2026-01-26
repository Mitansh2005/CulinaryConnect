import { Link } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { auth } from "@/firebase/firebase";
import { getSafeUserData } from "@/utils/localStorage";
export function ProfileInfo() {
	const savedUserdata = getSafeUserData();

	const phoneNumber = savedUserdata?.phone_number;
	const location = savedUserdata?.location;
	const user = auth.currentUser;
	let userEmail = "";
	if (user) {
		userEmail = user.email;
	} else {
		console.error("No user with this email was found.");
	}
	return (
		<>
			<div className="flex items-center w-5/12 justify-between">
				<div className="flex flex-col">
					<p>{userEmail ? userEmail : "user email"}</p>
					<p>{phoneNumber ? phoneNumber : "user phonenumber"}</p>
					<p>
						{location?.country || "user country"}
						{location?.state ? ", " + location.state : ""}
						{location?.city ? ", " + location.city : ""}
					</p>
				</div>
				<Link to="/contact_form">
					<div className="hover:cursor-pointer">
						<MdOutlineArrowForwardIos className="hover:text-custom_color1" />
					</div>
				</Link>
			</div>
		</>
	);
}
