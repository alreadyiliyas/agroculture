import React from 'react';
import './home.css'
import Box from '@mui/material/Box';
import {createTheme, Grid, ThemeProvider} from "@mui/material";
import Typography from "@mui/material/Typography";
import home__background from "../assets/home__background.jpg";

const theme = createTheme({
    typography: {
        fontFamily: [
            'Montserrat', // название вашего шрифта
            'sans-serif',
        ].join(','),
    },
});

const Home = () => {
    return (
        <div className="home">
            <ThemeProvider theme={theme}>
                <Grid container spacing={2} mt={1}>
                    {/* При ширине экрана больше xs */}
                    <Grid item xs={12} md={6.5} ml={2}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Grid sx={{p: 2}}>
                                <img src={home__background} style={{borderRadius: 10, maxWidth: '100%'}}/>
                            </Grid>
                        </Box>
                    </Grid>
                    {/* При ширине экрана меньше xs */}
                    <Grid item xs={12} md={5}>
                        <Box sx={{p: 2}}>
                            <Typography variant="h4" sx={{pb: 1}} fontWeight={"bold"} align={"center"} mb={2}>
                                Агрокультура
                            </Typography>
                            <Typography variant="body1" sx={{pb: 2}}>
                                Дроны для агрокультуры становятся все более популярными среди фермеров, потому что они
                                предлагают решения для многих проблем, с которыми сталкиваются сельскохозяйственные
                                предприятия. Наши дроны оборудованы передовыми технологиями, которые позволяют точно и
                                быстро собирать данные о состоянии посевов, оценивать уровень урожайности и определять
                                зоны, где нужны дополнительные удобрения или инсектициды.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </div>
    );
};

export default Home;