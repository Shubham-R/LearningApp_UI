// import { ValidityPlan } from "@/components/ValidityPlanForm";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Trash2, Edit, Info } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from "react-select";
import {
    Card,
    CardBody,
    Col,
    Input,
    Label,
    Row
} from "reactstrap";

export const MultiValidityCard = ({
    plan,
    isEditing,
    onUpdate,
    onDelete,
    onEdit,
    onSave,
    onCancel,
}) => {



    const [singleValidityType, setSingleValidityType] = useState(null);

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

    useEffect(() => {
        const selectedOption = singleValidityDurationTypes[0].options.find(
            (option) => option.value === plan.validityDurationType
        );
        setSingleValidityType(selectedOption);
    }, [plan.validityDurationType]);

    const findLabelByValue = (value) => {
        const options = singleValidityDurationTypes[0].options;
        const found = options.find(item => item.value === value);
        return found ? found.label : null;
    };

    //   const effectivePrice = plan.price - plan.discount;

    //   const cardClasses = plan.isPromoted && !isEditing
    //     ? "border-2 border-[hsl(var(--promoted-border))] bg-[hsl(var(--promoted-bg))]"
    //     : "border border-border bg-card";

    return (
        <React.Fragment>
            <Card style={{ backgroundColor: "#f3f3f9" }}>
                <CardBody>
                    {!isEditing ? (<ul className="float-end list-inline hstack gap-2 mb-0">
                        <li className="list-inline-item">
                            <Link
                                to="#"
                                className=" text-danger d-inline-block remove-item-btn"
                                onClick={() => {
                                    onDelete(plan.planId);
                                }}
                            >
                                <i className="ri-delete-bin-5-fill fs-16"></i> Delete
                            </Link>
                        </li>
                        <li className="list-inline-item edit">
                            <Link
                                to="#"
                                className="text-primary d-inline-block edit-item-btn"
                                onClick={() => {
                                    onEdit(plan.planId);
                                }}
                            >
                                <i className="ri-pencil-fill fs-16"></i> Edit
                            </Link>
                        </li>
                    </ul>) : (
                        <ul className="float-end list-inline hstack gap-2 mb-0">
                            <li className="list-inline-item">
                                <Link
                                    to="#"
                                    className=" text-danger d-inline-block remove-item-btn"
                                    onClick={() => {
                                        onCancel(plan.planId);
                                    }}
                                >
                                    Cancel
                                </Link>
                            </li>
                            <li className="list-inline-item edit">
                                <Link
                                    to="#"
                                    className="text-primary d-inline-block edit-item-btn"
                                    onClick={(data) => {
                                        onSave(data);
                                    }}
                                >
                                    Save
                                </Link>
                            </li>
                        </ul>
                    )}

                    <h5 className="mb-0 fs-16"> {plan.validityDuration} {findLabelByValue(plan.validityDurationType)} <span className="text-success">₹{plan.price}</span>  {plan.isPromoted && (<span className="badge bg-success-subtle text-success">Promoted</span>)}</h5>

                    {isEditing && (<div className='mt-3'>
                        <hr />
                        <Row>
                            <Col lg={8}>
                                <div className="mt-3">
                                    <div className="input-group mb-3">
                                        <Input
                                            type="number"
                                            className="form-control"
                                            id="singleValidityDuration"
                                            // placeholder="Enter Stocks"
                                            name="singleValidityDuration"
                                            value={plan.validityDuration || ""}
                                        // onBlur={validation.handleBlur}
                                        // onChange={validation.handleChange}
                                        // invalid={validation.errors.stock && validation.touched.stock ? true : false}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col lg={4} >
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
                            <Col lg={12}>
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
                                                    type="number"
                                                    className="form-control"
                                                    id="course-price-input"
                                                    placeholder="Enter price"
                                                    name="price"
                                                    value={plan.price || 0}
                                                />

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
                                                    value={plan.discount || 0}
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
                                                    type="number"
                                                    className="form-control "
                                                    id="course-effictive-price-input"
                                                    placeholder="Enter Effective price"
                                                    name="effectivePrice"
                                                    // aria-label="Effective Price"
                                                    // aria-describedby="course-effictive-price-addon"
                                                    value={plan.effectivePrice || 0}
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
                                <Row>
                                    <Col lg={12}>
                                        <div className="form-check">
                                            <Input className="form-check-input" type="checkbox" id="formCheck6" />
                                            <Label className="form-check-label" htmlFor="formCheck6">
                                                Select to promote this plan
                                            </Label>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>

                        </Row>
                    </div>)}
                </CardBody>
            </Card>
        </React.Fragment>
    );
};