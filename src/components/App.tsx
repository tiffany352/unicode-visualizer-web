/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  RouteComponentProps
} from "react-router-dom";
import "./App.css";
import Input from "./Input";
import Index from "./Pages/Index";
import Inspect from "./Pages/Inspect";
import Codepoint from "./Pages/Codepoint";
import BlockList from "./Pages/BlockList";
import BlockInfo from "./Pages/BlockInfo";
import Sequences from "./Pages/Sequences";

function NotFound(props: RouteComponentProps) {
  return (
    <div className="App-content">
      <div className="App-contentContainer">
        <h2>Not found</h2>
        <p>
          The path <code>{props.location.pathname}</code> doesn't exist.
        </p>
      </div>
    </div>
  );
}

class App extends Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <div className="App-header">
            <Link to="/" className="App-logo">
              Home
            </Link>
            <Input />
          </div>
          <Switch>
            <Route path="/" exact component={Index} />
            <Route path="/inspect/:blob" component={Inspect} />
            <Route path="/codepoint/u+:code" component={Codepoint} />
            <Route path="/browse/blocks" component={BlockList} />
            <Route path="/browse/sequences" component={Sequences} />
            <Route path="/block/:blockName" component={BlockInfo} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
