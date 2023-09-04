import React, { useContext, useState, useEffect, useRef } from "react";
import "./topbar.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import Chat from "@mui/icons-material/Chat";
import Notifications from "@mui/icons-material/Notifications";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import SearchResElmnt from "../searchResultElements/SearchResElmnt";

const Topbar = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleChange = async () => {
      if (input) {
        try {
          const res = await axios.get("/api/users/search?username=" + input);
          setUsers(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    handleChange();

  }, [input]);

  return (
    <div className="topBarContainer">
      {
        <Link to="/" className="topBarLeft">
          <div >
            <span className="logo">AhmadSocial</span>
          </div>
        </Link>
      }
      <div className="topBarCenter">
        <div className="searchBar">
          <SearchIcon className="searchIcon" />
          <input
            placeholder="Search for People."
            className="searchInput"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="searchResult">
          {input && users.map((u) => <SearchResElmnt key={u._id} user={u} />)}
        </div>
      </div>
      <div className="topBarRight">
        <div className="topBarLinks">
          <Link to="/" className="topBarLink">
            <span>Home</span>
          </Link>
          <Link to="/messenger" className="topBarLink">
            <span>Messenger</span>
          </Link>
        </div>

        <div className="topBarIcons">
          <div className="topBarIconItem">
            <PersonIcon />
            <span className="topBarIconBadge">1</span>
          </div>
          <div className="topBarIconItem">
            <Chat />
            <span className="topBarIconBadge">1</span>
          </div>
          <div className="topBarIconItem">
            <Notifications />
            <span className="topBarIconBadge">1</span>
          </div>
        </div>

        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePic
                ? PF + user.profilePic
                : PF + "person/noAvatar.png"
            }
            className="topBarImg"
          />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
