import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes";
import Home from "../components/Home/Home";
import SCSSMasterclass from "../components/SCSSMasterclass/SCSSMasterclass.jsx";
import CSSMasterclass from "../components/CSSMasterclass/CSSMasterclass.jsx";
import HTMLMasterclass from "../components/HTMLCSSMasterClass/HTMLMasterclass.jsx";
import BootstrapMasterclass from "../components/BootstrapMasterclass/BootstrapMasterclass.jsx";
import MongoDBMasterclass from "../components/MongoDBMasterclass/MongoDBMasterclass.jsx";
import ReactMasterclass from "../components/ReactMasterclass/ReactMasterclass.jsx";
import NodeJSMasterclass from "../components/NodeJSMasterclass/NodeJSMasterclass.jsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.HTML_CSS_PAGE} element={<HTMLMasterclass />} />
        <Route path={ROUTES.CSS_PAGE} element={<CSSMasterclass />} />
        <Route path={ROUTES.SCSS_PAGE} element={<SCSSMasterclass />} />
        <Route
          path={ROUTES.BOOTSTRAP_PAGE}
          element={<BootstrapMasterclass />}
        />
        <Route
          path={ROUTES.MONGO_PAGE}
          element={<MongoDBMasterclass />}
        />
        <Route
          path={ROUTES.REACT_PAGE}
          element={<ReactMasterclass />}
        />
        <Route
          path={ROUTES.NODE_PAGE}
          element={<NodeJSMasterclass />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
