import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
//import { ProductInfo } from "../../";
import Header from "./Header";
import NavBar from "./NavBar";
import Example from "./Example";
import Views from "./Views";

import "./App.css";

const App = () => {
  const [view, setView] = useState(Views.MAP);

  return (
    <Router>
      <div className="App">
        <Header view={view} onViewChange={setView} />
        <div className="App__main">
          <NavBar />
          <Route path={`${process.env.PUBLIC_URL}/:example?`}>
            <Example view={view} />
          </Route>
        </div>
      </div>
    </Router>
  );
};

export default App;
