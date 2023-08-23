import { useEffect, useState } from "react";
import "./conversation.css";
import axios from "axios";

const Conversation = ({ conv, currentUser }) => {
  const [friendUser, setFriend] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conv.members.find((f_id) => f_id !== currentUser._id);
    const getFriend = async () => {
      try {
        const friend = await axios.get("/api/users?userId=" + friendId);
        setFriend(friend.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriend();
  }, [currentUser, conv]);

  return (
    <div className="conversation">
      {friendUser && (
        <>
          <img
            src={
              friendUser.profilePic
                ? PF + friendUser.profilePic
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="convImg"
          />
          <div className="convName">{friendUser.username}</div>
        </>
      )}
    </div>
  );
};

export default Conversation;
