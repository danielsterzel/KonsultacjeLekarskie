import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await login(email, password);
      navigate("/");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h3>Login</h3>
      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={submit}>Login</button>
    </div>
  );
};
