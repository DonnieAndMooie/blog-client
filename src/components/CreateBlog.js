import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  return (
    <div>
      <Header />
      <div className="content">
        <h2>New Blog</h2>

      </div>
      <Footer />
    </div>
  );
}
