import React, { Component } from "react";
import { Route, Redirect, Switch, Link } from "react-router-dom";
import CurrentRates from "./CurrentRates";
import RateHistory from "./RateHistory";

class Home extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <Link className={"navbar-brand"} to={"#"}>
            Kursy walut
          </Link>
          <div id="navbarText" className="ml-auto">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className={"nav-link"} to={"/current-rates"}>
                  Aktualne kursy
                </Link>
              </li>
              <li className="nav-item">
                <Link className={"nav-link"} to={"/rate-history"}>
                  Historia kursów
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <Switch>
          <Redirect exact from="/" to="/current-rates" />
          <Route path="/current-rates" component={CurrentRates} />
          <Route path="/rate-history" component={RateHistory} />
        </Switch>
      </div>
    );
  }
}

export default Home;
