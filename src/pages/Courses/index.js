import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row,
    UncontrolledCollapse,
    UncontrolledDropdown,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";

// RangeSlider

import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

import { expolreNow } from "../../common/data/index";

const Courses = () => {
    document.title = "Courses | Classplus";
    const [NFTList, setNFTList] = useState(expolreNow);

    const favouriteBtn = (ele) => {
        if (ele.closest("button").classList.contains("active")) {
            ele.closest("button").classList.remove("active");
        } else {
            ele.closest("button").classList.add("active");
        }
    };

    const onUpdate = (value) => {
        setNFTList(
            expolreNow.filter(
                (NFT) => NFT.price >= value[0] && NFT.price <= value[1],
            )
        );
    };

    const category = (e) => {
        setNFTList(
            expolreNow.filter((item) => item.category === e));
    };

    const fileType = (e) => {
        setNFTList(
            expolreNow.filter((item) => item.fileType === e));
    };

    const salesType = (e) => {
        setNFTList(
            expolreNow.filter((item) => item.sales === e));
    };

    const searchNFT = () => {
        var searchProductList = document.getElementById("searchProductList");
        var inputVal = searchProductList.value.toLowerCase();
        function filterItems(arr, query) {
            return arr.filter(function (el) {
                return el.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
            });
        }
        var filterData = filterItems(expolreNow, inputVal);
        if (filterData.length === 0) {
            document.getElementById("noresult").style.display = "block";
            document.getElementById("loadmore").style.display = "none";
        } else {
            document.getElementById("noresult").style.display = "none";
            document.getElementById("loadmore").style.display = "block";
        }
        setNFTList(filterData);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Your Courses" pageTitle="Courses" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader className="border-0">
                                    <div className="d-flex align-items-center">
                                        <h5 className="card-title mb-0 flex-grow-1">
                                            Courses
                                        </h5>
                                        <div className="ms-2 col-sm-1 ">
                                            <Link
                                                className="btn btn-success"
                                                id="filter-collapse"
                                                data-bs-toggle="collapse"
                                                to="#collapseExample"
                                            >
                                                <i className="ri-filter-2-line align-bottom"></i>
                                                Filters
                                            </Link>
                                        </div>
                                        <div>
                                            <Link to="/create-course" className="btn btn-success"><i
                                                className="ri-add-line align-bottom me-1"></i> Create Course</Link>
                                        </div>
                                    </div>

                                    <UncontrolledCollapse toggler="#filter-collapse" defaultOpen>
                                        <Row className="row-cols-xxl-3 row-cols-lg-3 row-cols-md-2 row-cols-1 mt-3 g-3">
                                            <Col>
                                                <h6 className="text-uppercase fs-12 mb-2">Search</h6>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search course name"
                                                    autoComplete="off"
                                                    id="searchProductList"
                                                // onKeyUp={searchNFT}
                                                />
                                            </Col>
                                        </Row>
                                    </UncontrolledCollapse>
                                </CardHeader>
                            </Card>
                        </Col>
                    </Row>
                    <Row
                        className="row-cols-xxl-4 row-cols-xl-3 row-cols-lg-2 row-cols-md-1"
                        id="explorecard-list"
                    >

                        {NFTList.map((item, key) => (<Col className="list-element" key={key}>
                            <Card className="explore-box card-animate">
                                <div className="explore-place-bid-img">
                                    <input type="hidden" className="form-control" id="1" />
                                    <div className="d-none">undefined</div>
                                    <img
                                        src={item.img}
                                        alt=""
                                        className="card-img-top explore-img"
                                    />
                                    <div className="bg-overlay"></div>
                                    {/* <div className="place-bid-btn">

                                        <Link to="#" className="btn btn-success">
                                            <i className="ri-auction-fill align-bottom me-1"></i> Place
                                            Bid
                                        </Link>
                                    </div> */}
                                </div>
                                <CardBody>

                                    {/* <p className="fw-medium mb-0 float-end">
                                        <i className="mdi mdi-heart text-danger align-middle"></i>{" "}
                                        1k
                                    </p> */}
                                    <h5 className="mb-1">
                                        <Link to="/course-details">{item.title}</Link>
                                    </h5>
                                    <p className="text-muted mb-0">Created by: {item.category}</p>
                                </CardBody>
                                <div className="card-footer border-top border-top-dashed">
                                    <div className="d-flex align-items-center">
                                        <h5 className="flex-shrink-0 fs-14 text-primary mb-0">
                                            ₹{item.price}
                                        </h5>
                                    </div>
                                </div>
                            </Card>
                        </Col>))}
                    </Row>
                    <div
                        className="py-4 text-center"
                        id="noresult"
                        style={{ display: "none" }}
                    >
                        <lord-icon
                            src="https://cdn.lordicon.com/msoeawqm.json"
                            trigger="loop"
                            colors="primary:#405189,secondary:#0ab39c"
                            style={{ width: "72px", height: "72px" }}
                        ></lord-icon>
                        <h5 className="mt-4">Sorry! No Result Found</h5>
                    </div>
                    <div className="text-center mb-3">
                        <button className="btn btn-link text-success mt-2" id="loadmore">
                            <i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2"></i>
                            Load More
                        </button>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Courses;
