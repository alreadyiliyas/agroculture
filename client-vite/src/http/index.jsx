import axios from "axios";
import Cookies from "js-cookie";

const $host = axios.create({
    baseURL: 'http://localhost:8000'
})

const $authHost = axios.create({
    baseURL: 'http://localhost:8000'
})
const authInterceptor = config => {
    config.headers.authorization = `Bearer ${Cookies.get("access_token")}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost
}