import React, {useState} from 'react';
import './home.css'
import {
    Checkbox, FormControl,
    FormControlLabel, Grid, InputAdornment, InputLabel,
    Link, OutlinedInput,
    TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {REGISTER_ROUTE, UPDATEPASSWORD_ROUTE, USER_ROUTE} from "../utils/const.jsx";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {login} from "../http/userApi.jsx";
import {useDispatch} from "react-redux";
import {setIsAuth} from "../Redux/actions.jsx";


const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const entrance = async () => {
        try {
            await login(email, password)
            dispatch(setIsAuth(true))
            navigate(USER_ROUTE)
        } catch (e) {
            alert("Повторите вход!")
        }
    }

    return (
        <div>
            <Container maxWidth="xs" sx={{mt: 20}}>
                <div>
                    <Typography component="h1" variant="h5">
                        Войти
                    </Typography>

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
                        onChange={event => setEmail(event.target.value)}
                    />
                    <FormControl sx={{ width: '100%', mt: 2}} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password" color='success'>Пароль</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            color='success'
                            onChange={event => setPassword(event.target.value)}
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
                        />
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox value="remember" color='success'/>}
                        label="Запомнить меня"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="success"
                        sx={{backgroundColor: '#A4BE7B'}}
                        onClick={() => entrance()}
                    >
                        Войти
                    </Button>
                    <Grid container sx={{mt: 1}}>
                        <Grid item xs>
                            <Link variant="body2" sx={{color: '#285430'}} onClick={()=> navigate(UPDATEPASSWORD_ROUTE)}>
                                Забыли пароль?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link variant="body2" sx={{color: '#285430'}} onClick={()=> navigate(REGISTER_ROUTE)}>
                                {"Нет аккаунта? Зарегистрируйтесь"}
                            </Link>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>

    );
};

export default Login;