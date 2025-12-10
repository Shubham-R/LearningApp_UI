import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import classnames from "classnames";
import { cloneDeep } from "lodash";
import React, { useState, useCallback, useEffect } from 'react';
import Flatpickr from "react-flatpickr";
import { Link , useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
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
import { createSelector } from "reselect";
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { MultiValidityCard } from "./MultiValidityCard";

import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
//redux
import { useSelector, useDispatch } from "react-redux";
//import action
import {
    addNewFile as onAddNewFile,
    addNewFolder as onAddNewFolder,
    deleteFile as onDeleteFile,
    deleteFolder as onDeleteFolder,
    getFiles as onGetFiles,
    getFolders as onGetFolders,
    updateFile as onupdateFile,
    updateFolder as onupdateFolder
} from "../../../slices/thunks";

// Formik
import { useFormik } from "formik";
import * as Yup from "yup";
import { completeVideoUploadAPI, createDraftCourseAPI, createPricingAPI, getAllCategoriesAPI, getAllFoldersByCourseIDAPI, getConetntDataByCourseIDAPI, getCourseDetailAPI, getCourseListAPI, initiateVideoUploadAPI, publishCourseAPI, updateCourseImageAPI, updateDraftCourseAPI, updatePriceAPI,getCoursePricingAPI } from "../../../api/course";
import moment from "moment";
import SimpleBar from "simplebar-react";
import { AddFolder } from "./Modals/AddFolder";
import { AddVideo } from "./Modals/AddVideo";
import { AddDocument } from "./Modals/AddDocument";
import { AddImage } from "./Modals/AddImage";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";
import VideoModal from "./Modals/VideoModal";
import axios from "axios";

const CreateCourse = () => {
    const location = useLocation();
    const { courseData: editCourseData, isEditMode ,courseStatus} = location.state || {};
    const [previewImage, setPreviewImage] = useState(null);
    const [activeTab, setactiveTab] = useState(1);
    const [progressbarvalue, setprogressbarvalue] = useState(0);
    const [passedSteps, setPassedSteps] = useState([1]);
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
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subOptionsByRow, setSubOptionsByRow] = useState([[]]);
    const [courseData, setCourseData] = useState("");
    const [singleValidityDuration, setSingleValidityDuration] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [effectivePrice, setEffectivePrice] = useState("");
    const [priceData, setPriceData] = useState("");
    const [contents, setContents] = useState(null);
    const [modal_folder, setmodal_folder] = useState(false);
    
    function tog_folder() {
        setmodal_folder(!modal_folder);
    }

    const [modal_uploadVideo, setmodal_uploadVideo] = useState(false);
    function tog_video() {
        setmodal_uploadVideo(!modal_uploadVideo);
    }

    const [modal_uploadDocument, setmodal_uploadDocument] = useState(false);
    function tog_document() {
        setmodal_uploadDocument(!modal_uploadDocument);
    }

    const [modal_uploadImage, setmodal_uploadImage] = useState(false);
    function tog_image() {
        setmodal_uploadImage(!modal_uploadImage);
    }

    // Calculate effective price whenever price or discount changes
    useEffect(() => {
        if (price && discount) {
            const discounted = price - (price * (discount / 100));
            setEffectivePrice(discounted.toFixed(2));
        } else {
            setEffectivePrice(price || "");
        }
    }, [price, discount]);

    const dispatch = useDispatch();

    const selectLayoutState = (state) => state.FileManager;
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (state) => ({
            folders: state.folders,
            files: state.files,
        })
    );
    // Inside your component
    const {
        folders, files
    } = useSelector(selectLayoutProperties);


    const [deleteModal, setDeleteModal] = useState(false);

    const [deleteAlt, setDeleteAlt] = useState(false);

    // Folders
    const [folder, setFolder] = useState(null);
    const [modalFolder, setModalFolder] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        dispatch(onGetFolders());
    }, [dispatch]);

    useEffect(() => {
        setFolder(folders);
    }, [folders]);

    const folderToggle = useCallback(() => {
        if (modalFolder) {
            setModalFolder(false);
            setFolder(null);
        } else {
            setModalFolder(true);
        }
    }, [modalFolder]);

    // Files
    const [file, setFile] = useState(null);
    const [modalFile, setModalFile] = useState(false);


    const [fileList, setFileList] = useState(files);

    useEffect(() => {
        dispatch(onGetFiles());
    }, [dispatch]);

    useEffect(() => {
        setFile(files);
        setFileList(files);
    }, [files]);

    const fileToggle = useCallback(() => {
        if (modalFile) {
            setModalFile(false);
            setFile(null);
        } else {
            setModalFile(true);
        }
    }, [modalFile]);

    const [sidebarData, setSidebarData] = useState("");

    const [filterActive, setFilterActive] = useState("");

    const fileCategory = (e, ele) => {
        setFilterActive(ele);
        // document.getElementById("folder-list").style.display = "none";
        setFileList(
            files.filter((item) => item.fileType === e)
        );
    };


    // SideBar Open
    function sidebarOpen(value) {
        const element = document.getElementsByTagName('body')[0];
        element.classList.add(value);
    }

    // SideBar Close
    function sidebarClose(value) {
        const element = document.getElementsByTagName('body')[0];
        element.classList.remove(value);
    }

    useEffect(() => {
        sidebarOpen("file-detail-show");
    }, []);

    // Folder validation
    const folderValidation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            folderName: (folder && folder.folderName) || '',
            folderFile: (folder && folder.folderFile) || '',
            size: (folder && folder.size) || '',
        },
        validationSchema: Yup.object({
            folderName: Yup.string().required("Please Enter Folder Name"),
        }),
        onSubmit: (values) => {
            if (isEdit) {
                const updateFolder = {
                    id: folder ? folder.id : 0,
                    folderName: values.folderName,
                    folderFile: values.folderFile,
                    size: values.size
                };
                // save edit Folder
                dispatch(onupdateFolder(updateFolder));
                folderValidation.resetForm();

            } else {
                const newFolder = {
                    id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
                    folderName: values["folderName"],
                    folderFile: "0",
                    size: "0"
                };
                // save new Folder
                dispatch(onAddNewFolder(newFolder));
                folderValidation.resetForm();
            }
            folderToggle();
        },
    });


    const dateFormat = () => {
        let d = new Date(),
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
    };


    // File validation
    const fileValidation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            fileName: (file && file.fileName) || '',
            fileItem: (file && file.fileItem) || '',
            size: (file && file.size) || '',
        },
        validationSchema: Yup.object({
            fileName: Yup.string().required("Please Enter File Name"),
        }),
        onSubmit: (values) => {
            if (isEdit) {
                const updateFile = {
                    id: file ? file.id : 0,
                    fileName: values.fileName,
                    fileItem: values.fileItem,
                    size: values.size
                };
                // save edit File
                dispatch(onupdateFile(updateFile));
                fileValidation.resetForm();

            } else {
                const newFile = {
                    id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
                    fileName: values.fileName + ".txt",
                    fileItem: "0",
                    icon: "ri-file-text-fill",
                    iconClass: "secondary",
                    fileType: "Documents",
                    size: "0 KB",
                    createDate: dateFormat(),
                };
                // save new File
                dispatch(onAddNewFile(newFile));
                fileValidation.resetForm();
            }
            fileToggle();
        },
    });

    // Course duration type - PAID COURSE
    const paidCourseDurationTypes = [
        {
            options: [
                { label: "Single Validity", value: "SingleValidity" },
                { label: "Multiple Validity", value: "MultipleValidity" },
                { label: "Lifetime Validity", value: "LifetimeValidity" },
                { label: "Course Expiry Date", value: "CourseExpiryDate" },
            ],
        },
    ];

    // Course duration type - FREE COURSE
    const freeCourseDurationTypes = [
        {
            options: [
                { label: "Single Validity", value: "SingleValidity" },
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

    // Multi-Validity Handlers
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

    //#region Fetch All Courses
    const fetchCourses = async () => {
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
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Formik setup of edit price
    const coursePricingValidation = useFormik({
        enableReinitialize: true,
        initialValues: {
            planType: "PAID",
            price: "",
            discountPercent: "",
            effectivePrice: "",
            expiryDate: "",
            single: null,
            multiple: null,
            lifetimePrice: null,
            targetCourseId: null
        },
        onSubmit: async (values) => {
            try {
                let payload = null;
                const planType = coursePricingValidation.values.planType;

                if (courseValidityType?.value === "MultipleValidity" && MultiValidityPlansData.length === 0) {
                    alert("Please add at least one validity option before proceeding.");
                    return;
                }

                // SINGLE VALIDITY PAYLOAD
                if (courseValidityType?.value === "SingleValidity") {
                    payload = {
                        courseId: courseData?.courseId,
                        planType: values.planType,
                        validityType: "SINGLE",
                        single: {
                            durationValue: Number(singleValidityDuration),
                            durationUnit: singleValidityType?.value?.toUpperCase() || "",
                            price: Number(price),
                            discountPercent: Number(discount),
                            effectivePrice: Number(effectivePrice),
                        },
                        draftFlag: true,
                    };
                    // Add targetCourseId only if planType is FREE
                    if (planType === "FREE" && values.targetCourseId) {
                        payload.targetCourseId = values.targetCourseId;
                    }
                }

                // MULTIPLE VALIDITY PAYLOAD
                else if (courseValidityType?.value === "MultipleValidity") {
                    payload = {
                        courseId: courseData?.courseId,
                        planType: values.planType,
                        validityType: "MULTIPLE",
                        multiple: MultiValidityPlansData.map((plan) => ({
                            durationValue: Number(plan.validityDuration),
                            durationUnit: plan.validityDurationType?.toUpperCase(),
                            price: Number(plan.price),
                            discountPercent: Number(plan.discount),
                            effectivePrice: Number(plan.effectivePrice),
                        })),
                        draftFlag: true,
                    };
                }

                // LIFETIME VALIDITY
                else if (courseValidityType?.value === "LifetimeValidity") {
                    payload = {
                        courseId: courseData?.courseId,
                        planType: values.planType,
                        validityType: "LIFETIME",
                        lifetimePrice: {
                            price: Number(values.price),
                            discountPercent: Number(values.discountPercent),
                            effectivePrice: Number(values.effectivePrice),
                        },
                        draftFlag: true,
                    };
                }

                // COURSE EXPIRY DATE VALIDITY
                else if (courseValidityType?.value === "CourseExpiryDate") {
                    payload = {
                        courseId: courseData?.courseId,
                        planType: values.planType,
                        validityType: "EXPIRY_DATE",
                        expiryDate: moment(values.expiryDate).format("YYYY-MM-DD"), // make sure Flatpickr value is in date format
                        lifetimePrice: {
                            price: Number(values.price),
                            discountPercent: Number(values.discountPercent),
                            effectivePrice: Number(values.effectivePrice),
                        },
                        draftFlag: true,
                    };

                    // Add targetCourseId only if planType is FREE
                    if (planType === "FREE" && values.targetCourseId) {
                        payload.targetCourseId = values.targetCourseId;
                    }
                }

                if (!payload) {
                    console.warn("No validity type selected.");
                    return;
                }

                // Check if we're updating existing pricing (has pricingId from priceData)
                if (priceData?.pricingId && priceData?.courseId) {
                    payload.courseId = priceData?.courseId;
                    payload.pricePlanId = priceData?.pricingId; // Use pricingId instead of pricePlanId
                    const updatePriceResponse = await updatePriceAPI(payload);
                    if (updatePriceResponse?.status === true && updatePriceResponse?.data) {
                        setPriceData(updatePriceResponse?.data);
                    }
                } else {
                    const response = await createPricingAPI(payload);
                    if (response?.status === true && response?.data) {
                        setPriceData(response?.data);
                    }
                }

                // Call API to fetch Content - Tab 3 listing
                await refreshContents(courseData?.courseId);
                toggleTab(activeTab + 1, 67);   // Now move to Content tab AFTER setting state

            } catch (error) {
                console.error("Error creating pricing:", error);
            }
        },
    });

    // Validation for enabling "Add Content" button
    const isPriceFormValid = () => {
        const planType = coursePricingValidation.values.planType;

        // must have plan type and course validity type
        if (!planType || !courseValidityType) return false;

        // PAID Course Validations
        if (planType === "PAID") {
            if (courseValidityType.value === "SingleValidity") {
                return (
                    singleValidityDuration &&
                    singleValidityType &&
                    price &&
                    discount !== "" &&
                    effectivePrice !== ""
                );
            }

            if (courseValidityType.value === "MultipleValidity") {
                return MultiValidityPlansData.length > 0;
            }

            if (courseValidityType.value === "LifetimeValidity") {
                return (
                    coursePricingValidation.values.price !== "" &&
                    coursePricingValidation.values.effectivePrice !== ""
                );
            }

            if (courseValidityType.value === "CourseExpiryDate") {
                return (
                    coursePricingValidation.values.expiryDate &&
                    coursePricingValidation.values.price !== "" &&
                    coursePricingValidation.values.effectivePrice !== ""
                );
            }
        }

        // FREE Course Validations
        if (planType === "FREE") {
            if (courseValidityType.value === "CourseExpiryDate") {
                return !!coursePricingValidation.values.expiryDate;
            }
            // Free course can pass if validity type selected
            return true;
        }

        return false;
    };

    // Fetch all categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await getAllCategoriesAPI();
                if (response?.status === true && Array.isArray(response?.data)) {
                    setCategoryMappings(response.data);
                } else {
                    setCategoryMappings([]);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategoryMappings([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Calculate effective price in Formik whenever price or discountPercent changes
    useEffect(() => {
        const price = Number(coursePricingValidation.values.price);
        const discount = Number(coursePricingValidation.values.discountPercent);

        if (!isNaN(price) && !isNaN(discount)) {
            const effective = price - (price * (discount / 100));
            coursePricingValidation.setFieldValue(
                "effectivePrice",
                effective.toFixed(2)
            );
        }
    }, [
        coursePricingValidation.values.price,
        coursePricingValidation.values.discountPercent
    ]);

    // Validation Schema
    const validationSchema = Yup.object().shape({
        courseName: Yup.string().required("Course name is required"),
        courseDescription: Yup.string().required("Description is required"),
    });

    // Formik Setup for basic info
    const formik = useFormik({
        initialValues: {
            courseName: "",
            courseDescription: "",
            courseImage: null,
            courseImageId: null,
            selectedCategories: [{ category: null, subCategory: [] }],
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const categoryMappingsPayload = values.selectedCategories
                    .filter((r) => r.category)
                    .map((r) => ({
                        categoryId: r.category.value,
                        categoryName: r.category.label,
                        subcategories:
                            Array.isArray(r.subCategory) && r.subCategory.length > 0
                                ? r.subCategory.map((sub) => {
                                    // If existing subcategory has ID - send subCategoryId
                                    if (sub.value && typeof sub.value === "number") {
                                        return { subCategoryId: sub.value };
                                    }
                                    // Else treat it as new - send subCategoryName
                                    return { subCategoryName: sub.label };
                                })
                                : [],
                    }));

                const payload = {
                    courseName: values.courseName,
                    courseDescription: values.courseDescription,
                    // courseImageUrl: values.courseImage
                    //     ? values.courseImage.name
                    //     : "http://default-image-url.com",
                    courseImageId: values.courseImageId,
                    categoryMappings: categoryMappingsPayload,
                };

                if (values.courseImage) {
                    // New image uploaded
                    payload.courseImageUrl = values.courseImage.name;
                } else if (courseData?.courseImageUrl) {
                    // Use existing image URL from courseData
                    payload.courseImageUrl = courseData.courseImageUrl;
                } else if (editCourseData?.courseImageUrl) {
                    // Use edit data image URL
                    payload.courseImageUrl = editCourseData.courseImageUrl;
                } else {
                    // Default fallback
                    payload.courseImageUrl = "http://default-image-url.com";
                }

                // If courseId exists, update draft course
                if (courseData?.courseId) {
                    payload.courseId = courseData?.courseId;
                    payload.courseStatus = courseData?.courseStatus;
                    const updateResponse = await updateDraftCourseAPI(payload);
                    if (updateResponse?.status === true && updateResponse?.data) {
                        setCourseData(updateResponse?.data);

                        // Fetch pricing data if in edit mode
                        if (isEditMode) {
                            const pricingParams = {
                                courseId: updateResponse.data.courseId,
                                expand: "durations"
                            };
                            const pricingResponse = await getCoursePricingAPI(pricingParams);

                            if (pricingResponse?.status && pricingResponse.data?.length > 0) {
                                const pricingData = pricingResponse.data[0];

                                // Set price data for update operations
                                setPriceData(pricingData);

                                // Set plan type (PAID/FREE)
                                coursePricingValidation.setFieldValue("planType", pricingData.planType || "PAID");

                                // Handle different validity types
                                if (pricingData.validityType === "SINGLE") {
                                    // Single Validity
                                    setCourseValidityType({
                                        value: "SingleValidity",
                                        label: "Single Validity"
                                    });

                                    // Check if durations array exists and has data
                                    if (pricingData.durations && pricingData.durations.length > 0) {
                                        const duration = pricingData.durations[0];
                                        setSingleValidityDuration(duration.duration?.toString() || "");
                                        setSingleValidityType({
                                            value: duration.durationUnit?.toLowerCase() || "months",
                                            label: `${duration.durationUnit?.charAt(0)}${duration.durationUnit?.slice(1).toLowerCase()}(s)`
                                        });
                                        setPrice(duration.price?.toString() || "0");
                                        setDiscount(duration.discountPercent?.toString() || "0");
                                        setEffectivePrice(duration.effectivePrice?.toString() || "0");
                                    }

                                    // Set target course for FREE courses
                                    if (pricingData.planType === "FREE" && pricingData.targetCourseId) {
                                        coursePricingValidation.setFieldValue("targetCourseId", pricingData.targetCourseId);
                                    }
                                }
                                else if (pricingData.validityType === "MULTIPLE") {
                                    // Multiple Validity
                                    setCourseValidityType({
                                        value: "MultipleValidity",
                                        label: "Multiple Validity"
                                    });

                                    if (pricingData.durations && pricingData.durations.length > 0) {
                                        const multiPlans = pricingData.durations.map((dur, index) => ({
                                            planId: index + 1,
                                            validityDuration: dur.duration,
                                            validityDurationType: dur.durationUnit?.toLowerCase() || "months",
                                            price: dur.price || 0,
                                            discount: dur.discountPercent || 0,
                                            effectivePrice: dur.effectivePrice || 0,
                                            isPromoted: false,
                                            isEditing: false,
                                        }));
                                        setMultiValidityPlansData(multiPlans);
                                    }
                                }
                                else if (pricingData.validityType === "LIFETIME") {
                                    // Lifetime Validity
                                    setCourseValidityType({
                                        value: "LifetimeValidity",
                                        label: "Lifetime Validity"
                                    });

                                    coursePricingValidation.setFieldValue("price", pricingData.price?.toString() || "");
                                    coursePricingValidation.setFieldValue("discountPercent", pricingData.discountPercent?.toString() || "");
                                    coursePricingValidation.setFieldValue("effectivePrice", pricingData.effectivePrice?.toString() || "");
                                }
                                else if (pricingData.validityType === "EXPIRY_DATE") {
                                    // Course Expiry Date
                                    setCourseValidityType({
                                        value: "CourseExpiryDate",
                                        label: "Course Expiry Date"
                                    });

                                    // Set expiry date
                                    if (pricingData.expiryDate) {
                                        coursePricingValidation.setFieldValue("expiryDate", new Date(pricingData.expiryDate));
                                    }

                                    coursePricingValidation.setFieldValue("price", pricingData.price?.toString() || "");
                                    coursePricingValidation.setFieldValue("discountPercent", pricingData.discountPercent?.toString() || "");
                                    coursePricingValidation.setFieldValue("effectivePrice", pricingData.effectivePrice?.toString() || "");

                                    // Set target course for FREE courses
                                    if (pricingData.planType === "FREE" && pricingData.targetCourseId) {
                                        coursePricingValidation.setFieldValue("targetCourseId", pricingData.targetCourseId);
                                    }
                                }

                                // Move to pricing tab (tab 2)
                                toggleTab(2, 33);
                            }
                        }

                        toggleTab(activeTab + 1, 33);
                    }
                } else {
                    // Else, create a new draft course
                    const response = await createDraftCourseAPI(payload);
                    if (response?.status === true && response?.data) {
                        setCourseData(response?.data);
                        toggleTab(activeTab + 1, 33);
                    }
                }
            } catch (error) {
                console.error("Error creating draft course:", error);
            }
        },
    });

    // Thumbnail upload handler
    const handleThumbnailUpload = async (e) => {
        const file = e.currentTarget.files[0];
        if (!file) return;

        // Create preview for selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await updateCourseImageAPI(formData);
            if (response?.status) {
                formik.setFieldValue("courseImageId", response?.data?.imageId || null);

                Swal.fire({
                    icon: "success",
                    title: "Image Uploaded Successfully",
                    timer: 1200,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Upload Failed",
                    text: response?.error?.message || "Something went wrong."
                });
            }
        } catch (err) {
            console.error("Image upload failed:", err);
            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "Something went wrong while uploading the image."
            });
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        formik.setFieldValue("courseImage", null);
        formik.setFieldValue("courseImageId", null);
        // Reset file input
        const fileInput = document.getElementById("project-thumbnail-img");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    // Category change handler
    const handleRowCategoryChange = (index, selectedCategory) => {
        const updated = cloneDeep(formik.values.selectedCategories);
        updated[index].category = selectedCategory;
        updated[index].subCategory = [];
        formik.setFieldValue("selectedCategories", updated);

        const selectedCat = categoryMappings.find(
            (c) => c.categoryId === selectedCategory?.value
        );

        const subOptions = selectedCat?.subcategories
            ? selectedCat.subcategories.map((s) => ({
                value: s.subCategoryId,
                label: s.subCategoryName,
            }))
            : [];

        const newSubOptions = cloneDeep(subOptionsByRow);
        newSubOptions[index] = subOptions;
        setSubOptionsByRow(newSubOptions);
    };

    // Subcategory change handler
    const handleRowSubCategoryChange = (index, selectedSubs) => {
        const updated = cloneDeep(formik.values.selectedCategories);
        updated[index].subCategory = selectedSubs;
        formik.setFieldValue("selectedCategories", updated);
    };

    // Add another category
    const onAddAnotherCategoryHandler = (e) => {
        e?.preventDefault();
        const updated = cloneDeep(formik.values.selectedCategories);
        updated.push({ category: null, subCategory: [] });
        formik.setFieldValue("selectedCategories", updated);
        setSubOptionsByRow((prev) => [...prev, []]);
    };

    // Remove category
    const onRemovedCategoryHandler = (index) => {
        const updated = cloneDeep(formik.values.selectedCategories);
        if (updated.length === 1) return;
        updated.splice(index, 1);
        formik.setFieldValue("selectedCategories", updated);

        const newSubOptions = cloneDeep(subOptionsByRow);
        newSubOptions.splice(index, 1);
        setSubOptionsByRow(newSubOptions);
    };

    // Map fetched courses to dropdown options
    const courseOptions = courseList.map((course) => ({
        label: course.courseName,
        value: course.courseId,
    }));

    const onAddFolderHandler = (response) => {
        refreshContents(courseData?.courseId, currentFolder);
    };

    const detectFileType = (mimeType) => {
        if (!mimeType) return "file";

        if (mimeType.startsWith("video/")) return "video";
        if (mimeType.startsWith("image/")) return "image";
        if (mimeType.startsWith("audio/")) return "audio";

        // Document types
        if (mimeType === "application/pdf") return "pdf";
        if (mimeType.includes("word") || mimeType.includes("officedocument.wordprocessingml")) return "doc";
        if (mimeType.includes("spreadsheet")) return "excel";
        if (mimeType.includes("presentation")) return "ppt";

        return "document";
    };

    const getFileDisplayName = (fileType, contentId, mimeType) => {
        switch (fileType) {
            case "video":
                return `Video ${contentId}`;
            case "image":
                return `Image ${contentId}`;
            case "audio":
                return `Audio ${contentId}`;
            case "pdf":
                return `PDF Document ${contentId}`;
            case "doc":
                return `Word Document ${contentId}`;
            case "excel":
                return `Excel File ${contentId}`;
            case "ppt":
                return `PowerPoint ${contentId}`;
            default:
                return `File ${contentId}`;
        }
    };

    // Fetch Course content by course ID - list content API
    const refreshContents = async (courseId, folderID = 0) => {
        try {
            const res = await getConetntDataByCourseIDAPI(courseId, folderID);       
            if (!res) return;
            if(res.status) {
                const folderList = (res.data.courseContentFolderDetails || []).map(f => ({
                    id: f.folderId,
                    name: f.folderName,
                    type: "folder",
                    videoCount: f.total || 0,
                    url: null
                }));
    
                const fileList = (res.data.courseContentPresignedDetails || []).map(v => {
                    const fileType = detectFileType(v.mimeType);

                    return {
                        id: v.courseContentId,
                        name: getFileDisplayName(fileType, v.courseContentId, v.mimeType),
                        type: fileType,
                        url: v.presignedGetUrl
                    };
                });

                const finalData = [...folderList, ...fileList];
                setContents(finalData);               
            }

        } catch (err) {
            console.error("Error refreshing contents:", err);
        }
    };

    const [currentFolder, setCurrentFolder] = useState(null); // null = root
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState("");

    const toggleVideoModal = () => setVideoModalOpen(!videoModalOpen);

    // Inside Parent Folder - OPEN FOLDER
    const openFolder = (folder) => {
        setCurrentFolder(folder.id);
        setContents([]);
        // CALL API TO GET CHILD CONTENT
        refreshContents(courseData?.courseId, folder.id);
    };

    // GO BACK TO PARENT
    const goBackTo = () => {
        const folderId = 0;
        setCurrentFolder(folderId);
        refreshContents(courseData?.courseId, folderId); // load parent contents - folder id = 0 (parent folder)
    };


    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // FILE SELECTION HANDLER
        const handleFileChange = (e) => {
            setSelectedFiles([]);
            if (e.target.files) {
                const filesArray = Array.from(e.target.files);
                setSelectedFiles(filesArray);
            }
        };

    // FULL UPLOAD HANDLER
    const handleUpload = async () => {
        if (!selectedFiles.length) {
            Swal.fire({
                icon: "error",
                title: "Warning",
                text: "Select at least one file"
            });
            return;
        }

        setIsUploading(true);

        // --------- 1️ Detect File Type ----------
        const extension = selectedFiles[0].name.split(".").pop().toLowerCase();

        let mimeType = "application/octet-stream";

        if (selectedFiles[0].type.startsWith("video/")) {
            mimeType = selectedFiles[0].type; 
        } else if (selectedFiles[0].type.startsWith("image/")) {
            mimeType = selectedFiles[0].type;
        } else {
            // documents — map manually
            const docMimeMap = {
                pdf: "application/pdf",
                doc: "application/msword",
                docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                xls: "application/vnd.ms-excel",
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ppt: "application/vnd.ms-powerpoint",
                pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                txt: "text/plain"
            };

            mimeType = docMimeMap[extension] || "application/octet-stream";
        }

        // --------- 2️ Payload ----------
        let payload = {
            isExternal: currentFolder ? false : true,
            mimeType: mimeType,
            fileList: selectedFiles.map((file) => ({
                isLocked: false,
                fileName: file.name,
                size: file.size,
                multipart: false
            }))
        };

        if (currentFolder !== 0) {
            payload.folderId = currentFolder;
        }

        try {
            // --------- 3️ INITIATE UPLOAD ----------
            const initiateRes = await initiateVideoUploadAPI(
                payload,
                courseData?.courseId,
                "application/json"
            );

            if (!initiateRes?.status) {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: "Failed to initiate upload"
                });
                setIsUploading(false);
                return;
            }

            const uploadEntries = initiateRes.data;

            if (!uploadEntries?.length) {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: "No presigned URLs received!"
                });
                setIsUploading(false);
                return;
            }

            const uploadResults = [];

            // --------- 4️ UPLOAD EACH FILE TO AWS S3 PRESIGNED URL----------
            for (let i = 0; i < uploadEntries.length; i++) {

                const file = selectedFiles[i];
                const entry = uploadEntries[i];

                try {
                    const putRes = await axios.put(entry.presignedUrl, file, {
                        headers: { "Content-Type": file.type }
                    });

                    const eTag = putRes.headers?.etag?.replace(/"/g, "") || "no-etag-returned";

                    uploadResults.push({
                        uploadId: entry.uploadId,
                        eTag: eTag,
                        checksumSha256: ""
                    });

                } catch (uploadErr) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: `Upload failed for ${file.name}`
                    });
                    setIsUploading(false);
                    return;
                }
            }

            // --------- 5️ COMPLETE UPLOAD ----------
            const completeRes = await completeVideoUploadAPI(
                uploadResults,
                courseData?.courseId,
                "application/json"
            );

            if (completeRes?.status) {
                const uploadedItems = (completeRes.data || []).map((f) => ({
                    id: f.courseContentId,
                    name: f.fileName || "File",
                    type: selectedFiles[0].type.startsWith("image/")
                        ? "image"
                        : selectedFiles[0].type.startsWith("video/")
                            ? "video"
                            : "document",
                    url: f.presignedGetUrl
                }));

                await setContents(prev => [...prev, ...uploadedItems]);

                Swal.fire({
                    icon: "success",
                    title: "Uploaded Successfully",
                    timer: 1200,
                    showConfirmButton: false
                });

                onAddFolderHandler(completeRes);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Upload Failed",
                    text: "Something went wrong."
                });
            }

            if (selectedFiles[0].type.startsWith("image/")) tog_image();
            else if (selectedFiles[0].type.startsWith("video/")) tog_video();
            else tog_document();

        } catch (err) {
            console.error("Upload error -", err);
            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "Something went wrong."
            });
        }

        setIsUploading(false);
    };

    // Function to publish course
    const handlePublishCourse = async (courseId, onSuccess) => {
        try {
            Swal.fire({
                title: "Publishing...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await publishCourseAPI(courseId, "application/json");

            Swal.close();

            if (response?.status) {
                Swal.fire({
                    icon: "success",
                    title: "Course Published Successfully",
                    timer: 2000,
                    showConfirmButton: false,
                });

                if (onSuccess) onSuccess();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: response?.message || "Something went wrong while publishing the course.",
                });
            }
        } catch (err) {
            Swal.close();
            console.error("Publish error:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message || "Something went wrong while publishing the course.",
            });
        }
    };

    // Fetch full course details from API when in edit mode
    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (isEditMode && editCourseData && editCourseData.courseId) {
                try {
                    const payload = {
                        courseId: editCourseData.courseId,
                        courseName: editCourseData.courseName,
                        courseStatus: courseStatus
                    };
                    const response = await getCourseDetailAPI(payload);

                    if (response?.status === true && response?.data) {
                        const detailData = response.data;

                        // Populate basic information from API response
                        formik.setValues({
                            courseName: detailData.courseName || "",
                            courseDescription: detailData.courseDescription || "",
                            courseImage: null,
                            courseImageId: detailData.courseImageId || null,
                            selectedCategories: detailData.categoryMappings?.map(cat => ({
                                category: {
                                    value: cat.categoryId,
                                    label: cat.categoryName
                                },
                                subCategory: cat.subcategories?.map(sub => ({
                                    value: sub.subCategoryId,
                                    label: sub.subCategoryName
                                })) || []
                            })) || [{ category: null, subCategory: [] }]
                        });

                        // Set preview image if exists
                        if (detailData.courseImageUrl) {
                            setPreviewImage(detailData.courseImageUrl);
                        }

                        // Set course data with image URL
                        setCourseData({
                            courseId: detailData.courseId,
                            courseName: detailData.courseName,
                            courseStatus: detailData.courseStatus || "DRAFT",
                            courseImageUrl: detailData.courseImageUrl
                        });

                        // Populate subcategory options for each row
                        const subOptions = detailData.categoryMappings?.map(cat => {
                            return cat.subcategories?.map(sub => ({
                                value: sub.subCategoryId,
                                label: sub.subCategoryName
                            })) || [];
                        }) || [];
                        setSubOptionsByRow(subOptions);

                        // Populate pricing information if durations exist
                        if (detailData.durations && detailData.durations.length > 0) {
                            const duration = detailData.durations[0];

                            // Set validity type based on duration
                            if (duration.durationUnit) {
                                setCourseValidityType({
                                    value: "SingleValidity",
                                    label: "Single Validity"
                                });

                                setSingleValidityDuration(duration.durationValue);
                                setSingleValidityType({
                                    value: duration.durationUnit.toLowerCase(),
                                    label: `${duration.durationUnit.charAt(0)}${duration.durationUnit.slice(1).toLowerCase()}(s)`
                                });
                            }

                            // Set pricing
                            setPrice(detailData.globalPrice?.toString() || "");
                            setDiscount(detailData.globalDiscount?.toString() || "");
                            setEffectivePrice(detailData.globalEffectivePrice?.toString() || "");
                        }

                        // Set active tab to show data
                        setactiveTab(1);
                    }
                } catch (error) {
                    console.error("Error fetching course details:", error);
                }
            }
        };

        fetchCourseDetails();
    }, [editCourseData, isEditMode]);

    document.title = isEditMode ? "Update Course | Classplus" : "Create Course | Classplus";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        title={isEditMode ? "Update Course" : "Create Course"}
                        pageTitle="Courses"
                    />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-4">
                                        {isEditMode ? "Update content of your course" : "Add / View content of your course"}
                                    </h4>
                                    <div className="progress-nav mb-2">
                                        <Progress
                                            value={progressbarvalue}
                                            style={{ height: "1px" }}
                                        />
                                        <Nav
                                            className="nav-pills progress-bar-tab custom-nav"
                                            role="tablist"

                                        >
                                            <NavItem>
                                                <div className="align-items-center d-flex flex-column">
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
                                                        // onClick={() => {
                                                        //     toggleTab(1, 0);
                                                        // }}
                                                        tag="button"
                                                    >
                                                        1
                                                    </NavLink>
                                                    <div className="mt-2">
                                                        <span className="text-muted">
                                                            Basic Information
                                                        </span>
                                                    </div>
                                                </div>
                                            </NavItem>
                                            <NavItem>
                                                <div className="align-items-center d-flex flex-column">
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
                                                        // onClick={() => {
                                                        //     toggleTab(2, 33);
                                                        // }}
                                                        tag="button"
                                                    >
                                                        2
                                                    </NavLink>
                                                    <div className="mt-2">
                                                        <span className="text-muted">
                                                            Edit Price
                                                        </span>
                                                    </div>
                                                </div>

                                            </NavItem>
                                            <NavItem>
                                                <div className="align-items-center d-flex flex-column">
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
                                                        // onClick={() => {
                                                        //     toggleTab(3, 67);
                                                        // }}
                                                        tag="button"
                                                    >
                                                        3
                                                    </NavLink>
                                                    <div className="mt-2">
                                                        <span className="text-muted">
                                                            Add Content
                                                        </span>
                                                    </div>
                                                </div>

                                            </NavItem>
                                            <NavItem>
                                                <div className="align-items-center d-flex flex-column">
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
                                                        // onClick={() => {
                                                        //     toggleTab(4, 100);
                                                        // }}
                                                        tag="button"
                                                    >
                                                        4
                                                    </NavLink>
                                                    <div className="mt-2">
                                                        <span className="text-muted">
                                                            Bundle(Opional)
                                                        </span>
                                                    </div>
                                                </div>

                                            </NavItem>
                                        </Nav>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <Form action="#" className="form-steps">
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId={1}>
                                                <div>
                                                    {/* <div className="mb-4">
                                                        <div>
                                                            <h5 className="mb-1">Basic Information</h5>
                                                            <p className="text-muted">
                                                                Fill all Information as below
                                                            </p>
                                                        </div>
                                                    </div> */}
                                                    <Row>
                                                        <Col lg={6}>
                                                            <Row>
                                                                {/* Course Name */}
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
                                                                            name="courseName"
                                                                            value={formik.values.courseName}
                                                                            onChange={formik.handleChange}
                                                                        />
                                                                        {formik.touched.courseName && formik.errors.courseName && (
                                                                            <div className="text-danger">{formik.errors.courseName}</div>
                                                                        )}
                                                                    </div>
                                                                </Col>

                                                                {/* Description */}
                                                                <Col lg={12}>
                                                                    <div className="mb-3">
                                                                        <Label className="form-label">Description</Label>

                                                                        <textarea
                                                                            className="form-control"
                                                                            rows="6"
                                                                            value={formik.values.courseDescription}
                                                                            onChange={(e) => {
                                                                                formik.setFieldValue("courseDescription", e.target.value);
                                                                            }}
                                                                            onBlur={formik.handleBlur}
                                                                            name="courseDescription"
                                                                        />

                                                                        {formik.touched.courseDescription && formik.errors.courseDescription && (
                                                                            <div className="text-danger">{formik.errors.courseDescription}</div>
                                                                        )}
                                                                    </div>
                                                                </Col>

                                                                {/* Thumbnail */}
                                                                <Row>
                                                                    {/* File Input Column */}
                                                                    <Col lg={6}>
                                                                        <div>
                                                                            <Label className="form-label" htmlFor="project-thumbnail-img">
                                                                                Thumbnail Image
                                                                            </Label>

                                                                            {/* File Input */}
                                                                            <Input
                                                                                className="form-control"
                                                                                id="project-thumbnail-img"
                                                                                type="file"
                                                                                accept="image/png, image/gif, image/jpeg"
                                                                                onChange={handleThumbnailUpload}
                                                                            />
                                                                            <small className="text-muted">
                                                                                {previewImage ? 'Upload a new image to replace the current one' : 'Upload course thumbnail'}
                                                                            </small>
                                                                        </div>
                                                                    </Col>

                                                                    {/* Image Preview Column */}
                                                                    <Col lg={6}>
                                                                        {previewImage && (
                                                                            <div>
                                                                                <Label className="form-label">Preview</Label>
                                                                                <div className="position-relative" style={{ maxWidth: '300px' }}>
                                                                                    <img
                                                                                        src={previewImage}
                                                                                        alt="Course Thumbnail Preview"
                                                                                        className="img-fluid rounded"
                                                                                        style={{
                                                                                            width: '100%',
                                                                                            height: '50%',
                                                                                            objectFit: 'cover',
                                                                                            border: '2px solid #e9ecef'
                                                                                        }}
                                                                                    />
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                                                                        onClick={handleRemoveImage}
                                                                                        title="Remove Image"
                                                                                    >
                                                                                        <i className="ri-close-line"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Col>
                                                                </Row>
                                                            </Row>

                                                            {/* Category Rows */}
                                                            <div className="mb-3 mt-3 mb-lg-0">
                                                                {formik.values.selectedCategories.map((row, index) => (
                                                                    <Row key={index} className="mb-2 align-items-center">
                                                                        {/* Category */}
                                                                        <Col lg={5}>
                                                                            <div className="mb-3 mb-lg-0">
                                                                                <Label className="form-label">Category</Label>
                                                                                <Select
                                                                                    value={row.category}
                                                                                    onChange={(selected) =>
                                                                                        handleRowCategoryChange(index, selected)
                                                                                    }
                                                                                    options={categoryMappings.map((cat) => ({
                                                                                        value: cat.categoryId,
                                                                                        label: cat.categoryName,
                                                                                    }))}
                                                                                    className="js-example-basic-single mb-0"
                                                                                    name={`category-${index}`}
                                                                                    placeholder="Select Category"
                                                                                />
                                                                            </div>
                                                                        </Col>

                                                                        {/* Subcategory (Multi) */}
                                                                        <Col lg={5}>
                                                                            <div className="mb-3 mb-lg-0">
                                                                                <Label className="form-label">Sub Category</Label>
                                                                                <CreatableSelect
                                                                                    value={row.subCategory}
                                                                                    onChange={(selectedSub) =>
                                                                                        handleRowSubCategoryChange(index, selectedSub)
                                                                                    }
                                                                                    options={subOptionsByRow[index] || []}
                                                                                    className="js-example-basic-single mb-0"
                                                                                    name={`subCategory-${index}`}
                                                                                    placeholder="Select or add Sub Category"
                                                                                    isDisabled={!row.category}
                                                                                    isMulti={true}
                                                                                    // allow creating new options
                                                                                    formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                                                                                />
                                                                            </div>
                                                                        </Col>

                                                                        {/* Remove category row */}
                                                                        {formik.values.selectedCategories.length !== 1 && (
                                                                            <Col lg={2}>
                                                                                <Label />
                                                                                <div className="mb-3 mb-lg-0">
                                                                                    <Link
                                                                                        to="#"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            onRemovedCategoryHandler(index);
                                                                                        }}
                                                                                    >
                                                                                        <i className="ri-delete-bin-line mt-3"></i>
                                                                                    </Link>
                                                                                </div>
                                                                            </Col>
                                                                        )}
                                                                    </Row>
                                                                ))}
                                                            </div>

                                                            {/* Add Another Category */}
                                                            <Row>
                                                                <Col lg={6}>
                                                                    <div className="mb-3 mt-3 mb-lg-0">
                                                                        <p>
                                                                            <Link
                                                                                to="#"
                                                                                className="link-info"
                                                                                onClick={onAddAnotherCategoryHandler}
                                                                            >
                                                                                <i className="ri-add-circle-fill"></i> Add Another Category
                                                                            </Link>
                                                                        </p>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </div>

                                                {/* Edit Price Button */}
                                                <div className="d-flex align-items-start gap-3 mt-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                                        onClick={formik.handleSubmit}
                                                        disabled={!formik.isValid || !formik.dirty}
                                                    >
                                                        <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                                                        Edit Price
                                                    </button>
                                                </div>
                                            </TabPane>

                                            <TabPane tabId={2}>
                                                {/* <Form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        coursePricingValidation.handleSubmit();
                                                        return false;
                                                    }}
                                                    action="#"> */}
                                                <div>
                                                    <div className="mb-3">
                                                        <Row>
                                                            <Col lg={10}>
                                                                <div className="mb-3">
                                                                    <Row>
                                                                        <Label htmlFor="choices-coureType-input" className="form-label">Course Type</Label>
                                                                        <Col lg={6}>
                                                                            <div className="mb-3 mb-lg-0">
                                                                                <div className="form-check mb-2">
                                                                                    <Input
                                                                                        className="form-check-input" type="radio"
                                                                                        name="planType"
                                                                                        value={"PAID"}
                                                                                        id="paidCourse"
                                                                                        onChange={(e) => {
                                                                                            coursePricingValidation.handleChange(e);
                                                                                            setCourseValidityType(null);       // Reset validity type
                                                                                            setSingleValidityDuration("");     // clear single validity data
                                                                                            setSingleValidityType(null);
                                                                                            setPrice("");
                                                                                            setDiscount("");
                                                                                            setEffectivePrice("");
                                                                                            setMultiValidityPlansData([]);     // clear multiple validity plans
                                                                                        }}
                                                                                        checked={coursePricingValidation.values.planType === "PAID"}
                                                                                    />
                                                                                    <Label className="form-check-label" htmlFor="paidCourse">
                                                                                        Paid Course
                                                                                    </Label>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                        <Col lg={6}>
                                                                            <div className="mb-3 mb-lg-0">
                                                                                <div className="form-check">
                                                                                    <Input
                                                                                        className="form-check-input" type="radio"
                                                                                        name="planType"
                                                                                        value={"FREE"}
                                                                                        id="freeCourse"
                                                                                        onChange={(e) => {
                                                                                            coursePricingValidation.handleChange(e);
                                                                                            setCourseValidityType(null);       // Reset validity type
                                                                                            setSingleValidityDuration("");
                                                                                            setSingleValidityType(null);
                                                                                            setPrice("");
                                                                                            setDiscount("");
                                                                                            setEffectivePrice("");
                                                                                            setMultiValidityPlansData([]);
                                                                                        }}
                                                                                        checked={coursePricingValidation.values.planType === "FREE"}
                                                                                    />
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
                                                                                    options={coursePricingValidation.values.planType === "PAID" ? paidCourseDurationTypes : freeCourseDurationTypes}
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
                                                                                            placeholder="Enter duration"
                                                                                            name="singleValidityDuration"
                                                                                            value={singleValidityDuration}
                                                                                            onChange={(e) => setSingleValidityDuration(e.target.value)}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col lg={3}>
                                                                                <div className="mt-3 mb-3 mb-lg-0">
                                                                                    <Select
                                                                                        value={singleValidityType}
                                                                                        onChange={(selected) => setSingleValidityType(selected)}
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
                                                                                {coursePricingValidation.values.planType === "PAID" && (
                                                                                    <Row>
                                                                                        <Col sm={4}>
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label" htmlFor="course-price-input">
                                                                                                    Price
                                                                                                </label>
                                                                                                <div className="input-group mb-3">
                                                                                                    <span className="input-group-text" id="course-price-addon">₹</span>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        className="form-control"
                                                                                                        id="course-price-input"
                                                                                                        placeholder="Enter price"
                                                                                                        value={price}
                                                                                                        onChange={(e) => setPrice(e.target.value)}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </Col>

                                                                                        <Col sm={4}>
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label" htmlFor="course-discount-input">
                                                                                                    Discount (%)
                                                                                                </label>
                                                                                                <div className="input-group mb-3">
                                                                                                    <span className="input-group-text" id="course-discount-addon">₹</span>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        className="form-control"
                                                                                                        id="course-discount-input"
                                                                                                        placeholder="Enter discount"
                                                                                                        value={discount}
                                                                                                        onChange={(e) => setDiscount(e.target.value)}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </Col>

                                                                                        <Col sm={4}>
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label" htmlFor="course-effective-price-input">
                                                                                                    Effective Price
                                                                                                </label>
                                                                                                <div className="input-group mb-3">
                                                                                                    <span className="input-group-text" id="course-effective-price-addon">₹</span>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        className="form-control"
                                                                                                        id="course-effective-price-input"
                                                                                                        placeholder="Enter effective price"
                                                                                                        value={effectivePrice}
                                                                                                        // onChange={(e) => setEffectivePrice(e.target.value)}
                                                                                                        readOnly
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                )}

                                                                                {coursePricingValidation.values.planType === "FREE" && (
                                                                                    <div className="mb-3 mb-lg-0">
                                                                                        <Label
                                                                                            htmlFor="select-course-duration-input"
                                                                                            className="form-label"
                                                                                        >
                                                                                            Target Course
                                                                                        </Label>
                                                                                        <Select
                                                                                            value={
                                                                                                courseOptions.find(
                                                                                                    (option) =>
                                                                                                        option.value ===
                                                                                                        coursePricingValidation.values.targetCourseId
                                                                                                ) || null
                                                                                            }
                                                                                            onChange={(selected) =>
                                                                                                coursePricingValidation.setFieldValue(
                                                                                                    "targetCourseId",
                                                                                                    selected?.value || null
                                                                                                )
                                                                                            }
                                                                                            options={courseOptions}
                                                                                            id="select-course-duration-input"
                                                                                            className="js-example-basic-single mb-0"
                                                                                            name="targetCourseId"
                                                                                            placeholder="Select Target Course"
                                                                                            isClearable
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </Col>
                                                                        </Row>
                                                                    </>
                                                                )}

                                                                {/* Multi Validity Block */}
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
                                                                                        onUpdate={(planId, updatedPlan) => {
                                                                                            const copy = [...MultiValidityPlansData];
                                                                                            const idx = copy.findIndex((p) => p.planId === planId);
                                                                                            if (idx !== -1) {
                                                                                                copy[idx] = { ...copy[idx], ...updatedPlan };
                                                                                                setMultiValidityPlansData(copy);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                ))}
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col lg={8}>
                                                                                <p><Link to="#" className="link-info" onClick={onAddValidityOptionHandler}><i class="ri-add-circle-fill"></i> Add Another Validity Option</Link></p>
                                                                            </Col>
                                                                        </Row>

                                                                    </div>
                                                                </>)}
                                                                
                                                                {/* Expiry Date Block */}
                                                                {courseValidityType && courseValidityType.value === "CourseExpiryDate" && (
                                                                    <div className="mt-3 mb-3" >
                                                                        <Row>
                                                                            <Col lg={8}>
                                                                                <Row>
                                                                                    <Col lg={6}>
                                                                                        <div>
                                                                                            <Label className="form-label mb-2">Expiry Date</Label>
                                                                                            <Flatpickr
                                                                                                className="form-control"
                                                                                                options={{
                                                                                                    dateFormat: "d M, Y",

                                                                                                }}
                                                                                                name="expiryDate"
                                                                                                value={coursePricingValidation.values.expiryDate}
                                                                                                onChange={(date) =>
                                                                                                    coursePricingValidation.setFieldValue("expiryDate", date[0])
                                                                                                }
                                                                                            />
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                )}

                                                                {/* Lifetime Validity Block */}
                                                                {courseValidityType && (courseValidityType.value === "LifetimeValidity" || courseValidityType.value === "CourseExpiryDate") && (
                                                                    <div className="mt-3 mb-3" >
                                                                        <Row>
                                                                            <Col lg={8}>
                                                                                {coursePricingValidation.values.planType === "PAID" && (<Row>
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
                                                                                                    value={coursePricingValidation.values.price}
                                                                                                    onChange={coursePricingValidation.handleChange}
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
                                                                                                    name="discountPercent"
                                                                                                    aria-label="Discount"
                                                                                                    aria-describedby="course-discount-addon"
                                                                                                    value={coursePricingValidation.values.discountPercent}
                                                                                                    onChange={coursePricingValidation.handleChange}
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
                                                                                                    value={coursePricingValidation.values.effectivePrice}
                                                                                                    // onChange={coursePricingValidation.handleChange}
                                                                                                    readOnly
                                                                                                />
                                                                                                {/* {validation.errors.price && validation.touched.price ? (
                                                                                                        <FormFeedback type="invalid">{validation.errors.price}</FormFeedback>
                                                                                                    ) : null} */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>)}


                                                                                {coursePricingValidation.values.planType === "FREE" && (
                                                                                    <div className="mb-3 mb-lg-0">
                                                                                        <Label
                                                                                            htmlFor="select-course-duration-input"
                                                                                            className="form-label"
                                                                                        >
                                                                                            Target Course
                                                                                        </Label>
                                                                                        <Select
                                                                                            value={
                                                                                                courseOptions.find(
                                                                                                    (option) =>
                                                                                                        option.value ===
                                                                                                        coursePricingValidation.values.targetCourseId
                                                                                                ) || null
                                                                                            }
                                                                                            onChange={(selected) =>
                                                                                                coursePricingValidation.setFieldValue(
                                                                                                    "targetCourseId",
                                                                                                    selected?.value || null
                                                                                                )
                                                                                            }
                                                                                            options={courseOptions}
                                                                                            id="select-course-duration-input"
                                                                                            className="js-example-basic-single mb-0"
                                                                                            name="targetCourseId"
                                                                                            placeholder="Select Target Course"
                                                                                            isClearable
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </Col>

                                                                        </Row>
                                                                    </div>
                                                                )}

                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                                {/* Buttons */}
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
                                                        onClick={coursePricingValidation.handleSubmit}
                                                        disabled={!isPriceFormValid()}>
                                                        <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                                                        Add Content
                                                    </button>
                                                </div>
                                                {/* </Form> */}
                                            </TabPane>

                                            <TabPane tabId={3}>
                                                <div>
                                                    {/* Back to perent*/}
                                                    {currentFolder !== 0  && (
                                                        <div className="mb-3">
                                                            <h6 className="fw-bold">
                                                                <span
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() => goBackTo()}
                                                                >
                                                                {"<- Back"}
                                                                </span>
                                                            </h6>
                                                        </div>
                                                    )}

                                                    <Row>
                                                        <Col lg={9}>
                                                            <div className="file-manager-content w-100 p-3 py-0">
                                                                <div className="mx-n3 pt-4 px-4 overflow-x-hidden overflow-y-auto">
                                                                    <div id="folder-list" className="mb-2">
                                                                        <Row id="folderlist-data">
                                                                            {(currentFolder !== 0  && contents == []) ? (
                                                                                <Col xxl={12} className="col-6 folder-card">
                                                                                    <div className="text-center py-5">
                                                                                        <lord-icon
                                                                                            src="https://cdn.lordicon.com/msoeawqm.json"
                                                                                            trigger="loop"
                                                                                        />
                                                                                        <h5 className="mt-3">No Child Content Found.</h5>
                                                                                    </div>
                                                                                </Col>
                                                                            ) : (
                                                                            <>
                                                                                {(contents || []).map((item, key) => (                                                                                 
                                                                                    <Col xxl={12} className="col-6 folder-card" key={key}>

                                                                                        <Card className="bg-light shadow-none">

                                                                                            <CardBody>
                                                                                                <Row>

                                                                                                    {/* ICON */}
                                                                                                        <Col sm={1}>
                                                                                                            {item.type === "folder" ? (
                                                                                                                <i className="ri-folder-2-fill text-warning display-5"></i>
                                                                                                            ) : item.type === "video" ? (
                                                                                                                <i className="ri-video-fill text-danger display-5"></i>
                                                                                                            ) : item.type === "image" ? (
                                                                                                                <i className="ri-image-fill text-info display-5"></i>
                                                                                                            ) : (item.type === "doc" || item.type === "pdf" || item.type === "docx" || item.type === "xls"|| item.type === "ppt"|| item.type === "pptx"|| item.type === "txt") ? (
                                                                                                                <i className="ri-file-text-fill text-primary display-5"></i>
                                                                                                            ) : null}
                                                                                                        </Col>

                                                                                                    {/* NAME + FILE COUNT */}
                                                                                                    <Col sm={10}>
                                                                                                        <div className="text-muted mt-2">
                                                                                                            <h6 className="fs-15">{item.name}</h6>
                                                                                                            
                                                                                                            {item.type === "folder" ? (
                                                                                                                <span><b>{item.videoCount}</b> Files</span>
                                                                                                            ) : item.type === "video" ? (
                                                                                                                <span
                                                                                                                    className="text-primary"
                                                                                                                    style={{ cursor: "pointer" }}
                                                                                                                    onClick={() => {
                                                                                                                        setSelectedVideoUrl(item.url);
                                                                                                                        setVideoModalOpen(true);
                                                                                                                    }}
                                                                                                                >
                                                                                                                    Watch Video
                                                                                                                </span>
                                                                                                            ) : item.type === "image" || item.type === "doc" || item.type === "pdf" || item.type === "docx" || item.type === "xls"|| item.type === "ppt"|| item.type === "pptx"|| item.type === "txt" ? (
                                                                                                                <span
                                                                                                                    className="text-primary"
                                                                                                                    style={{ cursor: "pointer" }}
                                                                                                                    onClick={() => {
                                                                                                                        window.open(item.url, "_blank");
                                                                                                                    }}
                                                                                                                >
                                                                                                                    {item.type === "image" ? "Open Image" : "Open Document"}
                                                                                                                </span>
                                                                                                            ) : null}
                                                                                                        </div>
                                                                                                    </Col>

                                                                                                    {/* MENU */}
                                                                                                        <Col sm={1}>
                                                                                                            <UncontrolledDropdown className="float-end">
                                                                                                                <DropdownToggle
                                                                                                                    tag="button"
                                                                                                                    type="button"
                                                                                                                    className="btn btn-ghost-primary btn-icon btn-sm dropdown"
                                                                                                                >
                                                                                                                    <i className="ri-more-2-fill fs-16 align-bottom" />
                                                                                                                </DropdownToggle>

                                                                                                                <DropdownMenu className="dropdown-menu-end">
                                                                                                                    <DropdownItem
                                                                                                                        onClick={(e) => {
                                                                                                                            e.preventDefault();
                                                                                                                            openFolder(item);
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        Open
                                                                                                                    </DropdownItem>

                                                                                                                    <DropdownItem
                                                                                                                        onClick={(e) => {
                                                                                                                            e.preventDefault();
                                                                                                                            alert("Edit folder feature coming soon!");
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        Edit
                                                                                                                    </DropdownItem>

                                                                                                                    <DropdownItem
                                                                                                                        onClick={(e) => {
                                                                                                                            e.preventDefault();
                                                                                                                            alert("Remove folder feature coming soon!");
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        Remove
                                                                                                                    </DropdownItem>

                                                                                                                    <DropdownItem disabled>Locked</DropdownItem>
                                                                                                                </DropdownMenu>
                                                                                                            </UncontrolledDropdown>
                                                                                                        </Col>

                                                                                                </Row>
                                                                                            </CardBody>
                                                                                        </Card>

                                                                                    </Col>
                                                                                ))}

                                                                                {contents && contents.length === 0 && (
                                                                                    <Col xxl={12} className="col-6 folder-card" >
                                                                                        <div className="text-center py-5">
                                                                                            <lord-icon
                                                                                                src="https://cdn.lordicon.com/msoeawqm.json"
                                                                                                trigger="loop"
                                                                                            />
                                                                                            <h5 className="mt-3">No Content Found.</h5>
                                                                                        </div>
                                                                                    </Col>
                                                                                )}
                                                                            </>
                                                                            )}

                                                                        </Row>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col lg={3}>
                                                            <div className="p-3 d-flex flex-column h-100">
                                                                <div className="mb-3">
                                                                    <h4 className="mb-0 fw-semibold">Add Content</h4>
                                                                </div>
                                                                <SimpleBar className="mx-n4 px-4 file-menu-sidebar-scroll">
                                                                    <ul className="list-unstyled file-manager-menu">
                                                                        <li className="">
                                                                            <Link to="#" onClick={() => tog_folder()}><i className="ri-folder-2-fill align-bottom me-2"></i> <span className="file-list-link">Folder</span></Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link to="#" onClick={() => tog_video()}><i className="ri-video-fill align-bottom me-2"></i> <span className="file-list-link">Video</span></Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link to="#" className={filterActive === "Recents" ? "active" : ""} onClick={() => fileCategory("Media", "Recents")}><i className="ri-article-fill align-bottom me-2"></i> <span className="file-list-link">Online Test</span></Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link to="#" className={filterActive === "Important" ? "active" : ""} onClick={() => fileCategory("Documents", "Important")}><i className="ri-survey-line align-bottom me-2"></i> <span className="file-list-link">Subjective Test</span></Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link to="#" className={filterActive === "Deleted" ? "active" : ""} onClick={() => tog_document()}><i className="ri-file-text-fill align-bottom me-2"></i> <span className="file-list-link">Document</span></Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link to="#" className={filterActive === "Deleted" ? "active" : ""} onClick={() => tog_image()}><i className="ri-image-2-fill align-bottom me-2"></i> <span className="file-list-link">Image</span></Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link to="#" className={filterActive === "Deleted" ? "active" : ""} onClick={() => fileCategory("Deleted", "Deleted")}><i className="ri-file-zip-fill align-bottom me-2"></i> <span className="file-list-link">Zip File</span></Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link to="#" className={filterActive === "Deleted" ? "active" : ""} onClick={() => fileCategory("Deleted", "Deleted")}><i className="ri-file-download-fill align-bottom me-2"></i> <span className="file-list-link">Import Content</span></Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link to="#" className={filterActive === "Deleted" ? "active" : ""} onClick={() => fileCategory("Deleted", "Deleted")}><i className="ri-file-download-fill align-bottom me-2"></i> <span className="file-list-link">Import Live</span></Link>
                                                                        </li>
                                                                    </ul>
                                                                </SimpleBar>

                                                            </div>
                                                        </Col>
                                                    </Row>
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
                                                        Back to Edit Price
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                                        onClick={() => {
                                                            handlePublishCourse(courseData?.courseId, () => {
                                                                // Move to next tab after successful publish
                                                                toggleTab(activeTab + 1, 100);
                                                            });
                                                        }}
                                                    >
                                                        <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                                                        Submit here
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
                        <AddFolder isOpen={modal_folder} toggle={() => { tog_folder(); }} onAddFolderHandler={onAddFolderHandler} courseId={courseData?.courseId} folderID = {currentFolder}/>
                        <AddVideo isOpen={modal_uploadVideo} toggle={() => { tog_video(); }} selectedFiles={selectedFiles} isUploading={isUploading} handleFileChange={handleFileChange} handleUpload={handleUpload} />
                        <AddDocument isOpen={modal_uploadDocument} toggle={() => { tog_document(); }} selectedFiles={selectedFiles} isUploading={isUploading} handleFileChange={handleFileChange} handleUpload={handleUpload}/>
                        <AddImage isOpen={modal_uploadImage} toggle={() => { tog_image(); }} selectedFiles={selectedFiles} isUploading={isUploading} handleFileChange={handleFileChange} handleUpload={handleUpload}/>
                        <VideoModal isOpen={videoModalOpen} toggle={toggleVideoModal} videoUrl={selectedVideoUrl} />

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