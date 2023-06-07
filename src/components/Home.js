import React from "react";
import { format } from "date-fns";
import Header from "./Header";
import Footer from "./Footer";

const Home = ({ blogs }) => {
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
    console.log(username);
    console.log(password);
    console.log(response.json().[[PromiseResult]].token);
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
        <form className="login" onSubmit={(e) => login(e)}>
          <h3>Log In</h3>
          <div className="form-item">
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" id="username" />
          </div>
          <div className="form-item">
            <label htmlFor="password">Password: </label>
            <input type="password" name="password" id="password" />
          </div>
          <button type="submit">Log In</button>
        </form>
        <p>
          Don't have an account?
          {" "}
          <a href="/sign-up">Sign Up</a>
        </p>
      </div>
      <Footer />
    </div>

  );
};

export default Home;
