import axios from "axios";
import server from "../environment.js";

export const authApi = axios.create({
    baseURL: `${server}/api/users`, 
    withCredentials: true, 
    headers: {
        "Content-Type": "application/json",
    },
})