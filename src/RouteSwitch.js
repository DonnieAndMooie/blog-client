import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Blog from "./components/Blog";
import SignUp from "./components/SignUp";

const RouteSwitch = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const result = await (await fetch("https://young-water-1545.fly.dev/blogs")).json();
        setBlogs(result);
      } catch (err) {
        return err;
      }
    }

    fetchBlogs();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home blogs={blogs} />} />
        {blogs.map((blog, index) => {
          return (
            <Route key={index} path={blog._id} element={<Blog blog={blog} />} />
          );
        })}
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;
