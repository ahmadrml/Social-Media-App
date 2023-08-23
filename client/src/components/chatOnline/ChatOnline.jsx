import { useEffect, useState } from "react";
import "./chatOnline.css";
import axios from "axios";

const ChatOnline = ({ onlineUsers, currentUserId, setCurrentChat }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/api/users/friends/" + currentUserId);
      setFriends(res.data);
    };
    getFriends();
  }, [currentUserId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [onlineUsers, friends]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get("/api/conversations/find/"+currentUserId+"/"+user._id)
      setCurrentChat(res.data)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((of) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(of)}>
          <div className="chatOnlineImgContainer">
            <img
              src={
                of?.profilePic ? PF + of.profilePic : PF + "person/noAvatar.png"
              }
              alt=""
              className="chatOnlineImg"
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{of.username}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatOnline;
