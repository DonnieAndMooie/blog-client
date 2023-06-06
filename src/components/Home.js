import React from "react";
import { format } from "date-fns";
import Header from "./Header";
import Footer from "./Footer";

const Home = ({ blogs }) => {
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
            return (
              <div key={index} className="blog-item">
                <h3><a href={blog._id}>{blog.title}</a></h3>
                <p className="date">{format(new Date(blog.timestamp), "io LLLL u")}</p>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>

  );
};

export default Home;
