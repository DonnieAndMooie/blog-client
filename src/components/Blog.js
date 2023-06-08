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

  return (
    <div>
      <Header />
      <div className="content">
        <h2>{blog.title}</h2>
        <p className="date">{format(new Date(blog.timestamp), "io LLLL u")}</p>
        <p className="blog-content">{blog.content}</p>
        <h3>Comments</h3>
        <Login blogPage setLoggedIn={setLoggedIn} />
        <form className={localStorage.getItem("user") ? "" : "hide"}>
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
