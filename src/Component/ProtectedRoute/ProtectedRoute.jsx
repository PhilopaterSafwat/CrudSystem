import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    let token = JSON.parse(localStorage.getItem("Authentication"));
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get(`https://crud-system-app-api.vercel.app/user/profile/token`, {
                    headers: {
                        "Authorization": `${token}`,
                        "accept-language": "en"
                    }
                });
                setUserData(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!userData) {
        localStorage.removeItem("Authentication")
    }
    return userData ? children : <Navigate to="/login" />
}