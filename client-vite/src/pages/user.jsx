import React, {useState} from "react"
import {useSelector} from "react-redux";
import {Button, Container, Input, Modal, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {updateUserInfo} from "../http/userApi.jsx";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const User = () => {
    const user = useSelector((state) => state.user)
    console.log(user)

    const [open, setOpen] = React.useState(false);
    const [photo, setPhoto] = useState(null)
    const [name, setName] = useState(user.name)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleInputChange = (event) => {
        setName(event.target.value);
    };
    const UpdateInfoUser = async () => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("photo", photo);
            await updateUserInfo(formData)
        } catch (e) {
            alert("Повторите попытку!")
        }
    }

    return (
        <div>
            <Container sx={{mt: 12}}>
                <Box
                    borderRadius={4}
                    boxShadow={2}
                    p={3}
                    width={240}
                    alignItems={"center"}
                    fontFamily={'Arial'}
                    color={'#02420c'}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px'}}>
                    <img src={'http://localhost:8000/images/' + user.photo} width="100" height="100" style={{borderRadius: 50}}/>
                    </div>

                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <Button onClick={handleOpen} variant="contained" color="success" style={{width: "100%"}}>
                        Обновить данные
                    </Button>
                </Box>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Обновить: ФИО
                        </Typography>
                        <Input
                            variant="outlined"
                            margin="normal"
                            style={{margin: '10px'}}
                            required
                            fullWidth
                            autoComplete="email"
                            autoFocus
                            color='success'
                            onChange={handleInputChange}
                            value={name}
                        />
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Обновить: Фотографию
                        </Typography>
                        <Input sx={{mt: 1, mb: 4, mr: 5}} type="file"
                               onChange={event => setPhoto(event.target.files[0])}/>
                        <Button variant="outlined" color="error" sx={{mr: 2}} onClick={handleClose}>Выйти</Button>
                        <Button variant="contained" color="success" onClick={() => {
                            UpdateInfoUser();
                            handleClose();
                        }}>Сохранить</Button>
                    </Box>
                </Modal>

            </Container>
        </div>
    );
};

export default User;