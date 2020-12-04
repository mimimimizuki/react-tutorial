import React from "react";
import ReactDOM from "react-dom";
import Layout from "./pages/Layout";
import TimeLine from "./pages/TimeLine";
import Favorite from "./pages/Favorite";
import Home from './pages/Home';
import Result from './pages/Result';
import { BrowserRouter as Router, Route } from "react-router-dom";
const app = document.getElementById('app');
ReactDOM.render(
    <Router>
        <Layout>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/timeline" component={TimeLine}></Route>
            <Route exact path="/favorite" component={Favorite}></Route>
            <Route exact path="/result" component={Result}></Route>
        </Layout>
    </Router>
    , app);