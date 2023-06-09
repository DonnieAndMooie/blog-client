import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";

const Blog = ({ blog, setLoggedIn }) => {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    async function fetchComments() {
      try {
        const result = await (await fetch(`https://young-water-1545.fly.dev/blogs/${blog._id}/comments`)).json();
        setComments(result);
      } catch (err) {
        return err;
      }
    }
    fetchComments();
  }, []);

  async function commentHandler(e) {
    e.preventDefault();
    const comment = document.querySelector("textarea").value;
    const author = JSON.parse(localStorage.getItem("user")).id;
    const response = await fetch(`https://young-water-1545.fly.dev/blogs/${blog._id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token")).token}`,
      },
      body: JSON.stringify({
        text: comment,
        timestamp: Date.now(),
        author,
        blog: blog._id,
      }),
    });
    const data = await response.json();
    const user = await fetch(`https://young-water-1545.fly.dev/users/${author}`);
    const userData = await user.json();
    data.author = userData;
    setComments([...comments, data]);
    document.querySelector("textarea").value = "";
  }

  return (
    <div>
      <Header />
      <div className="content">
        <h2>{blog.title}</h2>
        <p className="date">{format(new Date(blog.timestamp), "io LLLL u")}</p>
        <p className="blog-content">{blog.content}</p>
        <h3>Comments</h3>
        <Login blogPage setLoggedIn={setLoggedIn} />
        <form className={localStorage.getItem("user") ? "" : "hide"} onSubmit={(e) => commentHandler(e)}>
          <p>Add a comment...</p>
          <textarea />
          <button type="submit">Send</button>
        </form>
        {comments.map((comment, index) => {
          return (
            <div key={index} className="comment">
              <div className="comment-header">
                <p><strong>{comment.author.username}</strong></p>
                <p className="date">{format(new Date(comment.timestamp), "p P")}</p>
              </div>
              <p>{comment.text}</p>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
