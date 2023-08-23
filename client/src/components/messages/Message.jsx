import axios from "axios";
import "./message.css";
import { format } from "timeago.js";
import { useEffect, useState } from "react";

const Message = ({ own, message, currentConv }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
      <div className={own ? "message own" : "message"}>
        <div className="messageTop">
          <img
            src={PF+"person/noAvatar.png"}
            alt=""
            className="msgImg"
          />
          <p className="msgText">{message.text}</p>
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
      </div>
  );
};

export default Message;
