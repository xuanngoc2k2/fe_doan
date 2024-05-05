import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hook";

const ProtectedRouteUser = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    return isAuthenticated ? (
        <>
            {children}
        </>
    ) : (
        // <Navigate to={`/login?prevLocation=${encodeURIComponent(prevLocation || '')}`} replace />
        <Navigate to='/login' replace />
    );
}

export default ProtectedRouteUser;
