import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";

const Home = ({
  blogs, setLoggedIn, loggedIn,
}) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
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

  useEffect(() => {
    async function checkIfAdmin() {
      if (!localStorage.getItem("user")) {
        setIsAdmin(false);
        return;
      }
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const user = await fetch(`https://young-water-1545.fly.dev/users/${userId}`);
      const userData = await user.json();
      if (userData.admin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
    checkIfAdmin();
  }, [loggedIn]);

  async function togglePublish(e, blog) {
    let updatedValue;
    if (e.target.className === "unpublished") {
      updatedValue = true;
    } else {
      updatedValue = false;
    }
    const response = await fetch(`https://young-water-1545.fly.dev/blogs/${blog._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token")).token}`,
      },
      body: JSON.stringify({
        published: updatedValue,
      }),
    });

    const data = await response.json();
    console.log(data);
    if (data.published) {
      e.target.className = "published";
      e.target.textContent = "Published";
    } else {
      e.target.className = "unpublished";
      e.target.textContent = "Unpublished";
    }
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
            if (!blog.published && !isAdmin) {
              return;
            }
            return (
              <div key={index} className="blog-item">
                <h3><a href={blog._id}>{blog.title}</a></h3>
                <p className="date">{format(new Date(blog.timestamp), "io LLLL u")}</p>
                {isAdmin && <button type="button" className={blog.published ? "published" : "unpublished"} onClick={(e) => togglePublish(e, blog)}>{blog.published ? "Published" : "Unpublished"}</button>}
              </div>
            );
          })}
        </div>
        {isAdmin && <button type="button" className="new-blog-btn" onClick={() => navigate("/create-blog")}>+ New Blog</button>}
        <Login setLoggedIn={setLoggedIn} />
      </div>
      <Footer />
    </div>

  );
};

export default Home;
