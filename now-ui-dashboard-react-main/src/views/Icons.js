
import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { Button } from "reactstrap";
import { Editor } from '../query_sql/Editor';


function Icons(props) {
  return (
    <>
      <PanelHeader content={
          <div className="header text-center">
            <h2 className="title">SQL Query</h2>
          </div>
        } />
      <div className="content">
        <Editor files={props.location.files} domain={props.location.domain} query_index={props.location.query_index} content={props.location.content}/>

      </div>

    </>
  );
}

export default Icons;
