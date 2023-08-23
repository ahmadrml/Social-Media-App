import "./following.css";

const Following = ({friend}) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER; 

  return (
    <>
      <div className="rightbarFollowing">
        <img src={friend.profilePic ? PF+friend.profilePic :PF+"person/noAvatar.png"} className="rightbarFollowinigImg" alt="friend"/>
        <span className="rightBarFollowingName">{friend.username}</span>
      </div>
    </>
  );
};

export default Following;
