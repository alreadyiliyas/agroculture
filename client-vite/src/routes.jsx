import {
    ADMIN_ROUTE,
    BASKET_ROUTE,
    DRONE_ROUTE,
    HOME_ROUTE,
    LOGIN_ROUTE,
    REGISTER_ROUTE,
    UPDATEPASSWORD_ROUTE,
    USER_ROUTE
} from "./utils/const.jsx";
import admin from './pages/admin.jsx'
import basket from './pages/basket.jsx'
import Home from './pages/home.jsx'
import login from './pages/login.jsx'
import registration from './pages/registration.jsx'
import user from './pages/user.jsx'
import drone from './pages/drone.jsx'
import UpdatePassword from './pages/updatePassword.jsx'

export const publicRoutes = [
    {
      path: LOGIN_ROUTE,
      Component: login
    },
    {
        path: HOME_ROUTE,
        Component: Home
    },
    {
        path: UPDATEPASSWORD_ROUTE,
        Component: UpdatePassword
    },
    {
        path: REGISTER_ROUTE,
        Component: registration
    },
    {
        path: DRONE_ROUTE,
        Component: drone
    },
]

export const authRoutes = [
    {
        path: USER_ROUTE,
        Component: user
    },
    {
        path: ADMIN_ROUTE,
        Component: admin
    },
    {
        path: BASKET_ROUTE,
        Component: basket
    },
]