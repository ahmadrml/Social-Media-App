import "./share.css";
import { PermMedia, Label, Room, EmojiEmotions } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useRef, useState } from "react";
import axios from "axios";

const Share = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const desc = useRef();
  const [file, setFile] = useState(null);

  console.log(user.profilePic)

  const submitHandler = async () => {
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };


    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      newPost.content = filename;

      try {
        await axios.post("/api/upload", data );
      } catch (error) {
        console.log(error);
      }
    }

    try {
      axios.post("/api/posts", newPost);
    } catch (error) {}
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={
              user.profilePic
                ? PF + user.profilePic
                : PF + "person/noAvatar.png"
            }
            className="shareProfileImg"
          />
          <input
            placeholder={"What's in your mind " + user.username + " ?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareContentContainer">
            <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
            <CancelIcon className="shareCancel" onClick={() => setFile(null)} />
          </div>
        )}
        <div className="shareBottom">
          <form className="shareOptions" onSubmit={submitHandler}>
            <label className="shareOption" htmlFor="file">
              <PermMedia className="shareIcon" htmlColor="tomato" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                type="file"
                id="file"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
            <div className="shareOption">
              <Label className="shareIcon" htmlColor="blue" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room className="shareIcon" htmlColor="green" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions className="shareIcon" htmlColor="goldenrod" />
              <span className="shareOptionText">Feelings</span>
            </div>
            <button className="shareButton" type="submit">
              Share
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Share;
