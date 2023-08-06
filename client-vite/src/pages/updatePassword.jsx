import React, {useState} from 'react';
import './home.css'
import {
    FormControl,
    InputAdornment, InputLabel, OutlinedInput,
    TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";


const Login = () => {
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
    return (
        <div>
            <Container maxWidth="xs" sx={{mt: 20}}>
                <div>
                    <Typography component="h1" variant="h5">
                        Обновить пароль
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
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Номер телефона"
                        name="number"
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
                        Обновить пароль
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default Login;