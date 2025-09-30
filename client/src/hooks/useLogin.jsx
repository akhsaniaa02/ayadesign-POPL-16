import { message } from "antd";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { baseURL } from "../api/private.client";

const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginUser = async (values) => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(baseURL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.status === 200) {
        message.success(data.message);
        login(data.token, data.user);
      } else if (res.status === 404 || res.status === 401 || data.status === "fail") {
        setError(data.message);
      } else {
        message.error("Login Failed");
      }
    } catch (error) {
      message.error("Login Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, loginUser };
};

export default useLogin;
