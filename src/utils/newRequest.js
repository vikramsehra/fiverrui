import axios from "axios";

const newRequest = axios.create({
    baseURL: "https://fiverrapi.onrender.com/api/",
    withCredentials: true,
});

export default newRequest;