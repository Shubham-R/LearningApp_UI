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
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { getCourseDetailsAPI, getCourseDetailAPI } from "../../../api/course";
import noimage from "../../../assets/images/noimage.png";
import { toast } from "react-toastify";

const CourseDetails = () => {
    document.title = "Course Details | Classplus";
    
    const { courseId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { courseName, courseStatus } = location.state || {};

    const [courseDetails, setCourseDetails] = useState(null);    
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [liveChatModalOpen, setLiveChatModalOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);
    const toggleLiveChatModal = () => setLiveChatModalOpen(prevState => !prevState);

    const isOwner = JSON.parse(sessionStorage.getItem("authUser")).data.userId === courseDetails?.createdBy;

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
        navigate(`/update-course/${courseId}`, {
            state: {
                courseData: courseDetails,
                isEditMode: true,
                courseStatus: courseStatus
            }
        });
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

    const handleScheduleLiveClass = () => {
        window.open("https://zoom.us/j/123456789", "_blank");
        toggleLiveChatModal();
    };

    const handleConnectZoom = () => {
        window.open("https://zoom.us/j/123456789", "_blank");
        toggleLiveChatModal();
    };

    const handleScheduleDemoClass = () => {
        window.open("https://zoom.us/j/123456789", "_blank");
        toggleLiveChatModal();
    };

    const handleNavigateToContent = () => {
        navigate(`/update-course/${courseId}`, {
            state: {
                courseData: courseDetails,
                isEditMode: true,
                courseStatus: courseStatus,
                openTab: 3
            }
        });
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
                    <BreadCrumb title={"Course Details"} pageTitle="Courses" />
                    
                    <Row>
                        {/* Left Column - Main Course Information */}
                        <Col lg={8}>
                            <Card>
                                <CardBody>
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
                                                    src={courseDetails?.courseImageUrl || noimage}
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

                                        {courseDetails?.durations?.length > 0 ? (
                                            courseDetails.durations.map((dur, index) => (
                                                <p className="text-muted mb-0" key={index}>
                                                    {dur.durationValue} {dur.durationUnit}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="text-muted mb-0">--</p>
                                        )}
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
                                            tag="button"
                                                className="btn btn-outline-primary w-20 d-flex align-items-center justify-content-center"
                                                style={{
                                                    border: '1px dashed #2196f3',
                                                    color: '#2196f3',
                                                    backgroundColor: 'transparent',
                                                    borderRadius: '8px',
                                                    padding: '10px'
                                                }}
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
                                    <div
                                        className="mb-3 pb-3 border-bottom"
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleNavigateToContent}
                                    >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="rounded d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            backgroundColor: '#e3f2fd'
                                                        }}
                                                    >
                                                        <i className="ri-folder-3-line fs-20" style={{ color: '#2196f3' }}></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6 className="mb-0 fw-semibold">Content</h6>
                                                    <p className="text-muted small mb-0">{courseDetails?.contentCount || 0} Content</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Live Classes */}
                                    <div className="mb-3 pb-3 border-bottom" onClick={toggleLiveChatModal} style={{ cursor: 'pointer' }}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="rounded d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            backgroundColor: '#e3f2fd'
                                                        }}
                                                    >
                                                        <i className="ri-video-line fs-20" style={{ color: '#2196f3' }}></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6 className="mb-0 fw-semibold">Live Classes</h6>
                                                    <p className="text-primary small mb-0">Go Live</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notice Board */}
                                    <div className="mb-3 pb-3 border-bottom" style={{ cursor: 'pointer' }}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="rounded d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            backgroundColor: '#fff3e0'
                                                        }}
                                                    >
                                                        <i className="ri-notification-3-line fs-20" style={{ color: '#ff9800' }}></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6 className="mb-0 fw-semibold">Notice Board</h6>
                                                    <p className="text-primary small mb-0">Create a Notice</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bundle */}
                                    <div className="mb-3 pb-3 border-bottom" style={{ cursor: 'pointer' }}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="rounded d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            backgroundColor: '#e3f2fd'
                                                        }}
                                                    >
                                                        <i className="ri-stack-line fs-20" style={{ color: '#2196f3' }}></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <div className="d-flex align-items-center">
                                                        <h6 className="mb-0 fw-semibold me-2">Bundle</h6>
                                                        <span
                                                            className="badge"
                                                            style={{
                                                                backgroundColor: '#ffebee',
                                                                color: '#d32f2f',
                                                                fontSize: '10px',
                                                                padding: '3px 8px',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            New
                                                        </span>
                                                    </div>
                                                    <p className="text-primary small mb-0">Create Bundle & Earn More</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* More Options Dropdown Button */}
                                    <div className="mt-3">
                                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="w-100">
                                            <DropdownToggle
                                                tag="button"
                                                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                                                style={{
                                                    border: '1px dashed #2196f3',
                                                    color: '#2196f3',
                                                    backgroundColor: 'transparent',
                                                    borderRadius: '8px',
                                                    padding: '10px'
                                                }}
                                            >
                                                <i className="ri-more-fill me-2"></i> More Options
                                            </DropdownToggle>
                                            <DropdownMenu className="w-100" style={{ borderRadius: '8px' }}>
                                                {/* Edit - Only visible to owner */}
                                                {isOwner && (
                                                    <DropdownItem onClick={handleEdit} className="py-2">
                                                        <i className="ri-edit-line me-2 text-muted"></i>
                                                        Edit
                                                    </DropdownItem>
                                                )}

                                                {/* Delete - Only visible to owner */}
                                                {isOwner && (
                                                    <DropdownItem onClick={handleDelete} className="py-2">
                                                        <i className="ri-delete-bin-line me-2 text-muted"></i>
                                                        Delete
                                                    </DropdownItem>
                                                )}

                                                {/* Unpublish - Only visible to owner */}
                                                {isOwner && (
                                                    <DropdownItem onClick={handleUnpublish} className="py-2">
                                                        <i className="ri-close-circle-line me-2 text-muted"></i>
                                                        Unpublish
                                                    </DropdownItem>
                                                )}

                                                <DropdownItem onClick={handleShare} className="py-2">
                                                    <i className="ri-share-line me-2 text-muted"></i>
                                                    Share
                                                </DropdownItem>

                                                <DropdownItem onClick={handleMarkAsFeatured} className="py-2">
                                                    <i className="ri-star-line me-2 text-muted"></i>
                                                    Mark as Featured
                                                </DropdownItem>

                                                <DropdownItem className="py-2">
                                                    <i className="ri-settings-3-line me-2 text-muted"></i>
                                                    Advanced Settings
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

            {/* Live Chat Modal - Slides from Right */}
            <Modal 
                isOpen={liveChatModalOpen} 
                toggle={toggleLiveChatModal}
                className="modal-dialog-right"
                size="md"
            >
                <ModalHeader toggle={toggleLiveChatModal} className="border-0 pb-0">
                    Live Class
                </ModalHeader>
                <ModalBody className="pt-3">
                    {/* Live Class Online Card */}
                    <div 
                        className="card border rounded-3 mb-3 p-3"
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={handleScheduleLiveClass}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                        <div className="d-flex align-items-start">
                            <div className="flex-shrink-0 me-3">
                                <div className="position-relative">
                                    <div 
                                        className="rounded d-flex align-items-center justify-content-center"
                                        style={{ width: '48px', height: '48px', backgroundColor: '#e3f2fd' }}
                                    >
                                        <i className="ri-video-line fs-22" style={{ color: '#2196f3' }}></i>
                                    </div>
                                    <span 
                                        className="badge position-absolute"
                                        style={{ 
                                            bottom: '-5px', 
                                            left: '0', 
                                            backgroundColor: '#ff4444',
                                            fontSize: '9px',
                                            padding: '2px 6px'
                                        }}
                                    >
                                        Live Class
                                    </span>
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="mb-1 fw-semibold">Live Class Online</h6>
                                <p className="text-muted mb-2 small">
                                    Schedule Live Class online in your course or batch.
                                </p>
                                <div className="text-primary small fw-medium">
                                    Schedule Live Class <i className="ri-arrow-right-line ms-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zoom Live Class Card */}
                    <div 
                        className="card border rounded-3 mb-3 p-3"
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={handleConnectZoom}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                        <div className="d-flex align-items-start">
                            <div className="flex-shrink-0 me-3">
                                <div className="position-relative">
                                    <div 
                                        className="rounded d-flex align-items-center justify-content-center"
                                        style={{ width: '48px', height: '48px', backgroundColor: '#e3f2fd' }}
                                    >
                                        <i className="ri-vidicon-line fs-22" style={{ color: '#2196f3' }}></i>
                                    </div>
                                    <span 
                                        className="badge position-absolute"
                                        style={{ 
                                            bottom: '-5px', 
                                            left: '0', 
                                            backgroundColor: '#2d8cff',
                                            fontSize: '9px',
                                            padding: '2px 6px'
                                        }}
                                    >
                                        ZOOM
                                    </span>
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="mb-1 fw-semibold">Zoom Live Class</h6>
                                <p className="text-muted mb-2 small">
                                    Schedule Live Class online in your course or batch.
                                </p>
                                <div className="text-primary small fw-medium">
                                    Connect Zoom Account <i className="ri-arrow-right-line ms-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Demo Live Class Card */}
                    <div 
                        className="card border rounded-3 mb-0 p-3"
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={handleScheduleDemoClass}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                        <div className="d-flex align-items-start">
                            <div className="flex-shrink-0 me-3">
                                <div className="position-relative">
                                    <div 
                                        className="rounded d-flex align-items-center justify-content-center"
                                        style={{ width: '48px', height: '48px', backgroundColor: '#e3f2fd' }}
                                    >
                                        <i className="ri-video-add-line fs-22" style={{ color: '#2196f3' }}></i>
                                    </div>
                                    <span 
                                        className="badge position-absolute"
                                        style={{ 
                                            bottom: '-5px', 
                                            left: '0', 
                                            backgroundColor: '#ffa726',
                                            fontSize: '9px',
                                            padding: '2px 6px'
                                        }}
                                    >
                                        DEMO
                                    </span>
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="mb-1 fw-semibold">Demo Live Class</h6>
                                <p className="text-muted mb-2 small">
                                    Schedule Demo Class to promote this course to other students
                                </p>
                                <div className="text-primary small fw-medium">
                                    Schedule Demo Live Class <i className="ri-arrow-right-line ms-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <style jsx>{`
                .modal-dialog-right {
                    position: fixed;
                    margin: 0;
                    width: 100%;
                    max-width: 400px;
                    height: 100%;
                    right: 0;
                    top: 0;
                }
                
                .modal-dialog-right .modal-content {
                    height: 100%;
                    border: 0;
                    border-radius: 0;
                }
                
                .modal.show .modal-dialog-right {
                    transform: translateX(0);
                }
                
                .modal-dialog-right {
                    transform: translateX(100%);
                    transition: transform 0.3s ease-out;
                }
            `}</style>
        </React.Fragment>
    );
};

export default CourseDetails;