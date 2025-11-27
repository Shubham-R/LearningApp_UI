import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import classnames from "classnames";
import { cloneDeep } from "lodash";
import React, { useState, useCallback, useEffect } from 'react';
import Flatpickr from "react-flatpickr";
import { Link } from "react-router-dom";
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
import { createDraftCourseAPI, createPricingAPI, getAllCategoriesAPI, getAllFoldersByCourseIDAPI, getCourseListAPI, updateCourseImageAPI, updateDraftCourseAPI, updatePriceAPI } from "../../../api/course";
import moment from "moment";
import SimpleBar from "simplebar-react";
import { AddFolder } from "./Modals/AddFolder";
import { AddVideo } from "./Modals/AddVideo";
import { AddDocument } from "./Modals/AddDocument";
import { AddImage } from "./Modals/AddImage";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";

const CreateCourse = () => {
    const [activeTab, setactiveTab] = useState(1);
    const [activeArrowTab, setactiveArrowTab] = useState(4);
    const [activeVerticalTab, setactiveVerticalTab] = useState(7);
    const [progressbarvalue, setprogressbarvalue] = useState(0);
    const [passedSteps, setPassedSteps] = useState([1]);
    const [passedarrowSteps, setPassedarrowSteps] = useState([1]);
    const [passedverticalSteps, setPassedverticalSteps] = useState([1]);
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
    const [category, setCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);
    const [courseSubCategory, setCourseSubCategory] = useState([]);
    const [editorData, setEditorData] = useState("");
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

    const onAddFolderHandler = (folder) => {
        const newFolder = {
            id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
            name: folder?.data?.folderName,
            type: "folder",
            metadata: {
                videoCount: 0,  
                fileCount: 0    
            }
        };
        // if(contents && Array.isArray(contents)){
        //     setContents([...contents, newFolder]);
        // }else{
        //     setContents([newFolder]);
        // }
        fetchFoldersByCourseId(courseData?.courseId || 80028);
    }      







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

    // Update Folder
    const handleFolderClick = useCallback((arg) => {
        const folder = arg;

        setFolder({
            id: folder.id,
            folderName: folder.folderName,
            folderFile: folder.folderFile,
            size: folder.size,
        });

        setIsEdit(true);
        folderToggle();
    }, [folderToggle]);

    // Add Folder
    const handleFolderClicks = () => {
        setFolder("");
        setModalFolder(!modalFolder);
        setIsEdit(false);
        folderToggle();
    };

    // Delete Folder
    const onClickFolderDelete = (folder) => {
        setFolder(folder);
        setDeleteModal(true);
    };

    const handleDeleteFolder = () => {

        if (deleteAlt) {
            if (folder) {
                dispatch(onDeleteFolder(folder.id));
                setDeleteModal(false);
                setDeleteAlt(false);
            }
        } else {
            if (file) {
                dispatch(onDeleteFile(file.id));
                setDeleteModal(false);
                sidebarClose("file-detail-show");
            }
        }

    };

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

    // Update File
    const handleFileClick = useCallback((arg) => {
        const file = arg;

        setFile({
            id: file.id,
            fileName: file.fileName,
            fileItem: file.fileItem,
            size: file.size,
        });

        setIsEdit(true);
        fileToggle();
    }, [fileToggle]);

    // Add File
    const handleFileClicks = () => {
        setFile("");
        setModalFile(!modalFile);
        setIsEdit(false);
        fileToggle();
    };

    // Delete File
    const onClickFileDelete = (file) => {
        setFile(file);
        setDeleteModal(true);
    };


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

    const favouriteBtn = (ele) => {
        if (ele.closest("button").classList.contains("active")) {
            ele.closest("button").classList.remove("active");
        } else {
            ele.closest("button").classList.add("active");
        }
    };

    const fileSidebar = () => {
        document.getElementById("folder-overview").style.display = "none";
        document.getElementById("file-overview").style.display = "block";
    };

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

    // const courseSubCategory = [
    //     {
    //         options: [
    //             { label: "SubCategory1", value: "SubCategory1" },
    //             { label: "SubCategory2", value: "SubCategory2" },
    //         ],
    //     },
    // ];

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

    // const onAddAnotherCategoryHandler = () => {
    //     let copyCategoryMappings = cloneDeep(categoryMappings);
    //     copyCategoryMappings.push(
    //         {
    //             categoryId: null,
    //             categoryName: null,
    //             subcategories: [
    //                 {
    //                     subCategoryId: null,
    //                     subCategoryName: null,
    //                 }
    //             ]
    //         }
    //     )
    //     setCategoryMappings(copyCategoryMappings)
    // }

    // const onRemovedCategoryHandler = (index) => {
    //     let copyCategoryMappings = cloneDeep(categoryMappings);
    //     copyCategoryMappings.splice(index, 1);
    //     setCategoryMappings(copyCategoryMappings)
    // }

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
            lifetimePrice: null
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

                console.log("createPricingAPI Payload:", payload);

                if (priceData?.pricePlanId && priceData?.courseId) {
                    payload.courseId = priceData?.courseId;
                    payload.pricePlanId = priceData?.pricePlanId;
                    const updatePriceResponse = await updatePriceAPI(payload);
                    console.log("updatePriceResponse Response:", updatePriceResponse);

                    if (updatePriceResponse?.status === true && updatePriceResponse?.data) {
                        setPriceData(updatePriceResponse?.data);
                        toggleTab(activeTab + 1, 67);
                    }
                } else {
                    const response = await createPricingAPI(payload);
                    console.log("createPricingAPI Response:", response);
                    if (response?.status === true && response?.data) {
                        setPriceData(response?.data);
                        toggleTab(activeTab + 1, 67);
                    }
                }

                // Call API to fetch Content - Tab 3 listing
                // fetchFoldersByCourseId(courseData?.courseId || 80028, "proceedToContentTab");

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
                    courseImageUrl: values.courseImage
                        ? values.courseImage.name
                        : "http://default-image-url.com",
                    courseImageId: values.courseImageId,
                    categoryMappings: categoryMappingsPayload,
                };
                console.log("payload--",payload);

                // If courseId exists, update draft course
                if (courseData?.courseId) {
                    payload.courseId = courseData?.courseId;
                    payload.courseStatus = courseData?.courseStatus;
                    const updateResponse = await updateDraftCourseAPI(payload);
                    if (updateResponse?.status === true && updateResponse?.data) {
                        setCourseData(updateResponse?.data)
                        toggleTab(activeTab + 1, 33);
                    }
                } else { // Else, create a new draft course
                    const response = await createDraftCourseAPI(payload);
                    if (response?.status === true && response?.data) {
                        setCourseData(response?.data)
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

        console.log("file--", file);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await updateCourseImageAPI(formData);

            console.log("Upload Response:", response);

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

    // Fetch All folders by course ID
    const fetchFoldersByCourseId = async (courseId, type) => {
        try {
            const response = await getAllFoldersByCourseIDAPI(courseId);
            console.log("fetch folder list--", response);
            if(response?.status === true) {
                if(type) toggleTab(activeTab + 1, 67); // Move to Add Content tab
                setContents(response?.data || []);
            }

        } catch (error) {
            console.error("Error fetching folders by course ID:", error);
        }
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
                                    <h4 className="card-title mb-4">Add / View content of your course</h4>
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
                                                                        <CKEditor
                                                                            editor={ClassicEditor}
                                                                            data={editorData}
                                                                            onChange={(event, editor) => {
                                                                                const data = editor.getData();
                                                                                setEditorData(data);
                                                                                formik.setFieldValue("courseDescription", data);
                                                                            }}
                                                                        />
                                                                        {formik.touched.courseDescription && formik.errors.courseDescription && (
                                                                            <div className="text-danger">{formik.errors.courseDescription}</div>
                                                                        )}
                                                                    </div>
                                                                </Col>

                                                                {/* Thumbnail */}
                                                                <Col lg={12}>
                                                                    <div>
                                                                        <Label className="form-label" htmlFor="project-thumbnail-img">
                                                                            Thumbnail Image
                                                                        </Label>
                                                                        <Input
                                                                            className="form-control"
                                                                            id="project-thumbnail-img"
                                                                            type="file"
                                                                            accept="image/png, image/gif, image/jpeg"
                                                                            // onChange={(e) =>
                                                                            //     formik.setFieldValue("courseImage", e.currentTarget.files[0])
                                                                            // }
                                                                            onChange={handleThumbnailUpload}
                                                                        />
                                                                    </div>
                                                                </Col>
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
                                                        disabled={!formik.isValid || !formik.dirty} // Disable until form is valid
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
                                                                                                        onChange={(e) => setEffectivePrice(e.target.value)}
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
                                                                                                    onChange={coursePricingValidation.handleChange}
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
                                                    <Row>
                                                        <Col lg={9}>
                                                            <div className="file-manager-content w-100 p-3 py-0">
                                                                <div className="mx-n3 pt-4 px-4 overflow-x-hidden overflow-y-auto">
                                                                    <div id="folder-list" className="mb-2">
                                                                        <Row id="folderlist-data">
                                                                            {(contents || []).map((item, key) => (
                                                                                <Col xxl={12} className="col-6 folder-card" key={key}>
                                                                                    <Card className="bg-light shadow-none" id={"folder-" + item?.courseFolderId}>
                                                                                        <CardBody>
                                                                                            <div className="">
                                                                                                <Row>
                                                                                                    <Col sm={1} >
                                                                                                        <i className="ri-folder-2-fill text-warning display-5"></i>
                                                                                                    </Col>
                                                                                                    <Col sm={10} >
                                                                                                        <div className="text-muted mt-2">
                                                                                                            <h6 className="fs-15">{item?.folderName}</h6>

                                                                                                            <span className="me-auto"><b>0</b> Files</span>
                                                                                                            {/* <span><b>{item.size}</b>GB</span> */}
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                    <Col sm={1} >
                                                                                                        <UncontrolledDropdown className="float-end">
                                                                                                            <DropdownToggle tag="button" className="btn btn-ghost-primary btn-icon btn-sm dropdown">
                                                                                                                <i className="ri-more-2-fill fs-16 align-bottom" />
                                                                                                            </DropdownToggle>
                                                                                                            <DropdownMenu className="dropdown-menu-end">
                                                                                                                <DropdownItem className="view-item-btn">Edit</DropdownItem>
                                                                                                                <DropdownItem className="edit-folder-list" >Remove</DropdownItem>
                                                                                                                <DropdownItem >Locked</DropdownItem>
                                                                                                            </DropdownMenu>
                                                                                                        </UncontrolledDropdown>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            </div>

                                                                                            {/* </div> */}
                                                                                            {/* <div className="hstack mt-4 text-muted">
                                                                                                <span className="me-auto"><b>{item.folderFile}</b> Files</span>
                                                                                                <span><b>{item.size}</b>GB</span>
                                                                                            </div> */}
                                                                                        </CardBody>
                                                                                    </Card>
                                                                                </Col>))}
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
                        <AddFolder isOpen={modal_folder} toggle={() => { tog_folder(); }} onAddFolderHandler={onAddFolderHandler} courseId={courseData?.courseId}/>
                        <AddVideo isOpen={modal_uploadVideo} toggle={() => { tog_video(); }} courseId={courseData?.courseId}/>
                        <AddDocument isOpen={modal_uploadDocument} toggle={() => { tog_document(); }} />
                        <AddImage isOpen={modal_uploadImage} toggle={() => { tog_image(); }} />

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