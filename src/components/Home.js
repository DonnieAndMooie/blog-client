import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import moment from "moment";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";

const Home = ({ blogs, setLoggedIn }) => {
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
        <Login setLoggedIn={setLoggedIn} />
      </div>
      <Footer />
    </div>

  );
};

export default Home;
