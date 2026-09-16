import { useState } from "react";
import login from "../api/auth";
import "./login.css";
import { useNavigate } from "react-router";

type LoginButtonProps = {
  isLoading: boolean;
};

type LoginScreenProps = {
  setIsAuthenticated: (value: boolean) => void;
};

type EmailInputProps = {
  email: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => void;
};

type PasswordInputProps = {
  password: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => void;
};

function LoginScreen({ setIsAuthenticated }: LoginScreenProps) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      const session = await login(email, password);
      console.log(session);
      setIsAuthenticated(true);
      setLoading(false);

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
            <p>Please login to your account</p>
          </div>
          <div className="login-inputs-div">
            <EmailInput
              email={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <PasswordInput
              password={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <LoginButton isLoading={isLoading} />
          </div>
        </div>
      </form>
    </div>
  );
}

function EmailInput({ email, onChange }: EmailInputProps) {
  return (
    <div className="login-email-div">
      <input
        className="login-email-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={onChange}
      ></input>
    </div>
  );
}

function PasswordInput({ password, onChange }: PasswordInputProps) {
  return (
    <div className="login-password-div">
      <input
        className="login-password-input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={onChange}
      ></input>
    </div>
  );
}

function LoginButton({ isLoading }: LoginButtonProps) {
  return (
    <div className="button-div">
      <button className="login-btn">
        {isLoading ? "Logging In ..." : "Login"}
      </button>
    </div>
  );
}

export default LoginScreen;
