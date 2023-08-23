import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/messages/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const Messenger = () => {
  const [convs, setConvs] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [arrivalMsg, setarrivalMsg] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    const getConvs = async () => {
      try {
        const res = await axios.get("/api/conversations/" + user._id);
        setConvs(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConvs();
  }, [user]);

  useEffect(() => {
    const getMsgs = async () => {
      try {
        const res = await axios.get("/api/messages/" + currentChat?._id);
        setMsgs(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMsgs();
  }, [currentChat]);

  //Sockets
  useEffect(() => {
    socket.current = io("ws://127.0.0.1:8900");
    socket.current.on("getMessage", (data) => {
      setarrivalMsg({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [arrivalMsg]);

  useEffect(() => {
    arrivalMsg &&
      currentChat?.members.includes(arrivalMsg.sender) &&
      setMsgs((prev) => [...prev, arrivalMsg]);
  }, [arrivalMsg, currentChat]);

  useEffect(() => {
    socket.current.on("welcome", (message) => {
      console.log(message);
    });
  }, [socket]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) =>
      setOnlineUsers(
        user.following.filter((f) => users.some((u) => u.userId === f))
      )
    );
  }, [user]);

  const handleSubmitMsg = async (e) => {
    if(newMsg !== ""){
      const message = {
        convId: currentChat._id,
        sender: user._id,
        text: newMsg,
      };
  
      const receiverId = currentChat.members.find(
        (member) => member !== user._id
      );
  
      socket.current.emit("sendMessage", {
        senderId: user._id,
        receiverId: receiverId,
        text: newMsg,
      });
  
      try {
        const res = await axios.post("/api/messages", message);
        setMsgs([...msgs, res.data]);
        setNewMsg("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  return (
    <>
      <Topbar />
      <div className="messengerContainer">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="Search For Friends"
              className="chatMenuInput"
            />
            {convs.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation key={c._id} conv={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {msgs.map((m) => (
                    <div ref={scrollRef}>
                      <Message
                        key={m._id}
                        message={m}
                        currentConv={currentChat}
                        own={m.sender === user._id}
                      />
                    </div>
                  ))}
                </div>

                <div className="chatBoxBottom">
                  <textarea
                    className="chatMsgInput"
                    cols="30"
                    rows="10"
                    placeholder="Write Your Message"
                    onChange={(e) => setNewMsg(e.target.value)}
                    value={newMsg}
                  ></textarea>
                  <button className="chatBtnSubmit" onClick={handleSubmitMsg}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noconvText">Open Conversation To see Chats</span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentUserId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
