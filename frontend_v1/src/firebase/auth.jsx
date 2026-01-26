import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithPopup,
	updatePassword,
} from "firebase/auth";
import { auth } from "./firebase";

export const doCreateUserWithEmailPassword = async (email, password) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		const idToken = await user.getIdToken(); // 🔑 Fix is here
		return idToken;
	} catch (error) {
		console.error("Sign up Error:", error.code, error.message);
		throw new Error(error.message);
	}
};


export const doSignInWithEmailPassword = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		const idToken = await user.getIdToken(); // 🔑 Fix is here
		return idToken;
	} catch (error) {
		console.error("Sign in error:", error.code, error.message);
		throw new Error(error.message);
	}
};

export const doSignInWithGoogle = async () => {
	try {
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		const user = result.user;
		const idToken = await user.getIdToken(); // 🔑 Fix is here
		return idToken;
	} catch (error) {
		console.error("Google sign-in error:", error.code, error.message);
		throw new Error(error.message);
	}
};


export const doSignOut = () => {
	return auth.signOut();
};

// export const doPasswordReset = (event,email) => {
//   event.preventDefault()
//   return sendPasswordResetEmail(auth,email)
// }

export const doPasswordChange = (password) => {
	return updatePassword(auth.currentUser, password);
};
