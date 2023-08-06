import React, {useState} from 'react';
import './home.css'
import {
    FormControl, Grid, InputAdornment, InputLabel,
    Link, OutlinedInput,
    TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import {LOGIN_ROUTE, UPDATEPASSWORD_ROUTE} from "../utils/const.jsx";
import {useNavigate} from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {GoogleLogin} from "@react-oauth/google";
import {GoogleLogout} from "react-google-login";


const Registration = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordsMatch(event.target.value === confirmPassword);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        setPasswordsMatch(event.target.value === password);
    };

    const onSuccess = (res) => {
        console.log("LOGIN success: ", res.profileObj)
    }

    const onFailure = (res) => {
        console.log("Login failed", res)
    }

    const onSuccessLogOut = () => {
        console.log("Log out success")
    }

    return (
        <div>
            <Container maxWidth="xs" sx={{mt: 20}}>
                <div>
                    <Typography component="h1" variant="h5">
                        Регистрация
                    </Typography>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Username"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        color='success'
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email адрес"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        color='success'
                    />
                    <FormControl sx={{ width: '100%', mt: 2}} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password" color='success'>Пароль</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            color='success'
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Пароль"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </FormControl>
                    <FormControl sx={{ width: '100%', mt: 2}} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password" color='success'>Подтвердить пароль</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            color='success'
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Подтвердить пароль"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                    </FormControl>
                    {passwordsMatch ? null : <Typography color="error">Пароли не совпадают</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="success"
                        sx={{backgroundColor: '#A4BE7B', mt: 2}}
                    >
                        Зарегистрироваться
                    </Button>
                    <Grid container sx={{mt: 1}}>
                        <Grid item xs>
                            <Link variant="body2" sx={{color: '#285430'}} onClick={()=> navigate(UPDATEPASSWORD_ROUTE)}>
                                Забыли пароль?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link variant="body2" sx={{color: '#285430'}} onClick={()=> navigate(LOGIN_ROUTE)}>
                                {"Есть аккаунт? Войти"}
                            </Link>
                        </Grid>
                    </Grid>
                    <GoogleLogin
                    clientId={'1011928461588-gpujmf0ql9g0rg1jqslml3oiskjgdn88.apps.googleusercontent.com'}
                    buttonText="Login"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true }
                    />
                    <GoogleLogout
                        clientId={'1011928461588-gpujmf0ql9g0rg1jqslml3oiskjgdn88.apps.googleusercontent.com'}
                        buttonText={"Log out"}
                        onLogoutSuccess={onSuccessLogOut}
                    />
                </div>
            </Container>
        </div>

    );
};

export default Registration;