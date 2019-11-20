import React from "react";
import Dash from "./components/dash/Dash";
import { Switch, Route } from "react-router-dom";
import Login from "./components/profile/Login";
import Register from "./components/profile/Register";
import EditProfile from "./components/profile/EditProfile";
import Profile from "./components/profile/Profile";
import NewHammer from "./components/products/NewHammer";
import EditHammer from "./components/products/EditHammer";
import OneHammer from "./components/products/OneHammer";
import Cart from "./components/cart/Cart";

export default (
  <Switch>
    <Route exact path="/" component={Dash} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/edit-profile" component={EditProfile} />
    <Route path="/my-profile" component={Profile} />
    <Route path="/new-hammer" component={NewHammer} />
    <Route path="/edit-hammer" component={EditHammer} />
    <Route path="/one-hammer" component={OneHammer} />
    <Route path="/cart" component={Cart} />
  </Switch>
);
