import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Blog from "./components/Blog";
import SignUp from "./components/SignUp";
import CreateBlog from "./components/CreateBlog";

const RouteSwitch = () => {
  const [blogs, setBlogs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch all blogs from database
    async function fetchBlogs() {
      try {
        const result = await (await fetch("https://young-water-1545.fly.dev/blogs")).json();
        setBlogs(result.reverse());
      } catch (err) {
        return err;
      }
    }

    fetchBlogs();
  }, []);
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home blogs={blogs} setLoggedIn={setLoggedIn} loggedIn={loggedIn} />} />
        {blogs.map((blog, index) => {
          return (
            <Route key={index} path={`/${blog._id}`} element={<Blog blog={blog} setLoggedIn={setLoggedIn} />} />
          );
        })}
        {blogs.map((blog, index) => {
          return (
            <Route key={`edit-${index}`} path={`/${blog._id}/edit`} element={<CreateBlog blog={blog} />} />
          );
        })}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/create-blog" element={<CreateBlog />} />
      </Routes>
    </HashRouter>
  );
};

export default RouteSwitch;
