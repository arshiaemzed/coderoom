import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

type LoginButtonProps = {
  isLoading: boolean;
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

function LoginScreen() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isLoading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);

      await login(email, password);

      navigate("/rooms");
    } catch (error) {
      console.log(`error catched: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <form onSubmit={handleSubmit}>
        <div className="login-div">
          <div>
            <p className="signin-text-p">Sign into your account</p>
          </div>

          <div className="email-and-pass-div">
            <EmailInput
              email={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <PasswordInput
              password={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <LoginButton isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
}

function EmailInput({ email, onChange }: EmailInputProps) {
  return (
    <div className="email-field">
      <label className="email-label" htmlFor="email">
        Email
      </label>
      <input
        className="input"
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={onChange}
      ></input>
    </div>
  );
}

function PasswordInput({ password, onChange }: PasswordInputProps) {
  return (
    <div>
      <label className="password-field" htmlFor="password">
        Password
      </label>
      <input
        className="input"
        placeholder="Enter your password"
        type="password"
        value={password}
        onChange={onChange}
      ></input>
    </div>
  );
}

function LoginButton({ isLoading }: LoginButtonProps) {
  return (
    <div className="login-btn-div">
      <button className="login-btn">
        {isLoading ? "Logging In ..." : "Login"}
      </button>
    </div>
  );
}

export default LoginScreen;
