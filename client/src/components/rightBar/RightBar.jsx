import "./rightbar.css";
import Online from "../online/Online";
import Following from "../following/Following";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { io } from "socket.io-client";
import Update from "../../UpdateProf/UpdateProf";


const RightBar = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.following.includes(user?._id)
  );
  const [update , setUpdate] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://127.0.0.1:8900");
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", currentUser._id);
    socket.current.on("getUsers", (users) => {
      const findOnlineFriends = async () => {
        try {
          const onlineFriends = currentUser.following.filter((f) =>
            users.some((u) => u.userId === f)
          );
          onlineFriends.forEach((element) => {
            const findFriends = async () => {
              const res = await axios.get("/api/users?userId=" + element);
              setOnlineUsers(res.data);
            };
            findFriends();
          });
        } catch (error) {
          console.log(error);
        }
      };
      findOnlineFriends();
    });
  }, [currentUser , onlineUsers]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendsList = await axios.get(
          "/api/users/friends/" + currentUser._id
        );
        setFriends(friendsList.data);
        setFollowed(currentUser.following.includes(user._id));
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put("/api/users/" + currentUser._id + "/unfollow", {
          userId: user._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put("/api/users/" + currentUser._id + "/follow", {
          userId: user._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (error) {
      console.log(error);
    }
    setFollowed(!followed);
  };

  const HomeRightBar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src={PF + "gift.png"} className="birthdayImg" />
          <span className="birthdayText">
            <b>Ahmad Rammal</b> and <b>other 3 friends</b> have a birthday today
            !
          </span>
        </div>
        <img src={PF + "ad.png"} className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="onlineFriendsList">
          {Array.isArray(onlineUsers) ? (
            onlineUsers.map((u) => <Online key={u.id} user={u} />)
          ) : (
            <Online key={onlineUsers._id} user={onlineUsers} />
          )}
        </ul>
      </>
    );
  };
  const ProfileRightBar = () => {
    return (
      <>
        {user.username !== currentUser.username ? (
          <button className="followBtn" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <RemoveIcon /> : <AddIcon />}
          </button>
        ) :
        <button className="followBtn" onClick={() => setUpdate(true)}>
            Update Infos
          </button> 
        }
        <h4 className="rightbarTitle">User Informations</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City : </span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From :</span>
            <span className="rightbarInfoValue">{user.country}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">RelationShip :</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "single"
                : user.relationship === 2
                ? "Married"
                : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {friends.map((fr) => (
            <Link
              to={"/profile/" + fr.username}
              style={{ textDecoration: "none" }}
            >
              <Following friend={fr} />
            </Link>
          ))}
        </div>
        {update && <Update setUpdate={setUpdate} user={currentUser}/>}
      </>
    );
  };

  return (
    <>
      <div className="rightbar">
        <div className="rightbarWrapper">
          {user ? <ProfileRightBar /> : <HomeRightBar />}
        </div>
      </div>
    </>
  );
};

export default RightBar;
