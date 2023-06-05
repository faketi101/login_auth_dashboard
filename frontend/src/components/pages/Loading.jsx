import "./Loading.css";
import { SyncLoader, BarLoader } from "react-spinners";
const Loading = ({ text }) => {
  return (
    <div id="loading">
      <h1>
        {text || "Loading"}
        <span>
          <SyncLoader size={10} color="var(--white)" />
        </span>
      </h1>
      <BarLoader height={5} width={200} speedMultiplier={1.5} color="#537FE7" />
    </div>
  );
};

export default Loading;
