import React, { useEffect, useState } from "react";
import moment from 'moment';
import { Link } from "react-router-dom";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Row,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Label,
    FormGroup,
    Dropdown,          
    DropdownToggle,    
    DropdownMenu
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";

import { getCourseListAPI } from "../../api/course";

const Courses = () => {
    document.title = "Courses | Classplus";
    const [courseList, setCourseList] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    // Filter states
    const [selectedCategory, setSelectedCategory] = useState("");
    const [courseType, setCourseType] = useState("");
    const [courseStatus, setCourseStatus] = useState([]);
    const [priceRangeLower, setPriceRangeLower] = useState("");
    const [priceRangeHigher, setPriceRangeHigher] = useState("");
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

    const toggleFilterModal = () => setIsFilterOpen(!isFilterOpen);

    //#region Fetch All Courses
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await getCourseListAPI();
            if (response?.status === true && Array.isArray(response?.data)) {
                setCourseList(response.data);
                setAllCourses(response.data);
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
    const handleSearch = (term) => {
        const t = (term || "").trim();
        if (!t) {
            setCourseList(allCourses);
            return;
        }

        if (t.length >= 3) {
            const filtered = allCourses.filter(course =>
                (course.courseName || "").toLowerCase().includes(t.toLowerCase())
            );
            setCourseList(filtered);
            return;
        }
        setCourseList(allCourses);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch(searchTerm);
        }
    };
    //#endregion

    // Helper to format createdAt as relative time
    const formatRelativeDate = (dateStr) => {
        if (!dateStr) return '';
        const m = moment(dateStr);
        if (!m.isValid()) return '';

        const now = moment();
        const diffMinutes = now.diff(m, 'minutes');
        const diffHours = now.diff(m, 'hours');
        const diffDays = now.startOf('day').diff(m.startOf('day'), 'days');

        if (diffMinutes < 1) return 'just now';
        if (diffMinutes < 60) return `${diffMinutes} min ago`;
        if (diffHours < 24 && diffDays === 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 0) return 'today';
        if (diffDays === 1) return 'yesterday';
        if (diffDays === 2) return 'day before yesterday';
        if (diffDays <= 7) return `${diffDays} days ago`;

        return m.format('MMM D, YYYY');
    };

    //#region Filter Functions
    const handleCourseStatusChange = (status) => {
        if (courseStatus.includes(status)) {
            setCourseStatus(courseStatus.filter(s => s !== status));
        } else {
            setCourseStatus([...courseStatus, status]);
        }
    };

    const applyFilters = () => {
        let filtered = [...allCourses];

        // Apply course type filter
        if (courseType) {
            let auth = null;
            try {
                auth = JSON.parse(sessionStorage.getItem('authUser'));
            } catch (err) {
                auth = null;
            }
            const userId = auth?.data?.userId;
            const userOrgId = auth?.data?.userOrgId;

            if (courseType === 'createdByMe') {
                filtered = filtered.filter(course => String(course.createdBy) === String(userId));
            } else if (courseType === 'createdByInstitute') {
                filtered = filtered.filter(course => String(course.instituteId) === String(userOrgId));
            } else if (courseType === 'imported') {
                // no-op for now (imported courses filter not implemented)
            }
        }

        // Apply course status filter
        if (courseStatus.length > 0) {
            filtered = filtered.filter(course => {
                const status = (course.courseStatus || "").toUpperCase();
                return courseStatus.some(s => s.toUpperCase() === status);
            });
        }

        // Apply price range filter
        if (priceRangeLower || priceRangeHigher) {
            filtered = filtered.filter(course => {
                const price = parseFloat(course.globalEffectivePrice) || 0;
                const lower = priceRangeLower ? parseFloat(priceRangeLower) : 0;
                const higher = priceRangeHigher ? parseFloat(priceRangeHigher) : Infinity;
                return price >= lower && price <= higher;
            });
        }

        setCourseList(filtered);
        toggleFilterModal();
    };

    const clearFilters = () => {
        setSelectedCategory("");
        setCourseType("");
        setCourseStatus([]);
        setPriceRangeLower("");
        setPriceRangeHigher("");
        setCourseList(allCourses);
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
                                        <Row className="card-title mb-0 flex-grow-1">
                                            <Col md={6}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter course name"
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        setSearchTerm(e.target.value);
                                                        handleSearch(e.target.value);
                                                    }}
                                                    onKeyDown={handleKeyDown}
                                                />
                                            </Col>
                                        </Row>
                                        <div className="ms-2 col-sm-1">
                                            <Button
                                                color="success"
                                                onClick={toggleFilterModal}
                                            >
                                                <i className="ri-filter-2-line align-bottom"></i> Filters
                                            </Button>
                                        </div>
                                        <div>
                                            <Link to="/create-course" className="btn btn-success">
                                                <i className="ri-add-line align-bottom me-1"></i> Create Course
                                            </Link>
                                        </div>
                                    </div>
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
                                        <div className="explore-place-bid-img" style={{ position: 'relative' }}>
                                            <img
                                                src="https://picsum.photos/200"
                                                alt={course.courseName}
                                                className="card-img-top explore-img"
                                            />
                                            <div className="bg-overlay"></div>
                                            {(() => {
                                                const status = (course.courseStatus || '').toUpperCase();
                                                let badgeClass = 'badge bg-secondary';
                                                let label = course.courseStatus || '';
                                                if (status === 'PUBLISHED') {
                                                    badgeClass = 'badge bg-success';
                                                } else if (status === 'UNPUBLISHED') {
                                                    badgeClass = 'badge bg-warning text-dark';
                                                } else if (status === 'DRAFT') {
                                                    badgeClass = 'badge bg-secondary';
                                                }
                                                return (
                                                    <div className="position-absolute" style={{ top: 12, right: 12 }}>
                                                        <span className={badgeClass} style={{ padding: '0.45rem 0.6rem', fontSize: '0.75rem' }}>
                                                            {label}
                                                        </span>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <CardBody>
                                            <h5 className="mb-1">
                                                <Link
                                                    to={`/course-details/${course.courseId}`}
                                                    state={{
                                                        courseName: course.courseName,
                                                        courseStatus: course.courseStatus,
                                                    }}
                                                    title={course.courseName}  // show full name on hover
                                                >
                                                    {course.courseName.length > 20
                                                        ? course.courseName.substring(0, 20) + "..."
                                                        : course.courseName}
                                                </Link>
                                            </h5>

                                            <div className="text-muted mb-1 d-flex justify-content-between">
                                                <span>
                                                    Price: <span style={{ textDecoration: "line-through" }}>
                                                        ₹{course.globalPrice || 0}
                                                    </span>
                                                </span>

                                                <span>
                                                    {/* Discount: {course.globalDiscount || 0}% */}
                                                    Effective Price: ₹{course.globalEffectivePrice || 0}
                                                </span>
                                            </div>

                                            {/* <p className="text-muted mb-1">
                                                Effective Price: ₹{course.globalEffectivePrice || 0}
                                            </p> */}

                                            <p className="text-muted mb-0">
                                                Created At: {formatRelativeDate(course.createdAt)}
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

            {/* Filter Modal - Slides from Right */}
            <Modal
                isOpen={isFilterOpen}
                toggle={toggleFilterModal}
                className="modal-dialog-slideout"
                style={{
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    margin: 0,
                    height: '100vh',
                    maxWidth: '450px',
                    width: '100%'
                }}
            >
                <ModalHeader toggle={toggleFilterModal} className="border-bottom">
                    <h5 className="modal-title">Filter</h5>
                </ModalHeader>
                <ModalBody style={{ padding: '24px', overflowY: 'auto' }}>
                    {/* Categories */}
                    <div className="mb-4" style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                        <Label className="form-label fw-semibold mb-3">Categories / Sub-categories</Label>
                        <Input
                            type="select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{ 
                                borderRadius: '6px',
                                border: '1px solid #e0e0e0',
                                padding: '10px 12px'
                            }}
                        >
                            <option value="">Select Categories / Sub-categories</option>
                            <option value="programming">Programming</option>
                            <option value="design">Design</option>
                            <option value="business">Business</option>
                        </Input>
                    </div>

                    {/* Course Type */}
                    <div className="mb-4" style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                        <Label className="form-label fw-semibold mb-3">Course Type</Label>
                        <FormGroup check className="mb-2">
                            <Input
                                type="radio"
                                name="courseType"
                                id="createdByMe"
                                value="createdByMe"
                                checked={courseType === "createdByMe"}
                                onChange={(e) => setCourseType(e.target.value)}
                            />
                            <Label check htmlFor="createdByMe">Created by Me</Label>
                        </FormGroup>
                        <FormGroup check className="mb-2">
                            <Input
                                type="radio"
                                name="courseType"
                                id="createdByInstitute"
                                value="createdByInstitute"
                                checked={courseType === "createdByInstitute"}
                                onChange={(e) => setCourseType(e.target.value)}
                            />
                            <Label check htmlFor="createdByInstitute">Created by my institute</Label>
                        </FormGroup>
                        <FormGroup check>
                            <Input
                                type="radio"
                                name="courseType"
                                id="imported"
                                value="imported"
                                checked={courseType === "imported"}
                                onChange={(e) => setCourseType(e.target.value)}
                            />
                            <Label check htmlFor="imported">Imported Course</Label>
                        </FormGroup>
                    </div>

                    {/* Course Status - Multi-select Dropdown */}
                    <div className="mb-4" style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                        <Label className="form-label fw-semibold mb-3">Course Status</Label>
                        <Dropdown
                            isOpen={isStatusDropdownOpen}
                            toggle={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                            className="w-100"
                        >
                            <DropdownToggle
                                tag="button"
                                className="btn btn-light w-100 text-start d-flex justify-content-between align-items-center"
                                style={{
                                    borderRadius: '6px',
                                    border: '1px solid #e0e0e0',
                                    padding: '10px 12px',
                                    backgroundColor: 'white'
                                }}
                            >
                                <span className="text-muted">
                                    Status Selected ({courseStatus.length})
                                </span>
                                <i className="ri-arrow-down-s-line"></i>
                            </DropdownToggle>
                            <DropdownMenu className="w-100" style={{ padding: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                                <div className="px-2">
                                    <div className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="statusDraft"
                                            value="DRAFT"
                                            checked={courseStatus.includes("DRAFT")}
                                            onChange={() => handleCourseStatusChange("DRAFT")}
                                        />
                                        <label className="form-check-label" htmlFor="statusDraft">
                                            DRAFT
                                        </label>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="statusPublished"
                                            value="PUBLISHED"
                                            checked={courseStatus.includes("PUBLISHED")}
                                            onChange={() => handleCourseStatusChange("PUBLISHED")}
                                        />
                                        <label className="form-check-label" htmlFor="statusPublished">
                                            PUBLISHED
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="statusUnpublished"
                                            value="UNPUBLISHED"
                                            checked={courseStatus.includes("UNPUBLISHED")}
                                            onChange={() => handleCourseStatusChange("UNPUBLISHED")}
                                        />
                                        <label className="form-check-label" htmlFor="statusUnpublished">
                                            UNPUBLISHED
                                        </label>
                                    </div>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    {/* Price Range */}
                    <div className="mb-4" style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                        <Label className="form-label fw-semibold mb-3">Price Range</Label>
                        <div className="d-flex align-items-center gap-2">
                            <div style={{ position: 'relative', flex: 1 }}>
                                <span style={{ 
                                    position: 'absolute', 
                                    left: '12px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)', 
                                    color: '#6c757d',
                                    fontSize: '14px'
                                }}>
                                    ₹
                                </span>
                                <Input
                                    type="number"
                                    placeholder="Enter lower limit"
                                    value={priceRangeLower}
                                    onChange={(e) => setPriceRangeLower(e.target.value)}
                                    style={{ 
                                        paddingLeft: '28px',
                                        borderRadius: '6px',
                                        border: '1px solid #e0e0e0'
                                    }}
                                />
                            </div>
                            <span style={{ color: '#6c757d', fontWeight: '500' }}>-</span>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <span style={{ 
                                    position: 'absolute', 
                                    left: '12px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)', 
                                    color: '#6c757d',
                                    fontSize: '14px'
                                }}>
                                    ₹
                                </span>
                                <Input
                                    type="number"
                                    placeholder="Enter higher limit"
                                    value={priceRangeHigher}
                                    onChange={(e) => setPriceRangeHigher(e.target.value)}
                                    style={{ 
                                        paddingLeft: '28px',
                                        borderRadius: '6px',
                                        border: '1px solid #e0e0e0'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter style={{ 
                    borderTop: '1px solid #e0e0e0',
                    padding: '16px 24px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Button 
                        color="light" 
                        onClick={clearFilters}
                        style={{
                            borderRadius: '6px',
                            padding: '10px 24px',
                            fontWeight: '500'
                        }}
                    >
                        Clear Filter
                    </Button>
                    <Button 
                        style={{
                            backgroundColor: '#5BC0DE',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '10px 24px',
                            fontWeight: '500'
                        }}
                        onClick={applyFilters}
                    >
                        Apply Filter
                    </Button>
                </ModalFooter>
            </Modal>

            <style jsx>{`
                .modal-dialog-slideout {
                    position: fixed;
                    margin: 0;
                    width: 100%;
                    max-width: 450px;
                    height: 100%;
                    right: 0;
                    top: 0;
                }
                
                .modal-dialog-slideout .modal-content {
                    height: 100%;
                    border: 0;
                    border-radius: 0;
                    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
                }
                
                .modal.show .modal-dialog-slideout {
                    transform: translateX(0);
                }
                
                .modal-dialog-slideout {
                    transform: translateX(100%);
                    transition: transform 0.3s ease-out;
                }

                .dropdown-menu {
                    max-height: 200px;
                    overflow-y: auto;
                }

                .form-check.dropdown-item:hover {
                    background-color: #f8f9fa;
                }

                .form-check-input:checked {
                    background-color: #0ab39c;
                    border-color: #0ab39c;
                }
            `}</style>
        </React.Fragment>
    );
};

export default Courses;