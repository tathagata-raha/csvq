import React from 'react';
import { Component } from "react";
import Csvdatasets from './Csvdatasets';
import Submit from './Submit';
import Upload from './Upload';

import SelectSearch, { fuzzySearch } from 'react-select-search';
import "react-select-search/style.css";
import axios from 'axios';

import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
    Button,
    Form,
    FormGroup,
} from "reactstrap";

// const domains_list = [
//     { value: 'db', name: 'db' },
// ];
var domain_config = {
    method: 'post',
    url: 'http://localhost:5000/list_domains',
    headers: {
        'Content-Type': 'application/json'
    },
    data: { "domain": "db" }
};


export class Domains extends Component {
    state = {
        step: 0,
        selectedOption: null,
        domains_list: [],
        curr_domain: null,
        curr_csvs: null,
        button_state: 0,
        session_ind: 0,
    };

    componentDidMount() {
        var clear_config = {
            method: 'post',
            url: 'http://localhost:5000/clear',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {}
        };
        axios(clear_config)
            .then()
            .catch(function (error) {
                console.log(error);
            });
        this.setState({ session_ind: 0 })
        axios(domain_config)
            .then((response) => {
                let folders = response.data.folders;
                var domains = folders.map(x => {
                    return ({ value: x.value, name: x.name });
                })
                this.setState({ domains_list: domains });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    handleChange = (selectedOption) => {
        this.setState({ selectedOption }, () =>
            console.log(`Option selected:`, this.state.selectedOption)
        );
    };

    selectCSVs = (csvs) => {
        this.setState({ curr_csvs: csvs });
        // console.log(this.state.curr_csvs);
    }

    changeButtonFilter = () => {
        this.setState({ button_state: 1 });
        // console.log("In Domain:  ",this.state.button_state);
    }

    changeButtonNLP = () => {
        this.setState({ button_state: 2 });
        // console.log("In Domain:  ",this.state.button_state);
    }

    // go back to previous step
    prevStep = () => {
        const { step } = this.state;
        this.setState({ step: step - 1 });
    }
    upload = () => {
        this.setState({ step: 3 });
    }
    // proceed to the next step
    nextStep = () => {
        const { step } = this.state;
        this.setState({ step: step + 1 });
        var csv_config = {
            method: 'post',
            url: 'http://localhost:5000/list_csv',
            headers: {
                'Content-Type': 'application/json'
            },
            data: { "folder": "db/".concat(this.state.curr_domain) }
        };
        axios(csv_config)
            .then((response) => {
                let ds = response.data.files;
                var csvs = ds.map(x => {
                    return ({ value: x.value, name: x.name });
                })
                this.setState({ values: csvs });
                // console.log(this.state.values)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const { step } = this.state;
        const { selectedOption } = this.state;
        const values = { selectedOption };

        switch (step) {
            case 0:
                return (
                    <Row>
                        <Col xs={12} md={12}>
                            <Card className="card-chart">
                                <CardHeader>
                                    <h5 className="card-category">Dataset and Table Selection</h5>
                                    <CardTitle tag="h4">Select Domain</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Form inline>
                                        <FormGroup>
                                            <SelectSearch
                                                options={this.state.domains_list}
                                                search
                                                filterOptions={fuzzySearch}
                                                name="select_domain"
                                                id="select_domain"
                                                emptyMessage="Not found"
                                                placeholder="Select Domain"
                                                onChange={(selected) => this.setState({ curr_domain: selected })}
                                            />
                                        </FormGroup>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={this.nextStep}
                                        >Next</Button>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={this.upload}
                                        >Upload Dataset</Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                );
            case 1:
                return (
                    <Csvdatasets
                        nextStep={this.nextStep}
                        handleChange={this.handleChange}
                        csvs={this.state.values}
                        curr_csvs={this.selectCSVs}
                        changeButtonFilter={this.changeButtonFilter}
                        changeButtonNLP={this.changeButtonNLP}
                    />
                );
            case 2:
                return <Submit onClick={this.submitClick} csvs={this.state.curr_csvs} button_state={this.state.button_state} domain={this.state.curr_domain} query_index={this.state.session_ind} />;
            case 3:
                return (
                    <Upload/>
                );
            default:
                (console.log('This is a multi-step form built with React.'))
        }
    }
}

export default Domains;