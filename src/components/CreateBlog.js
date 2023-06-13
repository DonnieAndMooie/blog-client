import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import Header from "./Header";
import Footer from "./Footer";

export default function CreateBlog() {
  const navigate = useNavigate();
  useEffect(() => {
    async function checkIfAdmin() {
      if (!localStorage.getItem("user")) {
        navigate("/");
        return;
      }
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const user = await fetch(`https://young-water-1545.fly.dev/users/${userId}`);
      const userData = await user.json();
      if (!userData.admin) {
        navigate("/");
      }
    }

    checkIfAdmin();
  }, []);

  async function formSubmitHandler(e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("blog-content").value;

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
    console.log(data);
  }

  return (
    <div>
      <Header />
      <div className="content create-blog">
        <h2>New Blog</h2>
        <form onSubmit={(e) => formSubmitHandler(e)}>
          <div className="form-item new-blog-title">
            <label htmlFor="title">Title:</label>
            <input type="text" name="title" id="title" />
          </div>
          <Editor
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
          <button type="submit" className="upload-btn">Upload Blog</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
