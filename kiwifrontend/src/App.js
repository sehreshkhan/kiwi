import "./App.css";
import Doors from "./components/doors";
import Door from "./components/door";
import { Switch, Route, Link, Redirect } from "react-router-dom";

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <ul className="navbar-nav mr-auto">
          <li>
            <Link to="/" className="nav-link">
              Kiwi Doors Management System
            </Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/doors" component={Doors} />
        <Route path="/door/:id" component={Door} />
        <Redirect exact from="/" to="/doors" />
        <Redirect exact from="/post_permission/:data" to="/doors" />
        <Redirect exact from="/remove_permission/:data" to="/doors" />
      </Switch>
    </>
  );
}

export default App;
