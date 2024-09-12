import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isJwtExpired } from "jwt-check-expiration"; // Correct import
import "./styles.css";
import Password from "./Password";
import { useUser } from "./UserContext";
import { baseUrl } from "./constants";

export default function Login({ switchToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  // UseEffect to check JWT token expiration
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        if (isJwtExpired(token)) {
          setErrorMessage("Your session has expired. Please log in again.");
          setTimeout(() => {
            setErrorMessage("");
          }, 4000);
          navigate("/login"); // Navigate to login if token is expired
        }
      } catch (error) {
        console.error(
          "An error occurred while checking the token expiration:",
          error.message
        );
        setErrorMessage(
          "An error occurred while checking your session. Please log in again."
        );
        setTimeout(() => {
          setErrorMessage("");
        }, 4000);
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/auth/user/authenticate`,
        {
          email,
          password,
        }
      );

      const responseData = response.data.data;
      const userToken = responseData.token;
      const fullName = responseData.fullName; // Get fullName from response

      if (response.data.error) {
        setErrorMessage(response.data.message);
        setTimeout(() => {
          setErrorMessage("");
        }, 4000);
      } else {
        const userData = { email, fullName, token: userToken };
        setUser(userData);

        // Store user data in local storage
        localStorage.setItem("email", email);
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("token", userToken);

        navigate("/ameerchatbox");
      }
      /// nav bar
      // markdown
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }

      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    }

    setIsLoading(false);
  };

  // const handleOAuthSignUp = (provider) => {
  //   let authUrl = "";
  //   const redirectUri = encodeURIComponent(window.location.origin);

  //   if (provider === "github") {
  //     const clientId = "YOUR_GITHUB_CLIENT_ID";
  //     authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  //   } else if (provider === "gitlab") {
  //     const clientId = "YOUR_GITLAB_CLIENT_ID";
  //     authUrl = `https://gitlab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=read_user`;
  //   }

  //   window.location.href = authUrl;
  // };

  return (
    <div className="page">
      <div className="container">
        <h1 className="heading">Hi, Welcome Back!👋</h1>
        <p className="first--paragraph">
          Login to continue to ameerchatbot today!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form--container">
            <div className="input--container">
              <p className="labels">Email</p>
              <input
                className="input--box"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
          </div>

          <Password value={password} onChange={handlePasswordChange} required />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="check-box-container">
            <div className="remember-me">
              <input type="checkbox" checked readOnly />
              <label className="rem">Remember Me</label>
            </div>
            <p className="forgot-pass">Forgot Password</p>
          </div>

          <button className="btn" type="submit" disabled={isLoading}>
            {isLoading ? "loading .." : "Login"}
          </button>
        </form>

        <div className="horizontal-wrapper">
          <hr className="horizontal-line" />
          <p className="horizontal-para">Or With</p>
        </div>

        {/* <div className="flex">
          <div className="buttons">
            <button
              className="button"
              onClick={() => handleOAuthSignUp("github")}
            >
              <img
                className="social-images"
                src="./images/github.png"
                alt="GitHub"
              />
              <p>GitHub</p>
            </button>
            <button
              className="button"
              onClick={() => handleOAuthSignUp("gitlab")}
            >
              <img
                className="social-images"
                src="./images/Git-lab.png"
                alt="GitLab"
              />
              <p>GitLab</p>
            </button>
          </div>
        </div> */}

        <button
          className="have-an-account-login"
          onClick={() => navigate("/signup")}
        >
          <span className="have-an-account">Don't have an account yet?</span>
          <span className="login">Sign Up</span>
        </button>
      </div>
    </div>
  );
}
