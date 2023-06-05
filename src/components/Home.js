import React from 'react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns'

const Home = () => {
    const [blogs, setBlogs] = useState([])

    useEffect(() => {
        async function fetchBlogs(){
          try{
            const result = await (await fetch("https://young-water-1545.fly.dev/blogs")).json()
            setBlogs(result)
          } catch(err){
            console.error(err)
          }
        }
        fetchBlogs()
    }, [])

    return (
        <div className='content'>
            <p className='intro'>Welcome to my blog. This is where I talk about all sorts of 
            random stuff which I find interesting. Have a read, if you like!</p>
            <div className="blogs">
                {blogs.map((blog, index) => {
                    return(
                        <div key={index} className='blog-item'>
                            <h3>{blog.title}</h3>
                            <p className='date'>{format(new Date(blog.timestamp), "io LLLL u")}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Home;