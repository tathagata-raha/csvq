import React, { Component } from 'react';
import "react-select-search/style.css";

import SelectSearch, {fuzzySearch} from 'react-select-search';

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

export class Csvdatasets extends Component{
    state = {
        select_csv: null,
    }
    continue = e => {
        e.preventDefault();
        this.props.nextStep();
        this.props.curr_csvs(this.state.select_csv);
    };
    continue_NLP = e => {
        e.preventDefault();
        this.props.nextStep();
        this.props.curr_csvs(this.state.select_csv);
        this.props.changeButtonNLP();
    }
    continue_filter = e => {
        e.preventDefault();
        this.props.nextStep();
        this.props.curr_csvs(this.state.select_csv);
        this.props.changeButtonFilter();
    };

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    };

    render() {
        const { selectedOption, handleChange, csvs, selectCSVs } = this.props;
        // console.log(csvs);
        return (
            <Row>
            <Col xs={12} md={12}>
                <Card className="card-chart">
                <CardHeader>
                    <h5 className="card-category">Table selection</h5>
                    <CardTitle tag="h4">Select CSV Datasets</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form inline>
                    <FormGroup>
                        <SelectSearch
                            options={csvs}
                            search={true}
                            multiple
                            filterOptions={fuzzySearch}
                            name = "select_csvs"
                            id = "select_csvs"
                            emptyMessage="Not found"
                            placeholder="Select CSVs"
                            onChange={(selected) => this.setState({select_csv:selected})}
                        />
                    </FormGroup>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={this.continue}
                        >SQL Query
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={this.continue_NLP}
                        >NLP query
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={this.continue_filter}
                        >Filters
                    </Button>
                    
                    </Form>
                </CardBody>
                </Card>
            </Col>
            </Row>
        );
    }
}

export default Csvdatasets;