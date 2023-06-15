import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import moment, { duration } from "moment";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Edit from "../images/edit.png";
import Delete from "../images/delete.png";

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
    if (data.published) {
      e.target.className = "published";
      e.target.textContent = "Published";
    } else {
      e.target.className = "unpublished";
      e.target.textContent = "Unpublished";
    }
  }

  async function deleteBlog(blog) {
    const response = await fetch(`https://young-water-1545.fly.dev/blogs/${blog._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token")).token}`,
      },
    });
    window.location.reload(false);
  }

  function confirmDelete(blog) {
    const popup = document.querySelector(".confirm-delete");
    popup.classList.remove("hide");

    const confirm = document.querySelector(".confirm");
    const cancel = document.querySelector(".cancel");
    confirm.addEventListener("click", () => {
      popup.classList.add("hide");
      deleteBlog(blog);
    });
    cancel.addEventListener("click", () => {
      popup.classList.add("hide");
    });
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
                <h3><Link to={blog._id}>{blog.title}</Link></h3>
                <p className="date">{format(new Date(blog.timestamp), "do LLLL u")}</p>
                {isAdmin && <button type="button" className={blog.published ? "published" : "unpublished"} onClick={(e) => togglePublish(e, blog)}>{blog.published ? "Published" : "Unpublished"}</button>}
                {isAdmin && <img src={Edit} alt="edit" className="edit-icon" onClick={() => navigate(`/${blog._id}/edit`)} />}
                {isAdmin && <img src={Delete} alt="delete" className="delete-icon" onClick={() => confirmDelete(blog)} />}
              </div>
            );
          })}
        </div>
        <div className="confirm-delete hide">
          <h3>Are you sure you want to delete this blog?</h3>
          <div className="buttons">
            <button type="button" className="confirm">Confirm</button>
            <button type="button" className="cancel">Cancel</button>
          </div>
        </div>
        {isAdmin && <button type="button" className="new-blog-btn" onClick={() => navigate("/create-blog")}>+ New Blog</button>}
        <Login setLoggedIn={setLoggedIn} />
      </div>
      <Footer />
    </div>

  );
};

export default Home;
