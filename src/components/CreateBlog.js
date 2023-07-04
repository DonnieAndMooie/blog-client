import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import Header from "./Header";
import Footer from "./Footer";

export default function CreateBlog({ blog }) {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    async function checkIfAdmin() {
      if (!localStorage.getItem("user")) {
        // If no user logged in redirect to home
        navigate("/");
        return;
      }
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const user = await fetch(`https://young-water-1545.fly.dev/users/${userId}`);
      const userData = await user.json();
      if (!userData.admin) {
        // If user is not admin redirect to home
        navigate("/");
      }
    }

    checkIfAdmin();
    if (blog) {
      // When blog is being editted set title to previous title
      setTitle(blog.title);
    }
  }, []);

  async function formSubmitHandler(e) {
    e.preventDefault();
    const content = document.getElementById("blog-content").value;
    // Save blog
    const response = await fetch("https://young-water-1545.fly.dev/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token")).token}`,
      },
      body: JSON.stringify({
        title,
        content,
        timestamp: Date.now(),
        author: JSON.parse(localStorage.getItem("user")).id,
        published: true,
      }),
    });

    const data = await response.json();

    // Redirect to blog page
    navigate(`/${data._id}`);
    window.location.reload(false);
  }

  function changeHandler(e) {
    setTitle(e.target.value);
  }

  async function updateBlog(e) {
    e.preventDefault();
    const content = document.getElementById("blog-content").value;
    // Save updated blog
    const response = await fetch(`https://young-water-1545.fly.dev/blogs/${blog._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token")).token}`,
      },
      body: JSON.stringify({
        title,
        content,
        timestamp: Date.now(),
        author: JSON.parse(localStorage.getItem("user")).id,
        published: true,
      }),
    });

    const data = await response.json();
    navigate(`/${data._id}`);
    window.location.reload(false);
  }

  return (
    <div>
      <Header />
      <div className="content create-blog">
        {blog && <h2>Edit Blog</h2>}
        {!blog && <h2>New Blog</h2>}
        <form onSubmit={blog ? (e) => updateBlog(e) : (e) => formSubmitHandler(e)}>
          <div className="form-item new-blog-title">
            <label htmlFor="title">Title:</label>
            <input value={title} onChange={(e) => changeHandler(e)} type="text" name="title" id="title" />
          </div>
          <Editor
            initialValue={blog ? blog.content : ""}
            apiKey={process.env.REACT_APP_API_KEY}
            init={{
              height: 1000,
              width: "100%",
              menubar: false,
              plugins: "wordcount",
              toolbar: "undo redo | formatselect | "
           + "bold italic backcolor | alignleft aligncenter "
           + "alignright alignjustify | bullist numlist outdent indent | "
           + "removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:20px }",
            }}
            id="blog-content"
          />
          {blog && <button type="submit" className="upload-btn">Update Blog</button>}
          <button type="submit" className={blog ? "hide" : "upload-btn"}>Upload Blog</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
