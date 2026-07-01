import axios from "axios"
import { store } from "../../app/app.store"


const globalApi = axios.create({
    baseURL: "/api",
    withCredentials: true,
})



export default globalApi