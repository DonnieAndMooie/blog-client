import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import moment from "moment";
import Header from "./Header";
import Footer from "./Footer";

const Home = ({ blogs }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if token has expired
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const object = JSON.parse(token);
      const timestamp = moment(object.timestamp);
      const currentTime = moment(new Date());
      const difference = currentTime.diff(timestamp, "hours");
      if (difference >= 24) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setLoggedIn(true);
    }
  }, []);

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
      localStorage.setItem("user", username);
      setLoggedIn(true);
    } else {
      const error = document.querySelector(".error");
      error.classList.remove("hide");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
  }

  return (
    <div>
      <Header />
      <div className="content">
        <p className="intro">
          Welcome to my blog. This is where I talk about all sorts of
          random stuff which I find interesting. Have a read, if you like!

        </p>
        <div className="blogs">
          {blogs.map((blog, index) => {
            return (
              <div key={index} className="blog-item">
                <h3><a href={blog._id}>{blog.title}</a></h3>
                <p className="date">{format(new Date(blog.timestamp), "io LLLL u")}</p>
              </div>
            );
          })}
        </div>
        <form className={localStorage.getItem("token") ? "hide" : "login"} onSubmit={(e) => login(e)}>
          <h3>Log In</h3>
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
        <p className={localStorage.getItem("user") ? "user" : "hide"}>
          You are currently logged in as
          {" "}
          <strong>{localStorage.getItem("user")}</strong>
        </p>
        <button className={localStorage.getItem("user") ? "logout" : "hide"} type="button" onClick={logout}>Log Out</button>
      </div>
      <Footer />
    </div>

  );
};

export default Home;
