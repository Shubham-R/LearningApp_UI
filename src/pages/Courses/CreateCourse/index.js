import classnames from "classnames";
import React, { useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink,
    Progress,
    Row,
    TabContent,
    TabPane,
} from "reactstrap";
import dummyUser from "../../../assets/images/users/user-dummy-img.jpg";
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from "react-select";
import { MultiValidityCard } from "./MultiValidityCard";
import { Link } from "react-router-dom";
import { cloneDeep } from "lodash";
import Flatpickr from "react-flatpickr";


const CreateCourse = () => {
    const [activeTab, setactiveTab] = useState(1);
    const [activeArrowTab, setactiveArrowTab] = useState(4);
    const [activeVerticalTab, setactiveVerticalTab] = useState(7);
    const [progressbarvalue, setprogressbarvalue] = useState(0);
    const [passedSteps, setPassedSteps] = useState([1]);
    const [passedarrowSteps, setPassedarrowSteps] = useState([1]);
    const [passedverticalSteps, setPassedverticalSteps] = useState([1]);
    const [category, setCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);
    const [courseValidityType, setCourseValidityType] = useState(null);
    const [singleValidityType, setSingleValidityType] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [MultiValidityPlansData, setMultiValidityPlansData] = useState([{
        planId: 1,
        validityDuration: 1,
        validityDurationType: "months",
        price: 0,
        discount: 0,
        effectivePrice: 0,
        isPromoted: false,
        isEditing: true,
    }]);
    const [categoryMappings, setCategoryMappings] = useState([{
        categoryId: null,
        categoryName: null,
        subcategories: [
            {
                subCategoryId: null,
                subCategoryName: null,
            }
        ]
    }]);
    // console.log(courseValidityType);

    // let MultiValidityPlansData = [
    //     {
    //         validityDuration: 1,
    //         validityDurationType: "months",
    //         price: 0,
    //         discount: 0,
    //         effectivePrice: 0,
    //         isPromoted: false,
    //         isEditing: true,
    //     }
    // ]

    const courseCategory = [
        {
            options: [
                { label: "Category1", value: "Category1" },
                { label: "Category2", value: "Category2" },
            ],
        },
    ];

    const courseSubCategory = [
        {
            options: [
                { label: "SubCategory1", value: "SubCategory1" },
                { label: "SubCategory2", value: "SubCategory2" },
            ],
        },
    ];


    const courseDurationTypes = [
        {
            options: [
                { label: "Single Validity", value: "SingleValidity" },
                { label: "Multiple Validity", value: "MultipleValidity" },
                { label: "Lifetime Validity", value: "LifetimeValidity" },
                { label: "Course Expiry Date", value: "CourseExpiryDate" },
            ],
        },
    ];

    const singleValidityDurationTypes = [
        {
            options: [
                { label: "Months(s)", value: "months" },
                { label: "Years(s)", value: "years" },
                // { label: "Weeks(s)", value: "weeks" },
                { label: "Days(s)", value: "days" },
            ],
        },
    ];



    function toggleTab(tab, value) {
        if (activeTab !== tab) {
            var modifiedSteps = [...passedSteps, tab];

            if (tab >= 1 && tab <= 4) {
                setactiveTab(tab);
                setPassedSteps(modifiedSteps);
            }
        }
        setprogressbarvalue(value);
    }

    function toggleArrowTab(tab) {
        if (activeArrowTab !== tab) {
            var modifiedSteps = [...passedarrowSteps, tab];

            if (tab >= 4 && tab <= 7) {
                setactiveArrowTab(tab);
                setPassedarrowSteps(modifiedSteps);
            }
        }
    }

    function toggleVerticalTab(tab) {
        if (activeVerticalTab !== tab) {
            var modifiedSteps = [...passedverticalSteps, tab];

            if (tab >= 7 && tab <= 11) {
                setactiveVerticalTab(tab);
                setPassedverticalSteps(modifiedSteps);
            }
        }
    }


    const SingleOptions = [
        { value: 'Watches', label: 'Watches' },
        { value: 'Headset', label: 'Headset' },
        { value: 'Sweatshirt', label: 'Sweatshirt' },
        { value: '20% off', label: '20% off' },
        { value: '4 star', label: '4 star' },
    ];

    const [selectedMulti, setselectedMulti] = useState(null);

    const handleMulti = (selectedMulti) => {
        setselectedMulti(selectedMulti);
    }

    const onEditMultiValidityHandler = (planId) => {
        let copyMultiValidityPlansData = cloneDeep(MultiValidityPlansData);
        copyMultiValidityPlansData = copyMultiValidityPlansData.map((plan) => {
            return {
                ...plan,
                isEditing: false,
            }
        });
        let currentEditedPlan = copyMultiValidityPlansData.find((plan) => plan.planId === planId);
        currentEditedPlan.isEditing = true;
        setMultiValidityPlansData(copyMultiValidityPlansData)
    }

    const onCancelMultiValidityHandler = (planId) => {
        let copyMultiValidityPlansData = cloneDeep(MultiValidityPlansData);
        copyMultiValidityPlansData = copyMultiValidityPlansData.filter((plan) => plan.planId !== planId);
        setMultiValidityPlansData(copyMultiValidityPlansData)
    }

    const onDeleteMultiValidityHandler = (planId) => {
        let copyMultiValidityPlansData = cloneDeep(MultiValidityPlansData);
        copyMultiValidityPlansData = copyMultiValidityPlansData.filter((plan) => plan.planId !== planId);
        setMultiValidityPlansData(copyMultiValidityPlansData)
    }

    const onSaveMultiValidityHandler = (orderData) => {
        setIsEditing(false);
    }

    const onAddValidityOptionHandler = () => {
        let copyMultiValidityPlansData = cloneDeep(MultiValidityPlansData);
        copyMultiValidityPlansData = copyMultiValidityPlansData.map((plan) => {
            return {
                ...plan,
                isEditing: false,
            }
        });
        copyMultiValidityPlansData.push(
            {
                planId: copyMultiValidityPlansData.length + 1,
                validityDuration: 1,
                validityDurationType: "months",
                price: 0,
                discount: 0,
                effectivePrice: 0,
                isPromoted: false,
                isEditing: true,
            }
        )
        setMultiValidityPlansData(copyMultiValidityPlansData)
    }

    const onAddAnotherCategoryHandler = () => {
        let copyCategoryMappings = cloneDeep(categoryMappings);
        copyCategoryMappings.push(
            {
                categoryId: null,
                categoryName: null,
                subcategories: [
                    {
                        subCategoryId: null,
                        subCategoryName: null,
                    }
                ]
            }
        )
        setCategoryMappings(copyCategoryMappings)
    }

    const onRemovedCategoryHandler = (index) => {
        let copyCategoryMappings = cloneDeep(categoryMappings);
        copyCategoryMappings.splice(index, 1);
        setCategoryMappings(copyCategoryMappings)
    }

    //Dropzone file upload
    const [selectedFiles, setselectedFiles] = useState([]);

    const handleAcceptedFiles = (files) => {
        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        );
        setselectedFiles(files);
    }

    /**
 * Formats the size
 */
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    document.title = "Create Course | Classplus";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Create Course" pageTitle="Courses" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Add / View content of your course</h4>
                                </CardHeader>
                                <CardBody>
                                    <Form action="#" className="form-steps">
                                        {/* <div className="text-center pt-3 pb-4 mb-1">
                                            <h5>Signup Your Account</h5>
                                        </div> */}

                                        <div className="progress-nav mb-4">
                                            <Progress
                                                value={progressbarvalue}
                                                style={{ height: "1px" }}
                                            />

                                            <Nav
                                                className="nav-pills progress-bar-tab custom-nav"
                                                role="tablist"

                                            >
                                                <NavItem>
                                                    <NavLink
                                                        to="#"
                                                        id="pills-gen-info-tab"
                                                        className={classnames(
                                                            {
                                                                active: activeTab === 1,
                                                                done: activeTab <= 4 && activeTab >= 0,
                                                            },
                                                            "rounded-pill"
                                                        )}
                                                        onClick={() => {
                                                            toggleTab(1, 0);
                                                        }}
                                                        tag="button"
                                                    >
                                                        1
                                                    </NavLink>
                                                    {/* <span className="text-muted">
                                                        Basic Information
                                                    </span> */}
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        to="#"
                                                        id="pills-gen-info-tab"
                                                        className={classnames(
                                                            {
                                                                active: activeTab === 2,
                                                                done: activeTab <= 4 && activeTab > 1,
                                                            },
                                                            "rounded-pill"
                                                        )}
                                                        onClick={() => {
                                                            toggleTab(2, 33);
                                                        }}
                                                        tag="button"
                                                    >
                                                        2
                                                    </NavLink>
                                                    {/* <span className="text-muted">
                                                        Edit Price
                                                    </span> */}
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        to="#"
                                                        id="pills-gen-info-tab"
                                                        className={classnames(
                                                            {
                                                                active: activeTab === 3,
                                                                done: activeTab <= 4 && activeTab > 2,
                                                            },
                                                            "rounded-pill"
                                                        )}
                                                        onClick={() => {
                                                            toggleTab(3, 67);
                                                        }}
                                                        tag="button"
                                                    >
                                                        3
                                                    </NavLink>
                                                    {/* <span className="text-muted">
                                                        Add Content
                                                    </span> */}
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        to="#"
                                                        id="pills-gen-info-tab"
                                                        className={classnames(
                                                            {
                                                                active: activeTab === 4,
                                                                done: activeTab <= 5 && activeTab > 3,
                                                            },
                                                            "rounded-pill"
                                                        )}
                                                        onClick={() => {
                                                            toggleTab(4, 100);
                                                        }}
                                                        tag="button"
                                                    >
                                                        4
                                                    </NavLink>
                                                    {/* <span className="text-muted">
                                                        Bundle(Opional)
                                                    </span> */}
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId={1}>
                                                <div>
                                                    <div className="mb-4">
                                                        <div>
                                                            <h5 className="mb-1">Basic Information</h5>
                                                            <p className="text-muted">
                                                                Fill all Information as below
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Row>
                                                        <Col lg={6}>
                                                            <Row>
                                                                <Col lg={12}>
                                                                    <div className="mb-3">
                                                                        <Label
                                                                            className="form-label"
                                                                            htmlFor="gen-info-course-input"
                                                                        >
                                                                            Name
                                                                        </Label>
                                                                        <Input
                                                                            type="text"
                                                                            className="form-control"
                                                                            id="gen-info-course-input"
                                                                            placeholder="Enter Course Name"
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col lg={12}>
                                                                    <div className="mb-3">
                                                                        <Label className="form-label">Description</Label>
                                                                        <CKEditor
                                                                            editor={ClassicEditor}
                                                                            data="<p>Hello from CKEditor 5!</p>"
                                                                            onReady={(editor) => {
                                                                                // You can store the "editor" and use when it is needed.

                                                                            }}
                                                                        // onChange={(editor) => {
                                                                        //     editor.getData();
                                                                        // }}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col lg={12}>
                                                                    <div className="">
                                                                        <Label className="form-label" htmlFor="project-thumbnail-img">Thumbnail Image</Label>
                                                                        <Input className="form-control" id="project-thumbnail-img" type="file" accept="image/png, image/gif, image/jpeg" />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            {
                                                                categoryMappings.map((mapping, index) => (
                                                                    <div className="mb-3 mt-3 mb-lg-0" key={index}>
                                                                        <Row >
                                                                            <Col lg={5}>
                                                                                <div className="mb-3 mb-lg-0">
                                                                                    <Label htmlFor="choices-Category-input" className="form-label">Category</Label>
                                                                                    <Select
                                                                                        value={category}
                                                                                        onChange={(category) => {
                                                                                            setCategory(category);
                                                                                        }}
                                                                                        options={courseCategory}
                                                                                        id="choices-single-default"
                                                                                        className="js-example-basic-single mb-0"
                                                                                        name="category"
                                                                                    />
                                                                                </div>
                                                                            </Col>
                                                                            <Col lg={5}>
                                                                                <div className="mb-3 mb-lg-0">
                                                                                    <Label htmlFor="choices-SubCategory-input" className="form-label">Sub Category</Label>

                                                                                    <Select
                                                                                        value={subCategory}
                                                                                        onChange={(subCategory) => {
                                                                                            setSubCategory(subCategory);
                                                                                        }}
                                                                                        options={courseSubCategory}
                                                                                        id="choices-single-default"
                                                                                        className="js-example-basic-single mb-0"
                                                                                        name="subCategory"
                                                                                    />
                                                                                </div>
                                                                            </Col>
                                                                            {categoryMappings.length !== 1 && (<Col lg={2}>
                                                                                <Label />
                                                                                <div className="mb-3 mb-lg-0">
                                                                                    <Link to="#" onClick={() => {
                                                                                        onRemovedCategoryHandler(index);
                                                                                    }}>
                                                                                        <i class="ri-delete-bin-line mt-3" ></i>
                                                                                    </Link>
                                                                                </div>
                                                                            </Col>)}
                                                                        </Row>
                                                                    </div>
                                                                ))
                                                            }

                                                            <Row>
                                                                <Col lg={6}>
                                                                    <div className="mb-3 mt-3 mb-lg-0">
                                                                        <p><Link to="#" className="link-info" onClick={onAddAnotherCategoryHandler}><i class="ri-add-circle-fill"></i> Add Another Category</Link></p>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row>

                                                    </Row>


                                                    {/* <div className="mb-3">
                                                        <Label
                                                            className="form-label"
                                                            htmlFor="gen-info-password-input"
                                                        >
                                                            Password
                                                        </Label>
                                                        <Input
                                                            type="password"
                                                            className="form-control"
                                                            id="gen-info-password-input"
                                                            placeholder="Enter Password"
                                                        />
                                                    </div> */}
                                                </div>
                                                <div className="d-flex align-items-start gap-3 mt-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                                        onClick={() => {
                                                            toggleTab(activeTab + 1, 33);
                                                        }}
                                                    >
                                                        <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                                                        Edit Price
                                                    </button>
                                                </div>
                                            </TabPane>

                                            <TabPane tabId={2}>
                                                <div>
                                                    <div className="mb-4">
                                                        <div>
                                                            <h5 className="mb-1">Edit Price</h5>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 mt-3">
                                                        <Row>
                                                            {/* <Col lg={6}>
                                                            <div className="mb-3 mb-lg-0">
                                                                <Label htmlFor="choices-Category-input" className="form-label">Category</Label>

                                                            </div>
                                                        </Col> */}

                                                            <Col lg={10}>
                                                                <div className="mb-3 mt-3">
                                                                    <Row>
                                                                        <Label htmlFor="choices-coureType-input" className="form-label">Course Type</Label>
                                                                        <Col lg={6}>
                                                                            <div className="mb-3 mb-lg-0">
                                                                                <div className="form-check mb-2">
                                                                                    <Input className="form-check-input" type="radio" name="flexRadioDefault" id="paidCourse" defaultChecked />
                                                                                    <Label className="form-check-label" htmlFor="paidCourse">
                                                                                        Paid Course
                                                                                    </Label>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                        <Col lg={6}>
                                                                            <div className="mb-3 mb-lg-0">
                                                                                <div className="form-check">
                                                                                    <Input className="form-check-input" type="radio" name="flexRadioDefault" id="freeCourse" />
                                                                                    <Label className="form-check-label" htmlFor="freeCourse">
                                                                                        Free Course
                                                                                    </Label>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                                <div className="mb-2 mt-3">
                                                                    <Row>
                                                                        <Col lg={8}>
                                                                            <div className="mb-3 mb-lg-0">
                                                                                <Label htmlFor="select-course-duration-input" className="form-label">Course Duration Type</Label>
                                                                                <Select
                                                                                    value={courseValidityType}
                                                                                    onChange={(courseValidityType) => {
                                                                                        setCourseValidityType(courseValidityType);
                                                                                    }}
                                                                                    options={courseDurationTypes}
                                                                                    id="select-course-duration-input"
                                                                                    className="js-example-basic-single mb-0"
                                                                                    name="courseDurationType"
                                                                                />
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                                {/* Single Validity Block */}
                                                                {courseValidityType && courseValidityType.value === "SingleValidity" && (
                                                                    <>
                                                                        <Row>
                                                                            <Col lg={5}>
                                                                                <div className="mt-3">
                                                                                    <div className="input-group mb-3">
                                                                                        <Input
                                                                                            type="number"
                                                                                            className="form-control"
                                                                                            id="singleValidityDuration"
                                                                                            // placeholder="Enter Stocks"
                                                                                            name="singleValidityDuration"
                                                                                        // value={validation.values.stock || ""}
                                                                                        // onBlur={validation.handleBlur}
                                                                                        // onChange={validation.handleChange}
                                                                                        // invalid={validation.errors.stock && validation.touched.stock ? true : false}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col lg={3} >
                                                                                <div className="mt-3 mb-3 mb-lg-0">
                                                                                    <Select
                                                                                        value={singleValidityType}
                                                                                        onChange={(singleValidityType) => {
                                                                                            setSingleValidityType(singleValidityType);
                                                                                        }}
                                                                                        options={singleValidityDurationTypes}
                                                                                        id="select-course-duration-input"
                                                                                        className="js-example-basic-single mb-0"
                                                                                        name="singleValidityDurationType"
                                                                                    />
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col lg={8}>
                                                                                <Row>
                                                                                    <Col sm={4}>
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                className="form-label"
                                                                                                htmlFor="course-price-input"
                                                                                            >
                                                                                                Price
                                                                                            </label>
                                                                                            <div className="input-group mb-3">
                                                                                                <span
                                                                                                    className="input-group-text"
                                                                                                    id="course-price-addon"
                                                                                                >
                                                                                                    ₹
                                                                                                </span>
                                                                                                <Input
                                                                                                    type="text"
                                                                                                    className="form-control"
                                                                                                    id="course-price-input"
                                                                                                    placeholder="Enter price"
                                                                                                    name="price"
                                                                                                    aria-label="Price"
                                                                                                    aria-describedby="course-price-addon"
                                                                                                // value={validation.values.price || ""}
                                                                                                // onBlur={validation.handleBlur}
                                                                                                // onChange={validation.handleChange}
                                                                                                // invalid={validation.errors.price && validation.touched.price ? true : false}
                                                                                                />
                                                                                                {/* {validation.errors.price && validation.touched.price ? (
                                                                                <FormFeedback type="invalid">{validation.errors.price}</FormFeedback>
                                                                            ) : null} */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>
                                                                                    <Col sm={4}>
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                className="form-label"
                                                                                                htmlFor="course-discount-input"
                                                                                            >
                                                                                                Discount
                                                                                            </label>
                                                                                            <div className="input-group mb-3">
                                                                                                <span
                                                                                                    className="input-group-text"
                                                                                                    id="course-discount-addon"
                                                                                                >
                                                                                                    ₹
                                                                                                </span>
                                                                                                <Input
                                                                                                    type="text"
                                                                                                    className="form-control"
                                                                                                    id="course-discount-input"
                                                                                                    placeholder="Enter discount"
                                                                                                    name="discount"
                                                                                                    aria-label="Discount"
                                                                                                    aria-describedby="course-discount-addon"
                                                                                                // value={validation.values.price || ""}
                                                                                                // onBlur={validation.handleBlur}
                                                                                                // onChange={validation.handleChange}
                                                                                                // invalid={validation.errors.price && validation.touched.price ? true : false}
                                                                                                />
                                                                                                {/* {validation.errors.price && validation.touched.price ? (
                                                                                <FormFeedback type="invalid">{validation.errors.price}</FormFeedback>
                                                                            ) : null} */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>
                                                                                    <Col sm={4}>
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                className="form-label"
                                                                                                htmlFor="course-effictive-price-input"
                                                                                            >
                                                                                                Effective Price
                                                                                            </label>
                                                                                            <div className="input-group mb-3">
                                                                                                <span
                                                                                                    className="input-group-text"
                                                                                                    id="course-effictive-price-addon"
                                                                                                >
                                                                                                    ₹
                                                                                                </span>
                                                                                                <Input
                                                                                                    type="text"
                                                                                                    className="form-control "
                                                                                                    id="course-effictive-price-input"
                                                                                                    placeholder="Enter Effective price"
                                                                                                    name="effectivePrice"
                                                                                                    aria-label="Effective Price"
                                                                                                    aria-describedby="course-effictive-price-addon"
                                                                                                // value={validation.values.price || ""}
                                                                                                // onBlur={validation.handleBlur}
                                                                                                // onChange={validation.handleChange}
                                                                                                // invalid={validation.errors.price && validation.touched.price ? true : false}
                                                                                                />
                                                                                                {/* {validation.errors.price && validation.touched.price ? (
                                                                                <FormFeedback type="invalid">{validation.errors.price}</FormFeedback>
                                                                            ) : null} */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>

                                                                        </Row>
                                                                    </>
                                                                )}

                                                                {courseValidityType && courseValidityType.value === "MultipleValidity" && (<>
                                                                    <div className="mt-3" >
                                                                        <Row>
                                                                            <Col lg={8}>
                                                                                {MultiValidityPlansData.map((plan, index) => (
                                                                                    <MultiValidityCard
                                                                                        key={index}
                                                                                        plan={plan}
                                                                                        isEditing={plan.isEditing}
                                                                                        onEdit={onEditMultiValidityHandler}
                                                                                        onCancel={onCancelMultiValidityHandler}
                                                                                        onDelete={onDeleteMultiValidityHandler}
                                                                                        onSave={onSaveMultiValidityHandler}
                                                                                    />))
                                                                                }
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col lg={8}>
                                                                                <p><Link to="#" className="link-info" onClick={onAddValidityOptionHandler}><i class="ri-add-circle-fill"></i> Add Another Validity Option</Link></p>
                                                                            </Col>
                                                                        </Row>

                                                                    </div>
                                                                </>)}

                                                                {
                                                                    courseValidityType && courseValidityType.value === "CourseExpiryDate" && (
                                                                        <div className="mt-3 mb-3" >
                                                                            <Row>
                                                                                <Col lg={8}>
                                                                                    <Row>
                                                                                        <Col lg={6}>
                                                                                            <div>
                                                                                                <Label className="form-label mb-0">Expiry Date</Label>
                                                                                                <Flatpickr
                                                                                                    className="form-control"
                                                                                                    options={{
                                                                                                        dateFormat: "d M, Y",

                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        </div>
                                                                    )
                                                                }

                                                                {courseValidityType && (courseValidityType.value === "LifetimeValidity" || courseValidityType.value === "CourseExpiryDate") && (
                                                                    <div className="mt-3 mb-3" >
                                                                        <Row>
                                                                            <Col lg={8}>
                                                                                <Row>
                                                                                    <Col sm={4}>
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                className="form-label"
                                                                                                htmlFor="course-price-input"
                                                                                            >
                                                                                                Price
                                                                                            </label>
                                                                                            <div className="input-group mb-3">
                                                                                                <span
                                                                                                    className="input-group-text"
                                                                                                    id="course-price-addon"
                                                                                                >
                                                                                                    ₹
                                                                                                </span>
                                                                                                <Input
                                                                                                    type="text"
                                                                                                    className="form-control"
                                                                                                    id="course-price-input"
                                                                                                    placeholder="Enter price"
                                                                                                    name="price"
                                                                                                    aria-label="Price"
                                                                                                    aria-describedby="course-price-addon"
                                                                                                // value={validation.values.price || ""}
                                                                                                // onBlur={validation.handleBlur}
                                                                                                // onChange={validation.handleChange}
                                                                                                // invalid={validation.errors.price && validation.touched.price ? true : false}
                                                                                                />
                                                                                                {/* {validation.errors.price && validation.touched.price ? (
                                                                                <FormFeedback type="invalid">{validation.errors.price}</FormFeedback>
                                                                            ) : null} */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>
                                                                                    <Col sm={4}>
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                className="form-label"
                                                                                                htmlFor="course-discount-input"
                                                                                            >
                                                                                                Discount
                                                                                            </label>
                                                                                            <div className="input-group mb-3">
                                                                                                <span
                                                                                                    className="input-group-text"
                                                                                                    id="course-discount-addon"
                                                                                                >
                                                                                                    ₹
                                                                                                </span>
                                                                                                <Input
                                                                                                    type="text"
                                                                                                    className="form-control"
                                                                                                    id="course-discount-input"
                                                                                                    placeholder="Enter discount"
                                                                                                    name="discount"
                                                                                                    aria-label="Discount"
                                                                                                    aria-describedby="course-discount-addon"
                                                                                                // value={validation.values.price || ""}
                                                                                                // onBlur={validation.handleBlur}
                                                                                                // onChange={validation.handleChange}
                                                                                                // invalid={validation.errors.price && validation.touched.price ? true : false}
                                                                                                />
                                                                                                {/* {validation.errors.price && validation.touched.price ? (
                                                                                <FormFeedback type="invalid">{validation.errors.price}</FormFeedback>
                                                                            ) : null} */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>
                                                                                    <Col sm={4}>
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                className="form-label"
                                                                                                htmlFor="course-effictive-price-input"
                                                                                            >
                                                                                                Effective Price
                                                                                            </label>
                                                                                            <div className="input-group mb-3">
                                                                                                <span
                                                                                                    className="input-group-text"
                                                                                                    id="course-effictive-price-addon"
                                                                                                >
                                                                                                    ₹
                                                                                                </span>
                                                                                                <Input
                                                                                                    type="text"
                                                                                                    className="form-control "
                                                                                                    id="course-effictive-price-input"
                                                                                                    placeholder="Enter Effective price"
                                                                                                    name="effectivePrice"
                                                                                                    aria-label="Effective Price"
                                                                                                    aria-describedby="course-effictive-price-addon"
                                                                                                // value={validation.values.price || ""}
                                                                                                // onBlur={validation.handleBlur}
                                                                                                // onChange={validation.handleChange}
                                                                                                // invalid={validation.errors.price && validation.touched.price ? true : false}
                                                                                                />
                                                                                                {/* {validation.errors.price && validation.touched.price ? (
                                                                                <FormFeedback type="invalid">{validation.errors.price}</FormFeedback>
                                                                            ) : null} */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>

                                                                        </Row>
                                                                    </div>
                                                                )}

                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-start gap-3 mt-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-decoration-none btn-label previestab"
                                                        onClick={() => {
                                                            toggleTab(activeTab - 1, 0);
                                                        }}
                                                    >
                                                        <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>{" "}
                                                        Back to Basic Information
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                                        onClick={() => {
                                                            toggleTab(activeTab + 1, 67);
                                                        }}
                                                    >
                                                        <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                                                        Add Content
                                                    </button>
                                                </div>
                                            </TabPane>

                                            <TabPane tabId={3}>
                                                <div>
                                                    <div className="text-center">
                                                        <div className="mb-4">
                                                            <lord-icon
                                                                src="https://cdn.lordicon.com/lupuorrc.json"
                                                                trigger="loop"
                                                                colors="primary:#0ab39c,secondary:#405189"
                                                                style={{ width: "120px", height: "120px" }}
                                                            ></lord-icon>
                                                        </div>
                                                        {/* <h5>Well Done !</h5> */}
                                                        <p className="text-muted">
                                                            3rd tab content goes here.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-start gap-3 mt-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-decoration-none btn-label previestab"
                                                        onClick={() => {
                                                            toggleTab(activeTab - 1, 67);
                                                        }}
                                                    >
                                                        <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>{" "}
                                                        Back to General
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                                        onClick={() => {
                                                            toggleTab(activeTab + 1, 100);
                                                        }}
                                                    >
                                                        <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                                                        Submit
                                                    </button>
                                                </div>
                                            </TabPane>
                                            <TabPane tabId={4}>
                                                <div>
                                                    <div className="text-center">
                                                        <div className="mb-4">
                                                            <lord-icon
                                                                src="https://cdn.lordicon.com/lupuorrc.json"
                                                                trigger="loop"
                                                                colors="primary:#0ab39c,secondary:#405189"
                                                                style={{ width: "120px", height: "120px" }}
                                                            ></lord-icon>
                                                        </div>
                                                        <h5>Well Done !</h5>
                                                        <p className="text-muted">
                                                            You have Successfully Signed Up
                                                        </p>
                                                    </div>
                                                </div>
                                            </TabPane>
                                        </TabContent>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <div className="mb-3">
                                        <Label className="form-label" htmlFor="project-title-input">Project Title</Label>
                                        <Input type="text" className="form-control" id="project-title-input"
                                            placeholder="Enter project title" />
                                    </div>

                                    <div className="mb-3">
                                        <Label className="form-label" htmlFor="project-thumbnail-img">Thumbnail Image</Label>
                                        <Input className="form-control" id="project-thumbnail-img" type="file" accept="image/png, image/gif, image/jpeg" />
                                    </div>

                                    <div className="mb-3">
                                        <Label className="form-label">Project Description</Label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data="<p>Hello from CKEditor 5!</p>"
                                            onReady={(editor) => {
                                                // You can store the "editor" and use when it is needed.
                                                
                                            }}
                                            // onChange={(editor) => {
                                            //     editor.getData();
                                            // }}
                                            />
                                    </div>

                                    <Row>
                                        <Col lg={4}>
                                            <div className="mb-3 mb-lg-0">
                                                <Label htmlFor="choices-priority-input" className="form-label">Priority</Label>
                                                <select className="form-select" data-choices data-choices-search-false
                                                    id="choices-priority-input">
                                                    <option defaultValue="High">High</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Low">Low</option>
                                                </select>
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="mb-3 mb-lg-0">
                                                <Label htmlFor="choices-status-input" className="form-label">Status</Label>
                                                <select className="form-select" data-choices data-choices-search-false
                                                    id="choices-status-input">
                                                    <option defaultValue="Inprogress">Inprogress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div>
                                                <Label htmlFor="datepicker-deadline-input" className="form-label">Deadline</Label>
                                                <Flatpickr
                                                    className="form-control"
                                                    options={{
                                                    dateFormat: "d M, Y"
                                                    }}
                                                    placeholder="Enter due date"
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>

                            <div className="text-end mb-4">
                                <button type="submit" className="btn btn-danger w-sm me-1">Delete</button>
                                <button type="submit" className="btn btn-secondary w-sm me-1">Draft</button>
                                <button type="submit" className="btn btn-success w-sm">Create</button>
                            </div>
                        </Col> */}

                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CreateCourse;