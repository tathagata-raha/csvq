import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";

import axios from 'axios';

// import "react-select-search/style.css";

// import SelectSearch, {fuzzySearch} from 'react-select-search';

import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Input,
    Row,
    Col,
    Button,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Form,
    FormGroup,
    ListGroup,
    ListGroupItem,
} from "reactstrap";

// const fields = [
//     'id',
//     'city',
//     'date',
//     'player_of_match',
//     'value',
//     'natural_venue',
//     'team1',
//     'team2',
//     'toss_winner',
//     'toss_decision',
//     'winner',
//     'result',
//     'result_margin',
//     'eliminator'
// ]
import TablePreview from "./TablePreview";
import { throws } from 'assert';

const customStyles = {
    control: base => ({
        ...base,
        height: 100,
        minHeight: 100
    })
};


export class SQLfilters extends Component {
    state = {
        select_csv: Array.prototype.concat.apply([], this.props.files)[0],
        domain: this.props.domain,
        query_index: this.props.query_index + 1,
        fields: [],
        thead: [],
        tbody: [],
        title: "Output",
        showTable: false,
        showButton: false,
        dropdownOpen: false,
        endlistflag: 1,
        run_status: true
    };
    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    componentDidMount() {
        var data = JSON.stringify({
            "query": "SELECT * FROM " + this.state.select_csv,
            "files": [this.state.select_csv],
            "domain": this.state.domain,
            "q_index": this.state.query_index,
            "query_type": 0
        });
        var col_config = {
            method: 'post',
            url: 'http://localhost:5000/sql_query',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }
        axios(col_config)
            .then((response) => {
                this.setState({ fields: response.data.thead });
                console.log(response.data.thead);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    continue = e => {
        e.preventDefault();
        this.props.nextStep();
        this.props.curr_csvs(this.state.select_csv);
    };

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    };

    reFilter = () => {
        this.setState({ select_csv: "Table_" + this.state.query_index });
        this.setState({ query_index: this.state.query_index + 1 });
        this.setState({ showButton: false });
        this.setState({ showTable: false });
        this.setState({ dropdownOpen: false });
        this.setState({ run_status: true});
        document.getElementById('sql_filter_query').value = '';
    }

    update_button_value = (e) => {
        e.preventDefault();
        console.log(e.target.getAttribute('value'));
        var sign = e.target.getAttribute('value')
        var text = document.getElementById('sql_filter_query').value;
        if (sign == "IN") {
            document.getElementById('sql_filter_query').value = text + " " + e.target.getAttribute('value') + " [ ";
            this.setState({endlistflag: 0})
        }
        else {
            document.getElementById('sql_filter_query').value = text + " " + e.target.getAttribute('value');
        }
    }

    remove_last_value = () => {
        var text = document.getElementById('sql_filter_query').value;
        console.log("remove", text);
        text = text.split(' ');
        text.pop();
        document.getElementById('sql_filter_query').value = text.join(' ');
    }
    update_column_value = (e) => {
        e.preventDefault();
        var input_text = document.getElementById('column_value').value;
        console.log(input_text);
        var text = document.getElementById('sql_filter_query').value;
        if (this.state.lasttype == "object") {
            document.getElementById('sql_filter_query').value = text + " '" + input_text + "'";
        }
        else {
            document.getElementById('sql_filter_query').value = text + " " + input_text;
        }
        if (this.state.endlistflag == 0){
            var text = document.getElementById('sql_filter_query').value;
            document.getElementById('sql_filter_query').value = text + " ,"
        }
    }
    endlist = () =>{
        
        this.remove_last_value();
        var text = document.getElementById('sql_filter_query').value;
        document.getElementById('sql_filter_query').value = text + " ] ";
        this.setState({endlistflag: 1})
    }
    execute = (e) => {
        e.preventDefault();
        var text = document.getElementById('sql_filter_query').value;
        // alert(this.state.lasttype)
        var data = JSON.stringify({
            "file": this.state.select_csv,
            "cql": text,
            "domain": this.state.domain,
            "q_index": this.state.query_index
        });
        console.log("Field value updated")
        var config = {
            method: 'post',
            url: 'http://localhost:5000/filter',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios(config)
            .then(response => {
                console.log(response.data)
                var res = response.data
                if(res.hasOwnProperty('error')){
                 console.log(res.error); 
                 swal(res.error, "Try to correct your filters", "error");
                }
                else{
                this.setState({ thead: res.thead })
                this.setState({ tbody: res.tbodys })
                this.setState({ showButton: true })
                this.setState({ showTable: true })
                this.setState({ run_status: false});
                console.log(this.state.thead)
                console.log(this.state.tbody)
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    update_field_value = (e) => {
        e.preventDefault();
        console.log(e.target.getAttribute('value'));
        var input_text = e.target.getAttribute('value');
        var text = document.getElementById('sql_filter_query').value;
        document.getElementById('sql_filter_query').value = text + " " + e.target.getAttribute('value');
        var data = JSON.stringify({
            "file": this.state.select_csv,
            "col": input_text,
            "domain": this.state.domain
        });
        console.log("Field value updated")
        var config = {
            method: 'post',
            url: 'http://localhost:5000/datatype_col',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios(config)
            .then(response => {

                var res = response.data
                this.setState({ lasttype: res[0] })
                console.log(this.state.lasttype)
            })
            .catch(function (error) {
                console.log(error);
            });
        console.log("data type " + name)
    }
    render() {



        // console.log(csvs);
        return (
            <Card className="card-chart">
                <CardHeader>
                    <h1 className="card-category text-center font-weight-bold text-dark">SQL Filters</h1>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs={12} md={12}>
                            <Row>
                                <Col xs={12} md={12}>
                                    <Row>
                                        <Col xs={6} md={6}>
                                            <Card className="card-chart h-80">
                                                <CardHeader>
                                                    <h5 className="card-category text-dark">Fields</h5>
                                                </CardHeader>
                                                <CardBody style={customStyles}>
                                                    <ListGroup className='overflow-scroll'>
                                                        {this.state.fields.map((item) => <ListGroupItem className='py-1' onClick={this.update_field_value} value={item} key={item}>{item}</ListGroupItem>)}
                                                    </ListGroup>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <Card className="card-chart h-50">
                                                <CardHeader>
                                                    <h5 className="card-category text-dark">Values</h5>
                                                </CardHeader>
                                                <CardBody>
                                                    <Input
                                                        id="column_value"
                                                        name="column_value"
                                                        type="text"
                                                    />
                                                    <Button className='btn-success' onClick={this.update_column_value}>Input</Button>
                                                    <Button className='btn-success' onClick={this.endlist} disabled={this.state.endlistflag}>End List</Button>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} md={12}>
                                    <Card className="card-chart">
                                        <CardHeader>
                                            <h5 className="card-category text-dark">Operators</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Button onClick={this.update_button_value} id="equals" value="EQUAL_TO">EQUAL_TO</Button>
                                            <Button onClick={this.update_button_value} id="less_than" value="LESS_THAN">LESS_THAN</Button>
                                            <Button onClick={this.update_button_value} id="greater_than" value="GREATER_THAN">GREATER_THAN</Button>
                                            {/* <Button onClick={this.update_button_value} id="like" value="LIKE">LIKE</Button> */}
                                            {/* <Button onClick={this.update_button_value} id="percent" value="%">%</Button> */}
                                            <Button onClick={this.update_button_value} id="in" value="IN">IN</Button>
                                            <Button onClick={this.update_button_value} id="not_in" value="NOT_IN">NOT</Button>
                                            {/* <Button onClick={this.update_button_value} id="ilike" value="ILIKE">ILIKE</Button> */}
                                            <Button onClick={this.update_button_value} id="greater_equal" value="GREATER_OR_EQUAL_TO">GREATER_OR_EQUAL_TO</Button>
                                            <Button onClick={this.update_button_value} id="less_equal" value="LESS_OR_EQUAL_TO">LESS_OR_EQUAL_TO</Button>
                                            <Button onClick={this.update_button_value} id="not_equal" value="NOT_EQUAL_TO">NOT_EQUAL_TO</Button>
                                            <Button onClick={this.update_button_value} id="and" value="AND">AND</Button>
                                            <Button onClick={this.update_button_value} id="or" value="OR">OR</Button>
                                            <Button onClick={this.update_button_value} id="left" value="(">(</Button>
                                            <Button onClick={this.update_button_value} id="right" value=")">)</Button>
                                            <Button onClick={this.remove_last_value} id="backspace" value="">Backspace</Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} md={12}>
                                    <Card className="card-chart">
                                        <CardHeader>
                                            <h5 className="card-category text-dark">SQL Filter expression</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Input
                                                id="sql_filter_query"
                                                name="sql_filter_query"
                                                type="textarea"
                                                value={this.state.value}
                                                readOnly
                                                className='text-black bg-white'
                                                style={{ fontSize: 15 }}
                                            />
                                        </CardBody>
                                        <Button className='btn-success' onClick={this.execute} disabled={!this.state.run_status}>Execute</Button>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {this.state.showTable ?
                        <TablePreview thead={this.state.thead} tbody={this.state.tbody} tabletitle={this.state.title} showButton={this.state.showButton} domain={this.state.domain} query_index={this.state.query_index} reDo={this.reFilter} type={3} />
                        : null}
                </CardBody>
            </Card>
        );
    }
}

export default SQLfilters;