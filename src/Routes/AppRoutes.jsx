import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes";
import Home from "../components/Home/Home";
import SCSSMasterclass from "../components/SCSSMasterclass/SCSSMasterclass.jsx";
import CSSMasterclass from "../components/CSSMasterclass/CSSMasterclass.jsx";
import HTMLCSSMasterclass from "../components/HTMLCSSMasterClass/HTMLCSSMasterClass.js";
import BootstrapMasterclass from "../components/BootstrapMasterclass/BootstrapMasterclass.jsx";


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
