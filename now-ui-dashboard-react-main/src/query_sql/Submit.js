import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
} from "reactstrap";

export class Submit extends Component {

    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    };

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    };

    render() {
        const { values, handleChange, csvs, button_state, domain, query_index } = this.props;
        console.log("submit domain:",domain);
        switch (button_state){
            case 0:
                return (
                    <Row>
                        <Col xs={12} md={8}>
                            <Card className="card-chart">
                                <CardHeader>
                                    <h5 className="card-category">SQL Query</h5>
                                    <CardTitle tag="h4">Done</CardTitle>
                                </CardHeader>
                                <Redirect
                                    to={{
                                        pathname: "/admin/icons",
                                        files: csvs,
                                        domain: domain,
                                        query_index: query_index,
                                        content: ""
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                );
            case 1:
                return (
                    <Row>
                        <Col xs={12} md={8}>
                            <Card className="card-chart">
                                <CardHeader>
                                    <h5 className="card-category">Filters</h5>
                                    <CardTitle tag="h4">Done</CardTitle>
                                </CardHeader>
                                <Redirect
                                    to={{
                                        pathname: "/admin/user-page",
                                        files: csvs,
                                        domain: domain,
                                        query_index: query_index
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                );
                case 2:
                    return (
                        <Row>
                            <Col xs={12} md={8}>
                                <Card className="card-chart">
                                    <CardHeader>
                                        <h5 className="card-category">SQL Query</h5>
                                        <CardTitle tag="h4">Done</CardTitle>
                                    </CardHeader>
                                    <Redirect
                                        to={{
                                            pathname: "/admin/NLP",
                                            files: csvs,
                                            domain: domain,
                                            query_index: query_index
                                        }}
                                        />
                                </Card>
                            </Col>
                        </Row>
                    );
        }
    }
}

export default Submit;