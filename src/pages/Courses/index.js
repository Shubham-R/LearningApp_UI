import React, { useEffect, useState } from "react";
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
    Button
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";

// RangeSlider

import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

import { expolreNow } from "../../common/data/index";
import { getCourseDetailsAPI, getCourseListAPI } from "../../api/course";

const Courses = () => {
    document.title = "Courses | Classplus";
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    //#region Fetch All Courses
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await getCourseListAPI();
            if (response?.status === true && Array.isArray(response?.data)) {
                setCourseList(response.data);
            } else {
                setCourseList([]);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            setCourseList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);
    //#endregion

    //#region Search Course
    const handleSearch = async () => {
        // If input is empty, fetch all courses again
        if (!searchTerm.trim()) {
            fetchCourses();
            return;
        }

        setLoading(true);
        try {
            // Find course from list by name
            const foundCourse = courseList.find(course =>
                course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const payload = foundCourse
                ? {
                    courseId: foundCourse.courseId,
                    courseName: foundCourse.courseName,
                    courseStatus: foundCourse.status
                }
                : {
                    courseId: null,
                    courseName: searchTerm,
                    courseStatus: null
                };

            const response = await getCourseDetailsAPI(payload);

            // Handle response properly
            if (response?.status === true && response?.data) {
                setCourseList(Array.isArray(response.data) ? response.data : [response.data]);
            } else {
                setCourseList([]);
            }
        } catch (error) {
            console.error("Error fetching course details:", error);
            setCourseList([]);
        } finally {
            setLoading(false);
        }
    };

    // Search on Enter key
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };
    //#endregion

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
                                        <h5 className="card-title mb-0 flex-grow-1">Courses</h5>
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
                                            <Link to="/create-course" className="btn btn-success">
                                                <i className="ri-add-line align-bottom me-1"></i> Create Course
                                            </Link>
                                        </div>
                                    </div>

                                    <UncontrolledCollapse toggler="#filter-collapse" defaultOpen>
                                        <Row className="mt-3 g-3 align-items-end">
                                            <Col md={6}>
                                                <h6 className="text-uppercase fs-12 mb-2">Search</h6>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter course name"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                />
                                            </Col>
                                            <Col md="auto">
                                                <Button color="primary" onClick={handleSearch}>
                                                    <i className="ri-search-line me-1"></i> Search
                                                </Button>
                                            </Col>
                                        </Row>
                                    </UncontrolledCollapse>
                                </CardHeader>
                            </Card>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <i className="mdi mdi-loading mdi-spin fs-24 text-primary"></i>
                            <p className="mt-2">Loading courses...</p>
                        </div>
                    ) : courseList.length > 0 ? (
                        <Row className="row-cols-xxl-4 row-cols-xl-3 row-cols-lg-2 row-cols-md-1" id="explorecard-list">
                            {courseList.map((course) => (
                                <Col key={course.courseId}>
                                    <Card className="explore-box card-animate">
                                        <div className="explore-place-bid-img">
                                            <img
                                                // src={course.courseImag}
                                                src="https://picsum.photos/200"
                                                alt={course.courseName}
                                                className="card-img-top explore-img"
                                            />
                                            <div className="bg-overlay"></div>
                                        </div>
                                        <CardBody>
                                            <h5 className="mb-1">
                                                <Link to={`/course-details/${course.courseId}`}>
                                                    {course.courseName}
                                                </Link>
                                            </h5>
                                            <p className="text-muted mb-0">
                                                Status: {course.status}
                                            </p>
                                            <p className="text-muted mb-0">
                                                Created At: {new Date(course.createdAt).toLocaleDateString()}
                                            </p>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="py-4 text-center" id="noresult">
                            <lord-icon
                                src="https://cdn.lordicon.com/msoeawqm.json"
                                trigger="loop"
                                colors="primary:#405189,secondary:#0ab39c"
                                style={{ width: "72px", height: "72px" }}
                            ></lord-icon>
                            <h5 className="mt-4">Sorry! No Result Found</h5>
                        </div>
                    )}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Courses;
