import { useState } from "react";
import { toast } from "react-toastify";
import "./changePass.css";
import { server_url } from "../../config/serverConfing";
import axios from "axios";
import { useCookies } from "react-cookie";
import Loading from "../pages/Loading";
let types = {
  prePass: "password",
  newPass: "password",
  conNewPass: "password",
};
const initState = {
  prePass: "",
  newPass: "",
  conNewPass: "",
};
const ChangePassword = () => {
  const [cookies] = useCookies(["auth"]);
  const [loading, setLoading] = useState(false);
  const [preType, setPretype] = useState([types]);
  const [formData, setFormData] = useState(initState);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!formData.prePass) {
      toast.error("Previous Password Must be filled.");
      return;
    }
    if (!formData.newPass) {
      toast.error("New Password Must be filled.");
      return;
    }
    if (!formData.conNewPass) {
      toast.error("Confirm New Password Must be filled.");
      return;
    }
    if (formData.newPass !== formData.conNewPass) {
      toast.error("New Password and Confirm New Password not matched.");
      return;
    }
    setLoading(true);

    const url = `${server_url}/auth/change_password`;
    try {
      let res = await axios.post(url, formData, {
        headers: {
          Authorization: `${cookies.auth}`,
        },
      });

      if (res.data.success) {
        toast.success("Password has been changed.");
        setFormData(initState);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      toast.error(error.response.data.message);
    }
  };

  function toggle_passview(e, name) {
    const target = e.target;
    const show_cls = "fa-eye";
    const hide_cls = "fa-eye-low-vision";
    if (target.classList.contains(show_cls)) {
      target.classList.remove(show_cls);
      target.classList.add(hide_cls);
      setPretype({ ...preType, [name]: "password" });
    } else if (target.classList.contains(hide_cls)) {
      target.classList.remove(hide_cls);
      target.classList.add(show_cls);
      setPretype({ ...preType, [name]: "text" });
    }
  }

  return (
    <>
      {loading ? <Loading /> : null}
      <div id="change_pass">
        <h1>Change Password</h1>
        <div className="change_pass_form">
          <form onSubmit={submitHandler}>
            <div className="chng_pass_inp">
              <input
                placeholder="Previous Password"
                type={preType.prePass || "password"}
                className="change_pass_inp"
                name="previous_password"
                value={formData.prePass}
                onChange={(e) =>
                  setFormData({ ...formData, prePass: e.target.value })
                }
              />
              <i
                title="Toggle Show Password"
                onClick={(e) => toggle_passview(e, "prePass")}
                className="fa-solid fa-eye-low-vision show_pass"
              />
            </div>
            <div className="chng_pass_inp">
              <input
                placeholder="New Password"
                type={preType.newPass || "password"}
                className="change_pass_inp"
                name="new_password"
                value={formData.newPass}
                onChange={(e) =>
                  setFormData({ ...formData, newPass: e.target.value })
                }
              />
              <i
                title="Toggle Show Password"
                onClick={(e) => toggle_passview(e, "newPass")}
                className="fa-solid fa-eye-low-vision show_pass"
              />
            </div>
            <div className="chng_pass_inp">
              <input
                placeholder="Confirm Password"
                type={preType.conNewPass || "password"}
                className="change_pass_inp"
                name="confirm_new_password"
                value={formData.conNewPass}
                onChange={(e) =>
                  setFormData({ ...formData, conNewPass: e.target.value })
                }
              />
              <i
                title="Toggle Show Password"
                onClick={(e) => toggle_passview(e, "conNewPass")}
                className="fa-solid fa-eye-low-vision show_pass"
              />
            </div>
            <input
              type="submit"
              defaultValue="Submit"
              className="change_pass_submit"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
