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
import React,{useState} from "react";

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Row,
    Input,
    Col,
  } from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import NLU from "query_sql/nlu";


function NLP(props) {
  return (
    <>
      <PanelHeader
        content={
          <div className="header text-center">
            <h2 className="title">Natural Language Query</h2>
          </div>
        }
      />

   <NLU files={props.location.files} domain={props.location.domain} query_index={props.location.query_index}/>
    </>
  );
}

export default NLP;
