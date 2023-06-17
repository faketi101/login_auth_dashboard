import Sidebar from "./Sidebar";
import { Outlet, Link } from "react-router-dom";
import "./dashboard.css";
import { useEffect, useState } from "react";
import { getVerification } from "../auth_components/getVerification";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../pages/Loading";

const Dash = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function toggle_none() {
    document.querySelector("#user_options_opt").classList.toggle("none");
  }
  function visible_sidebar() {
    document.querySelector("#sidebar").classList.add("visible");
  }

  const getData = async () => {
    try {
      setLoading(true);

      let res = await getVerification();
      if (res) {
        setData(res.data);
        setLoading(false);
      } else {
        setLoading(false);

        return navigate("/");
      }
    } catch (error) {
      setLoading(false);

      toast.error("Server error. Please try again later.");
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {loading ? <Loading /> : null}

      <section id="dashboard">
        <div id="top_bar">
          <div className="greetings">
            <div id="user_grettings">
              <span>Hello,</span> <br />
              <h1 className="user__name">{data ? data.username : "NA"}</h1>
              <h1
                className="menu_btn"
                onClick={() => visible_sidebar()}
                title="Open sidebar"
              >
                <i className="fa-solid fa-table-list" />
              </h1>
            </div>
          </div>
          <div
            onClick={() => toggle_none()}
            id="user_options_ico"
            className="user_options"
          >
            <img
              className="user_icon"
              src={
                data && data.avatar
                  ? data.avatar
                  : "https://t3.ftcdn.net/jpg/05/17/79/88/360_F_517798849_WuXhHTpg2djTbfNf0FQAjzFEoluHpnct.jpg"
              }
              alt="user_icon"
              srcSet=""
            />
            <div id="user_options_opt" className="options none">
              <Link to={"/logout"}>Logout</Link>
              <Link to={"/dashboard/change_password"}>Change Password</Link>
              <Link to={"/dashboard/change_avatar"}>Change Avatar</Link>
              <Link to={"/dashboard/device_manager"}>Device Manager</Link>
            </div>
          </div>
        </div>
        <div id="dashboard_body">
          <Sidebar />

          <div id="dashboard_contents">
            {" "}
            <Outlet />{" "}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dash;
