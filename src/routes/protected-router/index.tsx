import { Navigate } from "react-router-dom";
import NotPermitted from "./not-permitted";
import Loading from "./loading";
import { useAppSelector } from "../../redux/hook";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RoleBaseRoute = (props: any) => {
    const user = useAppSelector(state => state.account.user);
    const userRole = user.role;

    if (userRole == 'ADMIN') {
        return (<>{props.children}</>)
    } else {
        return (<NotPermitted />)
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProtectedRoute = (props: any) => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated)
    const isLoading = useAppSelector(state => state.account.isLoading)

    return (
        <>
            {isLoading === true ?
                <Loading />
                :
                <>
                    {isAuthenticated === true ?
                        <>
                            <RoleBaseRoute>
                                {props.children}
                            </RoleBaseRoute>
                        </>
                        :
                        <Navigate to='/login' replace />
                    }
                </>
            }
        </>
    )
}

export default ProtectedRoute;