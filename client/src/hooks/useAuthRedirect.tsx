import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((c) => c.startsWith("token="));
    const token = tokenCookie ? tokenCookie.split("=")[1] : null;

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
}