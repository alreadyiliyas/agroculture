import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {USER_ROUTE} from "../utils/const.jsx";

const GoogleCallback = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const code = new URLSearchParams(window.location.search).get('code');
                const response = await axios.get(`http://localhost:8000/api/google/callback?code=${code}`);
                document.cookie = `access_token=${response.data.token}`;
                navigate(USER_ROUTE)
            } catch (error) {
                setErrorMessage('Произошла ошибка при авторизации с помощью Google.');
            }
        };
        handleCallback();
    }, [navigate]);

    return (
        <div>
            {errorMessage && <div className="error">{errorMessage}</div>}
            <p>Авторизация с помощью Google...</p>
        </div>
    );
};

export default GoogleCallback;
