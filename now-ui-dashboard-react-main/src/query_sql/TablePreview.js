import { Component } from "react";
import { Redirect, Link } from "react-router-dom";

import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
    Table,
    Button,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Form,
    FormGroup,
} from "reactstrap";
import axios from 'axios';

import swal from 'sweetalert';
// import { thead, tbody } from "variables/general";

export class TablePreview extends Component {
    state = {
        dropdownOpen: false,
        domain: this.props.domain,
        query_index: this.props.query_index,
        type: this.props.type
    };
    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    makeid = (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
    download = () => {
        var data = JSON.stringify({
            "file": "Table_" + this.state.query_index,
            "domain": this.state.domain
        });
        var col_config = {
            method: 'post',
            url: 'http://localhost:5000/setdownload',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }
        axios(col_config)
            .then((response) => {
                // this.setState({ fields: response.data.thead });

                if (response.data.download_set == "Success") {
                    var durl = "http://localhost:5000/download"
                    axios.get(durl)
                        .then(res => {
                            console.log(res)
                            return new Blob([res.data], {
                                type: 'text/plain'
                            });

                        })
                        .then((blob) => {
                            const href = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = href;
                            link.setAttribute('download', 'output.csv'); //or any other extension
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        })
                        .catch((err) => {
                            return Promise.reject({ Error: 'Something Went Wrong', err });
                        })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    linkModal = () => {
        var link =  this.makeid(Math.floor(Math.random() * 10) + 1);
        var showLink = "http://localhost:5000/start_download/?str="+link
        var data = JSON.stringify({
            "str": link,
            "file": "db/"+this.state.domain+"/Table_" + this.state.query_index+".csv"
        });
        var dwn_config = {
            method: 'post',
            url: 'http://localhost:5000/set_map',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }
        axios(dwn_config)
            .then((response) => {
                // this.setState({ fields: response.data.thead });
            })
            .catch(function (error) {
                console.log(error);
            });
        swal({text: showLink, title:"Downloadable Link", buttons: ["Nope", "Copy to Clipboard"], icon: "success"})
        .then((willDownload) => {
            if (willDownload) {
                navigator.clipboard.writeText(showLink);
            }
          });

    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h4">{this.props.tabletitle}</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs={12}>
                            <Table responsive>
                                <thead className="text-primary">
                                    <tr>
                                        {this.props.thead.map((prop, key) => {
                                            return <th key={key}>{prop}</th>;
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.tbody.map((prop, key) => {
                                        return (
                                            <tr key={key}>
                                                {prop.map((prop, key) => {
                                                    return <td key={key}>{prop}</td>;
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </CardBody>
                {this.props.showButton ?
                <>
                    <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret toggle={this.toggle}>
                            Continue Querying
                        </DropdownToggle>
                        <DropdownMenu>
                            {
                                this.state.type == 1 ?
                                    <DropdownItem onClick={this.props.reDo}>
                                        SQL Query
                                    </DropdownItem>
                                    : <Link to={{
                                        pathname: "/admin/icons",
                                        files: ["Table_" + this.state.query_index],
                                        domain: this.state.domain,
                                        query_index: this.state.query_index
                                    }}>
                                        <DropdownItem>SQL Query
                                        </DropdownItem>
                                    </Link>
                            }

                            <DropdownItem divider />
                            {
                                this.state.type == 2 ?
                                    <DropdownItem onClick={this.props.reDo}>
                                        Natural Language Query
                                    </DropdownItem>
                                    : <Link to={{
                                        pathname: "/admin/NLP",
                                        files: ["Table_" + this.state.query_index],
                                        domain: this.state.domain,
                                        query_index: this.state.query_index
                                    }}>
                                        <DropdownItem>Natural Language Query
                                        </DropdownItem>
                                    </Link>
                            }
                            <DropdownItem divider />
                            {
                                this.state.type == 3 ?
                                    <DropdownItem onClick={this.props.reDo}>
                                        Filters
                                    </DropdownItem>
                                    : <Link to={{
                                        pathname: "/admin/user-page",
                                        files: ["Table_" + this.state.query_index],
                                        domain: this.state.domain,
                                        query_index: this.state.query_index
                                    }}>
                                        <DropdownItem>Filters
                                        </DropdownItem>
                                    </Link>
                            }
                        </DropdownMenu>
                    </ButtonDropdown>

                    
                <Button color="info" className="btn-round" onClick={this.download}>
                    Download
                </Button>
                <Button color="info" className="btn-round" onClick={this.linkModal}>
                    Share
                </Button>
                </>
                : null}

            </Card>
        )
    }
}

export default TablePreview;