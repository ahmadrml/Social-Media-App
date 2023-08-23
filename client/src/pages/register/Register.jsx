import "./register.css";
import React , {useRef} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"


const Login = () => {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const ConfirmPassword = useRef();
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if(password.current.value !== ConfirmPassword.current.value){
      ConfirmPassword.current.setCustomValidity("Passwords Don't Match !")
      console.log("errpr");
    }
    else{
      const user={
        username: username.current.value,
        email: email.current.value,
        password: password.current.value
      }

      try {
        await axios.post("/api/auth/register" , user);
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginRight">
          <h3 className="loginLogo">AhmadSocial</h3>
          <span className="loginDesc">
            Connect With Friends And The World Around You On AhmadSocial
          </span>
        </div>
        <div className="loginLeft">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              type="text"
              className="loginInput"
              placeholder="Username"
              ref={username}
              required
            />
            <input
              type="email"
              className="loginInput"
              placeholder="Email"
              ref={email}
              required
            />
            <input
              type="password"
              className="loginInput"
              placeholder="Password"
              ref={password}
              required
              minLength="6"
            />
            <input
              type="password"
              className="loginInput"
              placeholder="Re-type Password"
              ref={ConfirmPassword}
              required
              minLength="6"
            />
            <button className="loginBtn" type="submit" >Sign Up</button>
            <div>
            <Link to="/login">
              <button className="loginRegisterBtn">Login Into Account</button>
            </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
