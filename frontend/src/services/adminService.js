import axios from "axios";

const API_URL = "http://localhost:3000/api/admin";

class AdminService {
    login(username, password) {
        return axios.post(`${API_URL}/login`, { username, password });
    }
}

export default new AdminService();