import "./NotFound.css";
import {Link} from "react-router-dom"
import {BarLoader} from "react-spinners"
const NotFound = () => {
  return (
    <div id="not_found">
        <BarLoader color="var(--primary)" />
      <h1>Page <span>Not</span> Found</h1>
      <Link to="/">Return Home</Link>
    </div>
  );
};

export default NotFound;
