import React from 'react';

const onSuccess = (googleUser) => {
    console.log('Login Success:', googleUser);
};
const onFailure = (error) => {
    console.log('Login Failure:', error);
};

const GoogleLoginButton = () => {
    const handleLogin = () => {
        if (typeof gapi !== 'undefined') {
            gapi.auth2.getAuthInstance().signIn().then(onSuccess, onFailure);
        }
    };

    React.useEffect(() => {
        if (typeof gapi !== 'undefined') {
            gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: '456865351472-l3haji65v3vs1rnonn6qpgk2uu2qlm0j.apps.googleusercontent.com',
                    scope: 'https://www.googleapis.com/auth/userinfo.profile',
                    ux_mode: 'redirect',
                    redirect_uri: "http://127.0.0.1:5173/callback",
                });
            });
        }
    }, []);

    return (
        <button onClick={handleLogin}>Login with Google</button>
    );
};

export default GoogleLoginButton;