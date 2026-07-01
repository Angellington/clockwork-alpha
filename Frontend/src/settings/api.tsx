import axios from "axios";
import { BASE_URL_BACKEND } from "./config";

const instance = axios.create({
    baseURL: `${BASE_URL_BACKEND}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    }
})

export default instance;