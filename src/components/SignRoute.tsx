import { useCookies } from 'react-cookie';
import { Navigate, Outlet } from 'react-router-dom';
import { UserResponse } from '@/model/UserModel';

import { jwtDecode } from 'jwt-decode';

export default function SignRoute() {
    const [cookies] = useCookies(['auth']);

    const token = cookies.auth;

    if (!token) {
        return <Outlet />;
    }

    try {
        const user: UserResponse = jwtDecode(token);
        return user.role ? <Navigate to="/" /> : <Outlet />;
    } catch (error) {
        console.log(error);
        return <Outlet />;
    }
}
