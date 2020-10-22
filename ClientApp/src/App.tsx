import * as React from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import { LinesOfCredit } from "./components/LinesOfCredit";

import { Clients } from "./components/Clients";
import { Creditors } from "./components/Creditors";

import "./custom.css";

export default () => (
  <Layout>
    <Route exact path="/" component={Home} />
    <Route path="/linesofcredit" component={LinesOfCredit} />
    <Route path="/clients" component={Clients} />
    <Route path="/creditors" component={Creditors} />
  </Layout>
);
