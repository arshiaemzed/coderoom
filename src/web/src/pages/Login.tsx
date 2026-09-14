import { useState } from "react";
import login from "../api/auth";
import "./login.css";
import { useNavigate } from "react-router";

function LoginScreen() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const session = await login(email, password);
      console.log(session);

      navigate("/rooms");
    } catch (error) {
      console.log(`error catched: ${error}`);
    }
  }

  return (
    <div className="login-screen">
      <form className="login" onSubmit={handleSubmit}>
        <div>
          <div className="login-text-div">
            <p>Login</p>
          </div>
          <div className="login-email-div">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            ></input>
          </div>

          <div className="login-password-div">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            ></input>
          </div>

          <div className="button-div">
            <button>Login</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginScreen;
