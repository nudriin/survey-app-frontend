import { jwtDecode } from 'jwt-decode';
import { useCookies } from 'react-cookie';
import { Navigate, Outlet } from 'react-router-dom';
import { UserResponse } from '@/model/UserModel';

export default function PrivateRoute() {
    const [cookies] = useCookies(['auth']);

    const token = cookies.auth;

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const user: UserResponse = jwtDecode(token);
        return user.role ? <Outlet /> : <Navigate to="/login" />;
    } catch (error) {
        console.log(error);
        return <Navigate to="/login" />;
    }
}
