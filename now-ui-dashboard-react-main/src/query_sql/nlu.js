import React from 'react';
import { Component } from "react";
import { Redirect, Link } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Input,
  Button,
  Form,
  FormGroup,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import axios from 'axios';
import TablePreview from "./TablePreview";

export class NLU extends Component {
  state = {
    query: "",
    cm_val: "",
    files: this.props.files,
    domain: this.props.domain,
    query_index: this.props.query_index + 1,
    thead: [],
    tbody: [],
    dhead: [],
    dbody: [],
    showButton: false,
    dropdownOpen: false,
    showTable: false,
    input: '',
    flag: 1
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  recordText = (text) => {
    this.setState({ input: text })
  }

  sendText = () => {
    var input_text = document.getElementById('nlu_value').value;
    this.setState({ input: input_text })
    console.log(input_text)
    var data = JSON.stringify({
      "query": this.state.input,
      "files": this.state.files,
      "domain": this.state.domain,
      "q_index": this.state.query_index
    });
    var text_config = {
      method: 'post',
      url: 'http://localhost:5000/nlu',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios(text_config)
      .then((response) => {
        let csvs = response.data.sql_query;
        this.setState({ sql_query: csvs });
        console.log(this.state.sql_query)
        this.setState({ flag: 0 });
        // console.log(this.state.values)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <h4 className="title">Enter Natural Language Query</h4>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Text Query</label>
                        <Input
                          id="nlu_value"
                          cols="100"
                          defaultValue="Enter text query on selected tables"
                          placeholder="For example, Which matches were held in Mumbai?"
                          rows="2"
                          type="text"
                        />
                      </FormGroup>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={this.sendText}>Search</Button>
                      <Link to={{
                        pathname: "/admin/icons",
                        files: this.state.files,
                        domain: this.state.domain,
                        query_index: this.state.query_index,
                        content: this.state.sql_query
                      }}>
                        <Button
                          color="primary"
                          variant="contained"
                          disabled={this.state.flag}>SQL Editor</Button>
                      </Link>

                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>

        </Row>
        {this.state.showTable ?
          <TablePreview thead={this.state.thead} tbody={this.state.tbody} tabletitle={this.state.title} showButton={this.state.showButton} domain={this.state.domain} query_index={this.state.query_index} reDo={this.reSQL} type={1} />
          : null}
      </div>


    )
  }
}

export default NLU;