import React from "react";
import ReactDOM from "react-dom";
import Layout from "./pages/Layout";
import TimeLine from "./pages/TimeLine";
import Favorite from "./pages/Favorite";
import Home from './pages/Home';
import Result from './pages/Result';
import Setting from './pages/Setting';
import NotFound from './pages/NotFound';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
const app = document.getElementById('app');
ReactDOM.render(
    <Router>
        <Layout>
        <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/timeline" component={TimeLine}></Route>
            <Route exact path="/favorite" component={Favorite}></Route>
            <Route exact path="/result" component={Result}></Route>
            <Route exact path="/setting" component={Setting}></Route>
            <Route component={NotFound}/>
        </Switch>
        </Layout>
    </Router>
    , app);