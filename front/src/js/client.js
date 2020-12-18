import React from "react";
import ReactDOM from "react-dom";
import Layout from "./pages/Layout";
import TimeLine from "./pages/TimeLine";
import Favorite from "./pages/Favorite";
import Home from './pages/Home';
import Result from './pages/Result';
import Setting from './pages/Setting';
import NotFound from './pages/NotFound';
import User from './pages/User';
import Post from './pages/PostDetail';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import History from './auth/History';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
const app = document.getElementById('app');

ReactDOM.render(
<Router>
    <History>
    <Layout>
    <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/timeline" component={TimeLine}></Route>
        <Route exact path="/favorite" component={Favorite}></Route>
        <Route path="/signin" component={SignIn}></Route>
        <Route path="/signup" component={SignUp}></Route>
        <Route exact path="/result" component={Result}></Route>
        <Route exact path="/setting" component={Setting}></Route>
        <Route path="/user" component={User}></Route>
        <Route path="/posts" component={Post}></Route>
        <Route path="/404" component={NotFound}/>
    </Switch>
    </Layout>
    </History>
</Router>
    , app);
