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
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import axios from 'axios';
import TablePreview from "./TablePreview";

import swal from 'sweetalert';

export class Editor extends Component {
    state = {
        query: this.props.content,
        cm_val: this.props.content,
        files: this.props.files,
        domain: this.props.domain,
        query_index: this.props.query_index + 1,
        thead: [],
        tbody: [],
        dhead: [],
        dbody: [],
        sug: [],
        showButton: false,
        dropdownOpen: false,
        showTable: false,
        showSuggestion: true,
        run_status: true
    };

    componentDidMount() {
        console.log(this.props)
        var data = JSON.stringify({
            "files": this.state.files
        });

        var config = {
            method: 'post',
            url: 'http://localhost:5000/sugggestions',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios(config)
            .then(response => {

                var res = response.data
                this.setState({"sug": res.sug})
                console.log(this.state.sug)
                // console.log(this.state.dbody)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    handleClick = async (flag) => {
        // const requestOptions = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': true },
        //     body: JSON.stringify({ query: this.state.query, files: this.state.files })
        // };
        // fetch('http://localhost:5000/sql_query', requestOptions)
        //     .then(response => response.json())
        // console.log("editor:", Array.prototype.concat.apply([], this.state.files));
        console.log(this.state.files);
        var data = JSON.stringify({
            "query": this.state.query,
            "files": Array.prototype.concat.apply([], this.state.files),
            "domain": this.state.domain,
            "q_index": this.state.query_index,
            "query_type": 1
        });

        console.log(data);
        console.log(this.state.domain);

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
                if(res.hasOwnProperty('error')){
                 console.log(res.error); 
                 swal(res.error, "Try to correct your query", "error");
                }
                else
                {
                    this.setState({ thead: res.thead });
                    this.setState({ tbody: res.tbodys });
                    this.setState({ showTable: true});
                    if (flag)
                    {
                        this.setState({ run_status: false});
                        this.setState({ showButton: true})
                    }
                    else
                        this.setState({ showButton: false})
                    console.log(data);
                    if (this.state.preview == 0) {
                        this.setState({ title: "Output" })
                    }
                    this.setState({ "preview": 0 });
                    console.log(this.state.tbody)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    handlePreview = (name) => {
        this.setState({ run_status: true });
        this.setState({ "query": "SELECT * FROM " + name });
        this.setState({ "files": [name] });
        this.setState({ title: "Preview of " + name })
        this.setState({ "preview": 1 });
        this.setState({ run_status: true});
        this.setState({ showButton: false});
        this.handleClick(0);

    }
    handleDataType = (name) => {
        var filename = '';
        if (typeof name === 'string')
            filename = name
        else
            filename = name[0]

        console.log(filename, name.length);
        var data = JSON.stringify({
            "file": filename,
            "domain": this.state.domain
        });

        var config = {
            method: 'post',
            url: 'http://localhost:5000/datatype',
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
                this.setState({ title: "Data types of " + name })
                this.setState({ showButton: false});
                this.setState({ showTable: true});
                this.setState({ run_status: true });
                // console.log(this.state.dbody)
            })
            .catch(function (error) {
                console.log(error);
            });
        console.log("data type " + name)
    }
    update_sug = (e) => {
        e.preventDefault();
        console.log(e.target.textContent)
        this.setState({cm_val: e.target.textContent})
        this.setState({query: e.target.textContent})
    }
    reSQL = () => {
        this.setState({ files: ["Table_"+this.state.query_index]});
        this.setState({ cm_val: 'select * from Table_'+this.state.query_index});
        this.setState({ query: ''});
        this.setState({ query_index: this.state.query_index+1 });
        this.setState({ showButton: false});
        this.setState({ showTable: false});
        this.setState({ dropdownOpen: false});
        this.setState({ run_status: true});
        this.setState({showSuggestion: false})
        this.setState({toggle: false})
    }
    render() {
        return (
            <div className="content">
                <Row>

                    <Col xs={12} md={8}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Write your SQL query here</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <CodeMirror
                                    value={this.state.cm_val}
                                    height="300px"
                                    extensions={[sql()]}
                                    onChange={(value, viewUpdate) => {
                                        this.state.query = value;
                                    }}
                                />
                                <Button color="success" className="btn-round" onClick={this.handleClick} disabled={!this.state.run_status}>
                                    <i className="now-ui-icons media-1_button-play"></i> Run query
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Files chosen</CardTitle>
                            </CardHeader>
                            <CardBody>
                                {this.state.files.map((name, index) => {
                                    return (
                                        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                            <DropdownToggle caret>
                                                {name}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => this.handlePreview(name)}>Preview</DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem onClick={() => this.handleDataType(name)}>Data types</DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    )
                                })}

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                {this.state.showTable ?
                    <TablePreview thead={this.state.thead} tbody={this.state.tbody} tabletitle={this.state.title} showButton={this.state.showButton} domain={this.state.domain} query_index={this.state.query_index} reDo={this.reSQL} type={1} />
                    : null}
                {this.state.showSuggestion ?
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4">Sugggestions:</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {this.state.sug.map((item) => <Card value={item} key={item} onClick={this.update_sug}><CardBody>{item[0]}</CardBody></Card>)}
                    </CardBody>
                </Card>
                : null}
            </div>
        )
    }
}

export default Editor;