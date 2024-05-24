import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../../redux/hook";
import Loading from "./loading";

const ProtectedRouteUser = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const isLoading = useAppSelector(state => state.account.isLoading)
    // useEffect(() => {
    //     console.log(isAuthenticated)
    // }, [isAuthenticated])
    useEffect(() => {
    }, [isAuthenticated]);

    // Nếu isLoading là true, hiển thị một thông báo tải
    if (isLoading) {
        return <Loading />;
    }

    // Nếu đang xác thực, cho phép truy cập vào children
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // Nếu chưa xác thực, điều hướng đến trang đăng nhập
    return <Navigate to='/login' replace />;
}

export default ProtectedRouteUser;
