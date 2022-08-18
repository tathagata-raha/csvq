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
// react plugin used to create charts
import {Domains} from '../query_sql/Domains';

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";


/**
 * The initial guide/tutorial using sweetalert.
 */

function Dashboard() {
  
  return (
    <>
      {/* <PanelHeader
        size="lg"
        content={
          <Line
            data={dashboardPanelChart.data}
            options={dashboardPanelChart.options}
          />
        }
      /> */}
      <PanelHeader size="sm" />
      <div className="content">
        <Domains />
      </div>
    </>
  );
}

export default Dashboard;
