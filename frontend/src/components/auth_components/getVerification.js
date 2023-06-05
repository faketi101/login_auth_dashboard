import { server_url } from "../../config/serverConfing";
import axios from "axios";

export const getVerification = async () => {
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  try {
    const url = `${server_url}/auth/verify`;

    let res = await axios.get(url, {
      headers: {
        Authorization: `${getCookie("auth")}`,
      },
    });
    if (res.data.success) {
      return res.data;
    } else {
      return false;
    }
  } catch (error) {
    // console.dir(error);
    return false;
  }
};
