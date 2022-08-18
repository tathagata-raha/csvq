import { Component } from "react";
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
import axios from 'axios';
import TablePreview from "./TablePreview";

export class FileList extends Component {
    state = {
        files: this.props.files,
    };
    handleClick = () => {
        // const requestOptions = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': true },
        //     body: JSON.stringify({ query: this.state.query, files: this.state.files })
        // };
        // fetch('http://localhost:5000/sql_query', requestOptions)
        //     .then(response => response.json())
        var data = JSON.stringify({
            "query": this.state.query,
            "files": this.state.files
        });

        var config = {
            method: 'post',
            url: 'http://localhost:5000/sql_query',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios(config)
            .then(response => {
                var res = response.data
                this.setState({ thead: res.thead })
                this.setState({ tbody: res.tbodys })
                console.log(this.state.thead)
            })
            .catch(function (error) {
                console.log(error);
            });


    }
    render() {
        return (
            <Col xs={12} md={4}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Files chosen</CardTitle>
                            </CardHeader>
                            <CardBody>
                                
                            </CardBody>
                        </Card>
                    </Col>

        )
    }
}

export default FileList;