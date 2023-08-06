import React, { useState } from 'react';
import axios from 'axios';

const GoogleLogin = () => {
    const [errorMessage, setErrorMessage] = useState(null);

    const handleGoogleLogin = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/auth/google/login');
            window.open(response.data, '_blank');
        } catch (error) {
            setErrorMessage('Произошла ошибка при попытке авторизации с помощью Google.');
        }
    };

    return (
        <div>
            <h2>Авторизация с помощью Google</h2>
            {errorMessage && <div className="error">{errorMessage}</div>}
            <button onClick={handleGoogleLogin}>Авторизоваться с помощью Google</button>
        </div>
    );
};

export default GoogleLogin;
