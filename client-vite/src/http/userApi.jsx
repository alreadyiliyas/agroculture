import {$authHost, $host} from "./index";
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'


export const registration = async (email, password) => {
    const {data} = await $host.post('/api/auth/register', {email, password, role: 'USER'})
    Cookies.set("token", data.token, {secure: false, httpOnly: false});
    return jwt_decode(data.token)
}
export const login = async (email, password) => {
    const {data} = await $host.post('/api/auth/login', {email, password})
    Cookies.set("logged_in", 'true')
    Cookies.set("access_token", data.access_token, {secure: false, httpOnly: false})
    return jwt_decode(data.access_token)
}

export const check = async () => {
    const logged_in = Cookies.get("logged_in")
    if (logged_in){
        const {data} = await $authHost.get('/api/users/me')
        console.log(data)
        return data
    } else {
        return null
    }
}

export const updateUserInfo = async (formData) => {
    const {data} = await $authHost.post('/api/users/me', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    console.log("Axios: ", data)
    return data
}