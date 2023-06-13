import React from "react";

export default function Login({ setLoggedIn, blogPage }) {
  async function login(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const response = await fetch("https://young-water-1545.fly.dev/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", JSON.stringify({ token: data.token, timestamp: Date.now() }));
      localStorage.setItem("user", JSON.stringify({ username, id: data.userId }));
      setLoggedIn(true);
    } else {
      const error = document.querySelector(".error");
      error.classList.remove("hide");
    }
  }

  function logout() {
    const error = document.querySelector(".error");
    error.classList.add("hide");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
  }

  return (
    <div className="login-div">
      <form className={localStorage.getItem("token") ? "hide" : "login"} onSubmit={(e) => login(e)}>
        <h3 className={blogPage ? "hide" : ""}>Log In</h3>
        <h3 className={blogPage ? "" : "hide"}>Log In To Comment</h3>
        <div className="form-item">
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="username" />
        </div>
        <div className="form-item">
          <label htmlFor="password">Password: </label>
          <input type="password" name="password" id="password" />
        </div>
        <p className="error hide">Incorrect username or password</p>
        <button type="submit">Log In</button>
      </form>
      <p className={localStorage.getItem("token") ? "hide" : ""}>
        Don't have an account?
        {" "}
        <a href="/sign-up">Sign Up</a>
      </p>
      <p className={localStorage.getItem("user") && !blogPage ? "user" : "hide"}>
        You are currently logged in as
        {" "}
        <strong>{localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : ""}</strong>
      </p>
      <button className={localStorage.getItem("user") && !blogPage ? "logout" : "hide"} type="button" onClick={logout}>Log Out</button>
    </div>
  );
}
