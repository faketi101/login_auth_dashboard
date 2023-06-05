import "./deviceManager.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { server_url } from "../../config/serverConfing";
import axios from "axios";
import { useCookies } from "react-cookie";
import Loading from "../pages/Loading";
const DeviceManager = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["auth"]);

  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);

      const url = `${server_url}/auth/devices`;
      let res = await axios.get(url, {
        headers: {
          Authorization: `${cookies.auth}`,
        },
      });
      if (res.data.success) {
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

  const updateHandler = async (type, id) => {
    try {
      setLoading(false);
      const url = `${server_url}/auth/devices/update`;
      let res = await axios.post(
        url,
        { type, id },
        {
          headers: {
            Authorization: `${cookies.auth}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setData(res.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong.");
    }
  };

  const Render = (d, i) => {
    return (
      <>
        <tr key={d._id}>
          <td>{i + 1}</td>
          <td>{d.ip}</td>
          <td>{d.address}</td>
          <td>{d.device}</td>
          <td
            className={`login_status ${d.status === "in" ? "logged_in" : null}`}
          >
            {d.status === "in"
              ? "Logged In"
              : d.status === "out"
              ? "Logged Out"
              : d.status === "expired"
              ? "DELETED"
              : "NA"}
          </td>
          <td>
            {new Date(
              parseInt(
                `${d.logout_time !== "in" ? d.logout_time : d.login_time}`
              )
            )
              .toUTCString()
              .replaceAll("/", "-")}
            <br />
            {d.updated}
          </td>
          <td className="actions">
            {d.status === "expired" || d.status === "out" ? null : (
              <button
                onClick={() => updateHandler("out", d._id)}
                title="Log out from this device"
                className="log_out"
              >
                Log Out
              </button>
            )}
            {d.status === "expired" ? null : (
              <button
                onClick={() => updateHandler("expired", d._id)}
                className="delete"
                title="Delet this device"
              >
                Delete
              </button>
            )}{" "}
          </td>
        </tr>
      </>
    );
  };

  return (
    <>
      {loading ? <Loading /> : null}

      <div id="device_manager">
        <h1>Device Manager</h1>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Login IP</th>
              <th>Address</th>
              <th>Name</th>
              <th>Status</th>
              <th>Last Update</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{data ? data.logins.map(Render) : null}</tbody>
        </table>
      </div>
    </>
  );
};

export default DeviceManager;
