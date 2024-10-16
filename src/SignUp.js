import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";
import Password from "./Password";
import PopupMessage from "./PopupMessage";
import CapitalizeName from "./CapitalizeName";
import { useUser } from "./UserContext";
import { baseUrl } from "./constants";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorFullName, setErrorFullName] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleFullNameChange = (e) =>
    setFullName(CapitalizeName(e.target.value));
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorEmail("Please enter a valid email.");
      valid = false;
    } else {
      setErrorEmail("");
    }

    if (!fullName) {
      setErrorFullName("Please enter your full name.");
      valid = false;
    } else {
      setErrorFullName("");
    }

    if (!password || password.length < 6) {
      setErrorPassword("Password must be at least 6 characters.");
      valid = false;
    } else {
      setErrorPassword("");
    }

    if (!valid) {
      setTimeout(() => {
        setErrorEmail("");
        setErrorFullName("");
        setErrorPassword("");
      }, 4000);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/auth/user/register`,
        {
          full_name: fullName,
          email,
          password,
        }
      );

      const responseData = response.data.data;
      const userToken = responseData.token;

      if (response.data.error) {
        setApiError(response.data.message);
        setTimeout(() => {
          setApiError("");
        }, 4000);
      } else {
        setShowPopup(true);
        const userData = { email, fullName, userToken };
        setUser(userData);

        // Save only necessary details in local storage
        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
            fullName,
          })
        );
        localStorage.setItem("token", userToken);

        setTimeout(() => {
          setShowPopup(false);
          navigate("/ameerchatbox"); // Redirect to ameerchatbox
        }, 2000);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setApiError(error.response.data.message);
      } else {
        setApiError("An error occurred. Please try again.");
      }

      setTimeout(() => {
        setApiError("");
      }, 4000);
    }

    setIsLoading(false);
  };

  // const handleOAuthSignUp = (provider) => {
  //   let authUrl = "";
  //   const redirectUri = encodeURIComponent("http://localhost:3000");

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
        <h1 className="heading">Create an account</h1>
        <p className="first--paragraph">
          Gain unlimited access to ameerchatbot today!
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form--container">
            <div className="input--container">
              <p className="labels">Email Address</p>
              <input
                className="input--box"
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
              />
              {errorEmail && <p className="error-message">{errorEmail}</p>}
            </div>
            <div className="input--container">
              <p className="labels">Full Name</p>
              <input
                placeholder="Enter your full name"
                className="input--box"
                value={fullName}
                onChange={handleFullNameChange}
              />
              {errorFullName && (
                <p className="error-message">{errorFullName}</p>
              )}
            </div>
            <Password value={password} onChange={handlePasswordChange} />
            {errorPassword && <p className="error-message">{errorPassword}</p>}
            <div className="check-box-container">
              <div className="remember-me">
                <input type="checkbox" checked readOnly />
                <label className="rem">Remember Me</label>
              </div>
              <p className="forgot-pass">Forgot Password</p>
            </div>
            <button className="btn" type="submit" disabled={isLoading}>
              {isLoading ? "loading .." : "Sign Up"}
            </button>
            {apiError && <p className="error-message">{apiError}</p>}
            <div className="horizontal-wrapper">
              <hr className="horizontal-line" />
              <p className="horizontal-para">Or With</p>
            </div>
            {/* <div className="flex">
              <div className="buttons">
                <button
                  className="button"
                  type="button"
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
                  type="button"
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
          </div>
        </form>
      

        {showPopup && (
          <PopupMessage
            message="Registration Successful🥳, You'll be redirected to the chatbox"
            className="show"
          />
        )}

        <button
          className="have-an-account-login"
          onClick={() => navigate("/login")}
        >
          <span className="have-an-account">Already have an account?</span>
          <span className="login">Login</span>
        </button>
      </div>
    </div>
  );
}
