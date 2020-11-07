//Univerisal Bulma CSS library
import 'bulma/css/bulma.min.css';

//React router dom for navigation
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

//Pages for each route
import Signup from './Components/Authentication/Signup';
import Login from './Components/Authentication/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/"></Route>
          <Route path="/signup">
            <Signup/>
          </Route>
          <Route path="/login">
            <Login/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
