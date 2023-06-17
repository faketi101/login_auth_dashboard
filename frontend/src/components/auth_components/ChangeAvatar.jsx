import Loading from "../pages/Loading";
import { useEffect, useState } from "react";
import { getVerification } from "../auth_components/getVerification";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { server_url } from "../../config/serverConfing";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./changeAvatar.css";
const ChangeAvatar = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(data.avatar);
  const navigate = useNavigate();
  const [cookies] = useCookies(["auth"]);
  const [isChange, setIsChange] = useState(false);

  const changeHandler = (value) => {
    if (value !== data.avatar) {
      setAvatar(value);
      setIsChange(true);
    } else if (value === data.avatar) {
      setAvatar(value);
      setIsChange(false);
    }
  };

  const handle_submit = async (e) => {
    try {
      e.preventDefault();
      const url = `${server_url}/auth/change_avatar`;
      console.log(avatar);
      let res = await axios.post(
        url,
        { avatar },
        {
          headers: {
            Authorization: `${cookies.auth}`,
          },
        }
      );
      if (res.data.success) {
        toast.success("Avatar has been changed.");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      toast.error("Avatar could not changed.");
    }
  };

  const getData = async () => {
    try {
      setLoading(true);

      let res = await getVerification();
      if (res) {
        setData(res.data);
        setAvatar(res.data.avatar);
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
      <div className="" id="changePassword">
        <img
          className="user_icon"
          src={
            avatar && avatar
              ? avatar
              : "https://t3.ftcdn.net/jpg/05/17/79/88/360_F_517798849_WuXhHTpg2djTbfNf0FQAjzFEoluHpnct.jpg"
          }
          alt="user_icon"
          srcSet=""
        />
        <form onSubmit={handle_submit}>
          <div>
            <input
              placeholder="Use image url for the avatar:"
              type="text"
              defaultValue={data.avatar}
              onChange={(e) => changeHandler(e.target.value)}
            />
          </div>
          {isChange ? <input type="submit" value={"Change Avatar"} /> : null}
        </form>
      </div>
    </>
  );
};

export default ChangeAvatar;
