/*!

=========================================================
* Now UI Dashboard React - v1.5.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
} from "reactstrap";

import routes from "routes.js";

import Swal from 'sweetalert2';

async function handleswal(){
  const steps = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    const swalQueueStep = Swal.mixin({
        confirmButtonText: 'Next &rarr;',
        cancelButtonText: 'Back',
        progressSteps: steps,
        width: 800,
        inputAttributes: {
            required: true
        },
        reverseButtons: true,
        backdrop: `
        rgba(0,0,123,0.6)
        url("https://www.sureworks.in/images/bigdata.gif")
        left top
        no-repeat
        `
    })
    const values = []
    let currentStep
    var title = ""
    var html = ""
    var imageUrl = ""
    for (currentStep = 0; currentStep < steps.length;) {
        switch (currentStep) {
            case 0:
                title = "Check Available Domains"
                html = "List available datasets in the Data Foundation server"
                imageUrl = "https://i.postimg.cc/dty9m9xr/list-domains-cropped.gif"
                break;
            case 1:
                title = "Upload new dataset"
                html = "Add your data domain of choice and the associated tables"
                imageUrl = "https://i.postimg.cc/gkxLWBK6/upload-dataset.gif"
                break;
            case 2:
                title = "List Available CSVs"
                html = "List available CSVs under the chosen domain"
                imageUrl = "https://i.postimg.cc/h4HYBhF8/list-csvs-cropped.gif"
                break;
            case 3:
                title = "Filter tables"
                html = "Filter tables using various conditions and values on the data columns"
                imageUrl = "https://i.postimg.cc/q747zm2w/filters-download.gif"
                break;
            case 4:
                title = "Share downloadable links"
                html = "Download the query outputs or copy sharable download links to your clipboard!"
                imageUrl = "https://i.postimg.cc/hv6jvc0Q/filters-share.gif"
                break;
            case 5:
                title = "Dataset Preview and Metadata"
                html = "Preview your tables before querying and explore the datatypes of columns"
                imageUrl = "https://i.postimg.cc/SKPNDmwT/sql-query-preview-dtypes.gif"
                break;
            
            case 6:
              title = "Natural Language Query"
              html = "Query tables in plain natural language"
              imageUrl = "https://i.postimg.cc/15Gv1HrP/natural-language-query.gif"
              break;

            case 7:
                title = "Query suggestions"
                html = "Extract information in one-click with query suggestions based on your query history"
                imageUrl = "https://i.postimg.cc/nrbVf0Vq/sql-query-suggestion.gif"
                break;

            case 8:
              title = "Hierarchical query"
              html = "Perform multiple types of queries on the outputs of each query"
              imageUrl = "https://i.postimg.cc/Mp6Z7z6B/hierarchical-query.gif"
              break;

        }
        console.log(imageUrl);
        const result = await swalQueueStep.fire({
            title: title,
            html: html,
            imageUrl: imageUrl,
            showCancelButton: currentStep > 0,
            currentProgressStep: currentStep
        })

        if (result.value) {
            values[currentStep] = result.value
            currentStep++
        } else if (result.dismiss === 'cancel') {
            currentStep--
        } else {
            break
        }
    }
}
function DemoNavbar(props) {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  const sidebarToggle = React.useRef();
  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("white");
    }
    setIsOpen(!isOpen);
  };
  const dropdownToggle = (e) => {
    setDropdownOpen(!dropdownOpen);
  };
  const getBrand = () => {
    var name;
    routes.map((prop, key) => {
      if (prop.collapse) {
        prop.views.map((prop, key) => {
          if (prop.path === props.location.pathname) {
            name = prop.name;
          }
          return null;
        });
      } else {
        if (prop.redirect) {
          if (prop.path === props.location.pathname) {
            name = prop.name;
          }
        } else {
          if (prop.path === props.location.pathname) {
            name = prop.name;
          }
        }
      }
      return null;
    });
    return name;
  };
  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("white");
    } else {
      setColor("transparent");
    }
  };
  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
  }, []);
  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);
  return (
    // add or remove classes depending if we are on full-screen-maps page or not
    <Navbar
      color={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "white"
          : color
      }
      expand="lg"
      className={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute fixed-top"
          : "navbar-absolute fixed-top " +
            (color === "transparent" ? "navbar-transparent " : "")
      }
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <NavbarBrand href="/">{getBrand()}</NavbarBrand>
        </div>
        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          <Nav navbar>
          <NavItem>
              <Link to="/admin/signin" className="nav-link">
                <i className="now-ui-icons users_single-02"/>
                <p>
                  <span className="d-lg-none d-md-block">SignIn</span>
                </p>
              </Link>
            </NavItem>
            <NavItem onClick={handleswal}>
              <div className="nav-link">
                <i className="now-ui-icons travel_info" />
                <p>
                  <span className="d-lg-none d-md-block">Demo</span>
                </p>
              </div>
            </NavItem>
            <NavItem>
              <div className="nav-link">
              <a href="http://localhost:5000/docs" target="_blank">
              <i className="now-ui-icons location_map-big"/>
                <p>
                  <span className="d-lg-none d-md-block">API Docs</span>
                </p>
                </a>
              </div>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default DemoNavbar;
