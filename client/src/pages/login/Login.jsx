import { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "react-router-dom"

const Login = () => {
  const email = useRef();
  const password = useRef();
  const {user , isFetching , error , dispatch} = useContext(AuthContext);


  const handleClick = (e) => {
    e.preventDefault();
    loginCall({email:email.current.value , password:password.current.value} , dispatch);
  };

  console.log(user);


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
              type="Email"
              className="loginInput"
              placeholder="Email"
              ref={email}
            />
            <input
              type="password"
              className="loginInput"
              placeholder="Passowrd"
              ref={password}
              minLength="6"
            />
            <button className="loginBtn" disabled={isFetching}>{isFetching?<CircularProgress color="info" size="25px"/>:"Log In"}</button>
            <span className="loginForgot">Forget Password ?</span>
            <Link to="/register">
              <button className="loginRegisterBtn">Create A New Account</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
