import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function SignUp() {
  const navigate = useNavigate();

  useEffect(() => {
    // If logged in redirect to homepage
    if (localStorage.getItem("user")) {
      return navigate("/");
    }
  }, []);

  async function submitHandler(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // If passwords don't match show error
    if (password !== confirmPassword) {
      const error = document.querySelector(".error");
      error.classList.remove("hide");
    } else {
      const response = await fetch("https://young-water-1545.fly.dev/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      return navigate("/");
    }
  }
  return (
    <div>
      <Header />
      <div className="content">
        <h2>Sign Up</h2>
        <form onSubmit={(e) => submitHandler(e)} className="sign-up" id="sign-up">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required minLength={3} />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required minLength={6} />
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input type="password" id="confirm-password" name="confirm-password" required minLength={6} />
        </form>
        <p className="error hide">Passwords do not match</p>
        <button form="sign-up" type="submit">Sign Up</button>
      </div>
      <Footer />
    </div>
  );
}
