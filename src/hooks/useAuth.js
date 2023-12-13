import { useAuthState } from "../contexts/AuthProvider";

/**
 * @description returns auth state, if no user then returns null
 * @returns {{ password, username, name, _id } || null}
 */
const useAuth = () => {
	const { user } = useAuthState();

	return user;
};

export default useAuth;
