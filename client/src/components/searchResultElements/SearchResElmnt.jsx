import "./searchResElmnt.css";
import { Link } from "react-router-dom";

const SearchResElmnt = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <>
      <Link to={"/profile/" + user.username} className="link">
        <div className="searchResultElement">
          <img
            src={
              user.profilePic
                ? PF + user.profilePic
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="elementImg"
          />
          <span className="elementName">{user.username}</span>
        </div>
      </Link>
    </>
  );
};

export default SearchResElmnt;
