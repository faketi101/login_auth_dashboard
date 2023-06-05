import { useEffect, useState } from "react";
import "./login.css";
import waveImage from "../../assets/wave.png";
import avatatSvg from "../../assets/avatar.svg";
import bgSvg from "../../assets/bg.svg";
import { server_url } from "../../config/serverConfing";
import { toast } from "react-toastify";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../pages/Loading";

const initState = {
  username: "",
  password: "",
};
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initState);
  const [cookies, setCookie] = useCookies(["auth"]);
  const navigate = useNavigate();
  const getVerification = async () => {
    try {
      setLoading(true);
      const url = `${server_url}/auth/verify`;
      let res = await axios.get(url, {
        headers: {
          Authorization: `${cookies.auth}`,
        },
      });

      if (res.data.success) {
        setLoading(false);
        navigate("/dashboard");
      } else {
        setLoading(false);
        toast.error("Something went wrong. Please try again later");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Token invalid! please relogin.");
      if (location.pathname !== "/") {
        navigate("/");
      }
    }
  };
  useEffect(() => {
    if (cookies && cookies.auth) {
      getVerification();
    } else {
      toast.info("Please login to continue.");
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.username) {
      toast.error("Username Must be filled.");
      return;
    }
    if (!formData.password) {
      toast.error("Password Must be filled.");
      return;
    }
    setLoading(true);
    const url = `${server_url}/auth/login`;

    try {
      let res = await axios.post(url, formData);

      if (res.data.success) {
        setLoading(false);

        toast.success(`Welcome ${res.data.data.username}`);
        if (res.data.cookie) {
          let res_cokie = res.data.cookie;
          setCookie(res_cokie.name, res_cokie.token, {
            path: "/",
            maxAge: res_cokie.options.maxAge,
          });
          navigate("/dashboard");
        }
      }
    } catch (error) {
      setLoading(false);

      // console.dir(error);
      toast.error("Invalid Username or Password.");
    }
  };

  useEffect(() => {
    const inputs = document.querySelectorAll(".input");

    function addcl() {
      let parent = this.parentNode.parentNode;
      parent.classList.add("focus");
    }

    function remcl() {
      let parent = this.parentNode.parentNode;
      if (this.value == "") {
        parent.classList.remove("focus");
      }
    }

    inputs.forEach((input) => {
      input.addEventListener("focus", addcl);
      input.addEventListener("blur", remcl);
    });
  }, []);
  return (
    <>
      {loading ? <Loading /> : null}
      <div className="login">
        <img className="wave" src={waveImage} />
        <div className="container">
          <div className="img">
            <img src={bgSvg} />
          </div>
          <div className="login-content">
            <form onSubmit={submitHandler}>
              <img src={avatatSvg} />
              <h2 className="title">Login</h2>
              <div className="input-div one">
                <div className="i">
                  <i className="fas fa-user" />
                </div>
                <div className="div">
                  <h5>Username</h5>
                  <input
                    type="text"
                    name="username"
                    className="input"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="input-div pass">
                <div className="i">
                  <i className="fas fa-lock" />
                </div>
                <div className="div">
                  <h5>Password</h5>
                  <input
                    name="password"
                    type="password"
                    className="input"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
              <a href="#">Forgot Password?</a>
              <input type="submit" className="btn" defaultValue="Login" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
