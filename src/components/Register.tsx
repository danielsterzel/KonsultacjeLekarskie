import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await register(email, password);
      navigate("/");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="email" onChange={e => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={submit}>Register</button>
    </div>
  );
};

export default Register;
