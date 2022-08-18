import React from 'react';
import { Component } from "react";
import Csvdatasets from './Csvdatasets';
import Submit from './Submit';

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
    Input,
    Label,
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


export class Upload extends Component {

    state = {
        step: 0,
        selectedOption: null,
        domains_list: [],
        curr_domain: null,
        curr_csvs: null,
        button_state: 0,
        session_ind: 0,
        selectedFile: null,
        isFilePicked: false
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
    newupload = () => {
        this.setState({ step: 3 });
    }
    newdomain = () => {
        var domain = document.getElementById("newdomaininput").value
        if (domain != "") {
            console.log(domain)
            var config = {
                method: 'post',
                url: 'http://localhost:5000/add_domain',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { "domain": domain }
            };
            axios(config)
                .then((response) => {
                    alert("Domain added successfully")
                    const { step } = this.state;
                    this.setState({ step: step + 1 });
                    this.setState({ curr_domain: domain });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            alert("Domain is empty")
        }

    }
    // proceed to the next step
    nextStep = () => {
        const { step } = this.state;
        this.setState({ step: step + 1 });
    }

    handleUpload = (e) => {
        this.setState({ selectedFile: e.target.files[0] })
        this.setState({ isFilePicked: true })

    }

    handleUpload2 = (e) => {
        this.setState({ selectedFile: e.target.files[0] })
        this.setState({ isFilePicked: true })

    }

    uploadtable = (e) => {
        e.preventDefault();
        var nickname = document.getElementById('nickname').value
        var data = JSON.stringify({
            "domain": this.state.curr_domain,
            "fname": this.state.selectedFile.name,
            "nickname": nickname
        });
        console.log(data)
        var config = {
            method: 'post',
            url: 'http://localhost:5000/setupload',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config)
            .then((response) => {
                console.log(response)
                const data = new FormData();
                data.append('file', this.state.selectedFile);
                const Upload = async () => {
                    await fetch('http://localhost:5000/upload', {
                        method: 'POST',
                        body: data
                    }).then(resp => {
                        resp.json().then(data => { console.log(data) })
                    })
                }
                Upload();

                // var config = {
                //     method: 'post',
                //     url: 'http://localhost:5000/upload',
                //     body: data
                // };
                // axios(config)
                //     .then((response) => {
                //         console.log(response)
                //     })
                //     .catch(function (error) {
                //         console.log(error);
                //     });
            })
            .catch(function (error) {
                console.log(error);
            });
        // fetch('http://localhost:8000/uploadtable', {
        //     method: 'POST',
        //     body: data,
        //   }).then((response) => {
        //     response.json().then((body) => {
        //       this.setState({ imageURL: `http://localhost:8000/${body.file}` });
        //     });
        //   });

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
                                    <h5 className="card-category">Dataset and Table Upload</h5>
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
                                    </Form>
                                </CardBody>
                            </Card>
                            <Card className="card-chart">
                                <CardHeader>
                                    <CardTitle tag="h4">New Domain?</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Form inline>
                                        <FormGroup>
                                            <Input id="newdomaininput" />
                                        </FormGroup>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={this.newdomain}
                                        >Add domain</Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                );
            case 1:
                return (
                    <Row>
                        <Col xs={12} md={12}>
                            <Card className="card-chart">
                                <CardHeader>
                                    <h5 className="card-category">Dataset and Table Upload</h5>
                                    <CardTitle tag="h4">Upload Table</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <FormGroup>

                                            <input type="file" name="file" onChange={this.handleUpload} />
                                            <Button color="primary" type="submit" onClick={this.handleUpload}>Upload</Button>
                                            {
                                                this.state.isFilePicked ?
                                                    this.state.selectedFile.name :
                                                    null
                                            }
                                        </FormGroup>
                                        {
                                            this.state.isFilePicked ?
                                                <Form>
                                                    <FormGroup>
                                                        <Label>
                                                            Dataset nickname:
                                                        </Label>
                                                        <Input id="nickname" />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Button color="primary" type="submit" onClick={this.uploadtable}>Submit</Button>
                                                    </FormGroup>
                                                </Form>
                                                :
                                                null
                                        }

                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                );
            case 2:
                return <Submit onClick={this.submitClick} csvs={this.state.curr_csvs} button_state={this.state.button_state} domain={this.state.curr_domain} query_index={this.state.session_ind} />;
            case 3:
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
            default:
                (console.log('This is a multi-step form built with React.'))
        }
    }
}

export default Upload;