import NavBar from "./components/NavBar.jsx";
import {BrowserRouter} from "react-router-dom";
import './App.css'
import AppRouter from "./components/AppRouter.jsx";
import {useEffect} from "react";
import {check} from "./http/userApi.jsx";
import {useDispatch} from "react-redux";
import {setIsAuth, setUser, setUserRole} from "./Redux/actions.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

const clientId = '1011928461588-gpujmf0ql9g0rg1jqslml3oiskjgdn88.apps.googleusercontent.com'

function App() {
    const dispatch = useDispatch()
    useEffect(() => {
        check().then(data => {
            if (data) {
                dispatch(setIsAuth(true))
                dispatch(setUserRole(data.data.user))
                dispatch(setUser(data.data.user))
            }
        })
    }, [])

    useEffect(() => {
        window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
                clientId: clientId,
                scope: 'profile email',
            }).then(() => {
                const authInstance = window.gapi.auth2.getAuthInstance();
                if (authInstance.isSignedIn.get()) {
                    const user = authInstance.currentUser.get();
                    const idToken = user.getAuthResponse().id_token;
                    console.log(user, " ", idToken)
                }
            });
        });
    }, []);

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <BrowserRouter>
                <NavBar/>
                <AppRouter/>
            </BrowserRouter>
        </GoogleOAuthProvider>
    )
}

export default App
