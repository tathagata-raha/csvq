/*!

=========================================================
* Now UI Dashboard React - v1.5.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import NLP from "views/NLP.js";
import Icons from "views/Icons.js";
import UserPage from "views/UserPage.js";
import SignIn from "views/signin.js";


var dashRoutes = [
  {
    path: "/sql_query",
    name: "Wizard",
    icon: "business_bulb-63",
    component: Dashboard,
    layout: "/admin",
  },
  
  {
    path: "/icons",
    name: "SQL Query",
    icon: "tech_laptop",
    component: Icons,
    layout: "/admin",
  },
  {
    path: "/NLP",
    name: "Natural Language Query",
    icon: "text_caps-small",
    component: NLP,
    layout: "/admin",
  },
  {
    path: "/user-page",
    name: "Filters",
    icon: "ui-1_check",
    component: UserPage,
    layout: "/admin",
  },
  
];
export default dashRoutes;
