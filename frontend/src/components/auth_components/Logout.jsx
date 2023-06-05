import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { server_url } from "../../config/serverConfing";
import axios from "axios";
import Loading from "../pages/Loading";

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);

  const getLogout = async () => {
    try {
      if (!cookies.auth) {
        return navigate("/");
      }
      setLoading(true);
      const url = `${server_url}/auth/logout`;
      let res = await axios.get(url, {
        headers: {
          Authorization: `${cookies.auth}`,
        },
      });

      if (res.data.success) {
        setLoading(false);

        removeCookie("auth");
        toast.warning(res.data.message);
        navigate("/");
      }
    } catch (error) {
      setLoading(false);

      // console.log(error);
      navigate("/");
      return toast.error("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    getLogout();
  }, []);
  return (
    <>
      {loading ? <Loading /> : null}
      <div>Logging out...</div>
    </>
  );
};

export default Logout;
