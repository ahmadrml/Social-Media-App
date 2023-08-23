import "./online.css";
import { Link } from "react-router-dom";

const Online = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  console.log(user);
  return (
    <Link to={"/profile/" + user.username} className="link">
      <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
          <img
            src={
              user.profilePic
                ? PF + user.profilePic
                : PF + "person/noAvatar.png"
            }
            className="rightbarProfileImg"
          />
          <span className="rightbarOnline"></span>
          <span className="rightbarUsername">{user.username}</span>
        </div>
      </li>
    </Link>
  );
};

export default Online;
