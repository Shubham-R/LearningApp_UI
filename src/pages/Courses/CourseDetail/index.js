import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { getCourseDetailsAPI, getCourseDetailAPI } from "../../../api/course";

const CourseDetails = () => {
    document.title = "Course Details | Classplus";
    
    const { courseId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { courseName, courseStatus } = location.state || {};

    const [courseDetails, setCourseDetails] = useState(null);    
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

    const isOwner = JSON.parse(sessionStorage.getItem("authUser")).data.userId === courseDetails?.userId;

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
            const response = await getCourseDetailAPI(payload);
            if (response?.status === true && response?.data) {
                setCourseDetails(response?.data);
            }
        } catch (error) {
            toast.error("Failed to fetch course details", { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate("/create-course");
    };

    const handleDelete = () => {
        console.log("Delete course");
    };

    const handleUnpublish = () => {
        console.log("Unpublish course");
    };

    const handleShare = () => {
        console.log("Share course");
    };

    const handleMarkAsFeatured = () => {
        console.log("Mark as featured");
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
                                    {/* <div className="mb-4">
                                        <button
                                            type="button"
                                            className="btn btn-success right ms-auto nexttab d-flex justify-content-end"
                                            onClick={() => navigate("/create-course")}
                                        > Edit</button>
                                    </div> */}

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
                                                    src={courseDetails?.courseImageUrl || "https://picsum.photos/400/300"}
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
                                                    ₹ {courseDetails?.globalPrice || "0"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div>
                                                <h5 className="fw-semibold mb-2">Discount</h5>
                                                <p className="text-muted mb-0">
                                                    {courseDetails?.globalDiscount || "0"} %
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* Category and Sub Category */}
                                    <Row className="mb-4">
                                        {/* Header labels (same style as Price/Discount) */}
                                        <Col md={6}>
                                            <div>
                                                <h5 className="fw-semibold mb-2">Category</h5>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div>
                                                <h5 className="fw-semibold mb-2">Sub Category</h5>
                                            </div>
                                        </Col>

                                        {/* Data rows: one pair (Category | Sub Category) per mapping */}
                                        {courseDetails?.categoryMappings?.map((mapping, index) => (
                                            <React.Fragment key={index}>
                                                <Col md={6}>
                                                    <div>
                                                        <p className="text-muted mb-0">{mapping.categoryName || "--"}</p>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div>
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
                                        <h5 className="fw-semibold mb-2">Course Duration</h5>

                                        {courseDetails?.durations?.map((dur, index) => (
                                            <p className="text-muted mb-0" key={index}>
                                                {dur.durationValue} {dur.durationUnit}
                                            </p>
                                        ))}
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
                                            {courseDetails?.studentEnrolledCount || "0"}
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
                                                <p className="text-muted mb-0">{courseDetails.contentCount || 0} Content</p>
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

                                    {/* Live Chat */}
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
                                                <h5 className="mb-0">Live Chat</h5>
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

                                    {/* More Options Dropdown Button */}
                                    <div className="mt-3">
                                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="w-100">
                                            <DropdownToggle 
                                                tag="button"
                                                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                                                style={{ border: '1px dashed #0ab39c' }}
                                            >
                                                <i className="ri-more-fill me-2"></i> More Options
                                            </DropdownToggle>
                                            <DropdownMenu className="w-100">
                                                {/* Edit - Only visible to owner */}
                                                {isOwner && (
                                                    <DropdownItem onClick={handleEdit}>
                                                        <i className="ri-edit-line me-2 text-muted"></i>
                                                        Edit
                                                    </DropdownItem>
                                                )}
                                                
                                                {/* Delete - Only visible to owner */}
                                                {isOwner && (
                                                    <DropdownItem onClick={handleDelete}>
                                                        <i className="ri-delete-bin-line me-2 text-muted"></i>
                                                        Delete
                                                    </DropdownItem>
                                                )}
                                                
                                                <DropdownItem onClick={handleUnpublish}>
                                                    <i className="ri-close-circle-line me-2 text-muted"></i>
                                                    Unpublish
                                                </DropdownItem>
                                                
                                                <DropdownItem onClick={handleShare}>
                                                    <i className="ri-share-line me-2 text-muted"></i>
                                                    Share
                                                </DropdownItem>
                                                
                                                <DropdownItem onClick={handleMarkAsFeatured}>
                                                    <i className="ri-star-line me-2 text-muted"></i>
                                                    Mark as Featured
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
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