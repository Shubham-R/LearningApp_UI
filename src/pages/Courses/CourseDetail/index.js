import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Button
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { getCourseDetailsAPI } from "../../../api/course";

const CourseDetails = () => {
    document.title = "Course Details | Classplus";
    
    const { courseId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { courseName, courseStatus } = location.state || {};

    const [courseDetails, setCourseDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        setLoading(true);
        try {
            const payload = {
                courseId: courseId,
                courseName: courseName,
                courseStatus: courseStatus
            };
            const response = await getCourseDetailsAPI(payload);
            if (response?.status === true && response?.data) {
                setCourseDetails(response.data);
            }
        } catch (error) {
            console.error("Error fetching course details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-content">
                <Container fluid>
                    <div className="text-center py-5">
                        <i className="mdi mdi-loading mdi-spin fs-24 text-primary"></i>
                        <p className="mt-2">Loading course details...</p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={courseDetails?.courseName || "Course Details"} pageTitle="Courses" />
                    
                    <Row>
                        {/* Left Column - Main Course Information */}
                        <Col lg={8}>
                            <Card>
                                <CardBody>
                                    <div className="mb-4">
                                        <button
                                            type="button"
                                            className="btn btn-success right ms-auto nexttab d-flex justify-content-end"
                                            onClick={() => navigate("/create-course")}
                                        > Edit</button>
                                    </div>

                                    {/* Course Name and Image Side by Side */}
                                    <Row className="mb-4">
                                        {/* Left Side - Course Name */}
                                        <Col md={6}>
                                            <div>
                                                <h5 className="fw-semibold mb-2">Course Name</h5>
                                                <p className="text-muted mb-0">{courseDetails?.courseName || "--"}</p>
                                            </div>
                                        </Col>

                                        {/* Right Side - Course Image */}
                                        <Col md={6}>
                                            <div className="position-relative">
                                                <span className="badge bg-danger position-absolute top-0 start-0 m-2" style={{ zIndex: 1 }}>
                                                    NEW
                                                </span>
                                                <img
                                                    src={courseDetails?.courseImage || "https://picsum.photos/400/300"}
                                                    alt={courseDetails?.courseName}
                                                    className="img-fluid rounded w-100"
                                                    style={{ maxHeight: "200px", objectFit: "cover" }}
                                                />
                                                <div className="position-absolute bottom-0 start-0 m-2">
                                                    <span className="badge bg-dark d-inline-flex align-items-center">
                                                        <i className="ri-thumb-up-line me-1"></i>
                                                        {courseDetails?.likes || "0"} likes
                                                    </span>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* Description */}
                                    <div className="mb-4">
                                        <h5 className="fw-semibold mb-2">Description</h5>
                                        <p className="text-muted mb-0">
                                            {courseDetails?.courseDescription || "--"}
                                        </p>
                                    </div>

                                    {/* Price and Discount */}
                                    <Row className="mb-4">
                                        <Col md={6}>
                                            <div>
                                                <h5 className="fw-semibold mb-2">Price</h5>
                                                <p className="text-muted mb-0">
                                                    ₹ {courseDetails?.price || "0"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div>
                                                <h5 className="fw-semibold mb-2">Discount</h5>
                                                <p className="text-muted mb-0">
                                                    ₹ {courseDetails?.discount || "0"}
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* Category and Sub Category */}
                                    <Row className="mb-4">
                                        {courseDetails?.categoryMappings?.map((mapping, index) => (
                                            <React.Fragment key={index}>
                                                <Col md={6}>
                                                    <div>
                                                        <h5 className="fw-semibold mb-2">Category</h5>
                                                        <p className="text-muted mb-0">
                                                            {mapping.categoryName || "--"}
                                                        </p>
                                                    </div>
                                                </Col>

                                                <Col md={6}>
                                                    <div>
                                                        <h5 className="fw-semibold mb-2">Sub Category</h5>
                                                        <p className="text-muted mb-0">
                                                            {mapping.subcategories?.length
                                                                ? mapping.subcategories.map(sub => sub.subCategoryName).join(", ")
                                                                : "--"}
                                                        </p>
                                                    </div>
                                                </Col>
                                            </React.Fragment>
                                        ))}
                                    </Row>

                                    {/* Course Duration Type */}
                                    <div className="mb-4">
                                        <h5 className="fw-semibold mb-2">Course Duration Type</h5>
                                        <p className="text-muted mb-0">
                                            {courseDetails?.durationType || courseDetails?.courseDuration || "1 Year(s) Duration"}
                                        </p>
                                    </div>

                                    {/* Students Enrolled */}
                                    <div className="mb-4">
                                        <h5 className="fw-semibold mb-2">
                                            Students Enrolled{" "}
                                            <Link to="#" className="text-primary ms-2 fs-14">
                                                View All →
                                            </Link>
                                        </h5>
                                        <p className="text-muted mb-0">
                                            {courseDetails?.studentsEnrolled || "0"}
                                        </p>
                                    </div>

                                    {/* Navigation Button */}
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                            onClick={() => navigate("/courses")}
                                        >
                                            <i className="ri-arrow-left-line me-1"></i>
                                            Previous
                                        </button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Right Column - Course Image and Additional Info */}
                        <Col lg={4}>
                            <Card>
                                <CardBody>
                                    {/* Content Section */}
                                    <div className="mb-3 pb-3 border-bottom">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <div className="avatar-sm rounded">
                                                    <div className="avatar-title bg-soft-primary text-primary rounded fs-20">
                                                        <i className="ri-file-list-3-line"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h5 className="mb-1">Content</h5>
                                                <p className="text-muted mb-0">4 Content</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notice Board */}
                                    <div className="mb-3 pb-3 border-bottom">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <div className="avatar-sm rounded">
                                                    <div className="avatar-title bg-soft-info text-info rounded fs-20">
                                                        <i className="ri-notification-3-line"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h5 className="mb-0">Notice Board</h5>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bundle */}
                                    <div className="mb-3 pb-3 border-bottom">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <div className="avatar-sm rounded">
                                                    <div className="avatar-title bg-soft-success text-success rounded fs-20">
                                                        <i className="ri-stack-line"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="d-flex align-items-center">
                                                    <h5 className="mb-0 me-2">Bundle</h5>
                                                    <span className="badge bg-danger">New</span>
                                                </div>
                                                <p className="text-muted small mb-0">Create Bundle & Earn More</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Share Button */}
                                    <div className="mt-3">
                                        <button
                                            type="button" outline
                                            className="btn btn-success w-100"
                                            onClick={() => navigate("/courses")}
                                        >
                                            <i className="ri-share-line me-1"></i> Share
                                        </button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CourseDetails;