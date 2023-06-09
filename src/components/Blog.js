import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";

const Blog = ({ blog, setLoggedIn }) => {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    // Fetch all comments on post
    async function fetchComments() {
      try {
        const result = await (await fetch(`https://young-water-1545.fly.dev/blogs/${blog._id}/comments`)).json();
        const sortedComments = result.reverse();
        setComments(sortedComments);
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
    // Save comment to DB
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
    document.querySelector("textarea").value = "";
    const data = await response.json();
    if (data.timestamp) {
      // Fetch author of comment and save comment in state
      const user = await fetch(`https://young-water-1545.fly.dev/users/${author}`);
      const userData = await user.json();
      data.author = userData;
      setComments([data, ...comments]);
    }
  }

  async function deleteComment(comment, index) {
    // Remove comment from state
    setComments(comments.filter((item) => {
      return item._id !== comment._id;
    }));
    // Remove comment from DB
    const response = await fetch(`https://young-water-1545.fly.dev/blogs/${blog._id}/comments/${comment._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token")).token}`,
      },
    });
    const data = await response.json();
  }

  function htmlDecode(input) {
    // Create div with html set to input
    const e = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes[0].nodeValue;
  }

  return (
    <div>
      <Header />
      <div className="content">
        <h2>{blog.title}</h2>
        <p className="date">{format(new Date(blog.timestamp), "do LLLL u")}</p>
        <p className="blog-content" dangerouslySetInnerHTML={{ __html: htmlDecode(blog.content) }} />
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
                <div className="right-header">
                  <p className="date">{format(new Date(comment.timestamp), "h:mm a dd/MM/u")}</p>
                  {JSON.parse(localStorage.getItem("user")) && comment.author._id === JSON.parse(localStorage.getItem("user")).id
                  && <button type="button" className="delete" onClick={() => deleteComment(comment, index)}>X</button>}
                </div>
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
