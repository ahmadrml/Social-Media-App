import React, { useEffect, useState } from "react";
import "./feed.css";
import Share from "../share/Share";
import Post from "../post/post";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function createPost(p) {
  return <Post key={p._id} post={p} />;
}

const Feed = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const {user} = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("/api/posts/profile/"+username)
        : await axios.get("/api/posts/timeline/"+user._id);
      setPosts(res.data.sort((p1,p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      }));
    };
    fetchPosts();
  }, [username , user._id]);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {((username === user.username) || (!username)) && <Share />}
        {posts.map(createPost)}
      </div>
    </div>
  );
};

export default Feed;
