import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import api from "../api/api";

const RegisterModal = ({ setShowModal, isSignedUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  let navigate = useNavigate();

  const handleClick = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((current) => !current);
    try {
      if (!isSignedUp && password !== confirmPassword) {
        Swal.fire({
          title: "Please ensure both passwords are identical",
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading((current) => !current);

        return;
      }

      const response = await api.post(`/${isSignedUp ? "login" : "signup"}`, {
        email,
        password,
      });

      setCookie("AuthToken", response.data.token);
      setCookie("UserId", response.data.userId);
      const success = response.status === 201;
      console.log(response.data.token);

      if (success && !isSignedUp) navigate("/profile");
      if (success && isSignedUp) navigate("/dashboard");

      window.location.reload();
    } catch (error) {
      console.log(error.response.data);
      setLoading((current) => !current);
      Swal.fire({
        title: error.response.data,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // const toggleClass = () => {
  //   setLoading((current) => !current);
  // };
  return (
    <div className="regis-modal">
      <div className="close-icon" onClick={handleClick}>
        x
      </div>
      <h2>{isSignedUp ? "Log In" : "Create Account"}</h2>

      <p className="privacy-text">
        By clicking sign up you are agreeing to the terms of use and
        acknowledging the Privacy Policy.
      </p>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-input"
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isSignedUp && (
          <input
            className="form-input"
            type="password"
            id="password-check"
            name="password-check"
            placeholder="Confirm your password"
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button
          className={
            loading ? "second-button loading disabled" : "second-button"
          }
          type="submit"
          disabled={loading}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterModal;
