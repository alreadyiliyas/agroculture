import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes, authRoutes } from '../routes.jsx';
import { HOME_ROUTE } from '../utils/const.jsx';

const AppRouter = () => {
    const isAuth = useSelector((state) => state.isAuth);

    return (
        <Routes>
            {isAuth && authRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            <Route path="/" element={<Navigate to={HOME_ROUTE} replace />} />
        </Routes>
    );
};

export default AppRouter;
