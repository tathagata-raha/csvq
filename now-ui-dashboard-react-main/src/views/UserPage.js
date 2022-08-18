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
import React from "react";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import SQLfilters from "query_sql/filters";

function User(props) {
  return (
    <>
      <PanelHeader
        content={
          <div className="header text-center">
            <h2 className="title">Filters</h2>
          </div>
        }
      />
    
    <SQLfilters files={props.location.files} domain={props.location.domain} query_index={props.location.query_index}/>
    </>
  );
}

export default User;
