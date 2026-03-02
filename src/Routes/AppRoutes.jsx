import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes";
import Home from "../components/Home/Home";
import CSSMasterclass from "../components/CSSMasterclass/CSSMasterclass";
import SCSSMasterclass from "../components/SCSSMasterclass/SCSSMasterClass";
import BootstrapMasterclass from "../components/BootstrapMasterclass/BootstrapMasterclass";
import HTMLCSSMasterclass from "../components/CSSMasterclass/HTMLCSSMasterClass";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.HTML_CSS_PAGE} element={<HTMLCSSMasterclass />} />
        <Route path={ROUTES.CSS_PAGE} element={<CSSMasterclass />} />
        <Route path={ROUTES.SCSS_PAGE} element={<SCSSMasterclass />} />
        <Route
          path={ROUTES.BOOTSTRAP_PAGE}
          element={<BootstrapMasterclass />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
