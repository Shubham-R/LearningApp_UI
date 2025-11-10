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
    const [localPlan, setLocalPlan] = useState(plan);
    const [singleValidityType, setSingleValidityType] = useState(null);

    const singleValidityDurationTypes = [
        {
            options: [
                { label: "Months(s)", value: "months" },
                { label: "Years(s)", value: "years" },
                { label: "Days(s)", value: "days" },
            ],
        },
    ];

    // Set initial type when editing
    useEffect(() => {
        const selectedOption = singleValidityDurationTypes[0].options.find(
            (option) => option.value === plan.validityDurationType
        );
        setSingleValidityType(selectedOption);
    }, [plan.validityDurationType]);

    // Auto-calculate effective price when price or discount changes
    // useEffect(() => {
    //     const price = parseFloat(localPlan.price) || 0;
    //     const discount = parseFloat(localPlan.discount) || 0;
    //     const effectivePrice = price - (price * discount) / 100;
    //     setLocalPlan((prev) => ({ ...prev, effectivePrice }));
    // }, [localPlan.price, localPlan.discount]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setLocalPlan((prev) => {
            let updatedPlan = { ...prev, [name]: newValue };

            // 🔹 If price or discount changes → recalculate effectivePrice immediately
            if (name === "price" || name === "discount") {
                const price = parseFloat(
                    name === "price" ? newValue : updatedPlan.price
                ) || 0;
                const discount = parseFloat(
                    name === "discount" ? newValue : updatedPlan.discount
                ) || 0;
                const effectivePrice = price - (price * discount) / 100;
                updatedPlan.effectivePrice = effectivePrice.toFixed(2);
            }

            // 🔹 Notify parent immediately with the latest data
            if (onUpdate) onUpdate(plan.planId, updatedPlan);

            return updatedPlan;
        });
    };

    const findLabelByValue = (value) => {
        const options = singleValidityDurationTypes[0].options;
        const found = options.find((item) => item.value === value);
        return found ? found.label : null;
    };

    const handleSave = () => {
        onSave({ ...localPlan, validityDurationType: singleValidityType?.value });
    };

    return (
        <Card style={{ backgroundColor: "#f3f3f9" }}>
            <CardBody>
                {!isEditing ? (
                    <ul className="float-end list-inline hstack gap-2 mb-0">
                        <li className="list-inline-item">
                            <Link
                                to="#"
                                className=" text-danger d-inline-block remove-item-btn"
                                onClick={() => onDelete(plan.planId)}
                            >
                                <i className="ri-delete-bin-5-fill fs-16"></i> Delete
                            </Link>
                        </li>
                        <li className="list-inline-item edit">
                            <Link
                                to="#"
                                className="text-primary d-inline-block edit-item-btn"
                                onClick={() => onEdit(plan.planId)}
                            >
                                <i className="ri-pencil-fill fs-16"></i> Edit
                            </Link>
                        </li>
                    </ul>
                ) : (
                    <ul className="float-end list-inline hstack gap-2 mb-0">
                        <li className="list-inline-item">
                            <Link
                                to="#"
                                className=" text-danger d-inline-block remove-item-btn"
                                onClick={() => onCancel(plan.planId)}
                            >
                                Cancel
                            </Link>
                        </li>
                        <li className="list-inline-item edit">
                            <Link
                                to="#"
                                className="text-primary d-inline-block edit-item-btn"
                                onClick={handleSave}
                            >
                                Save
                            </Link>
                        </li>
                    </ul>
                )}

                <h5 className="mb-0 fs-16">
                    {plan.validityDuration} {findLabelByValue(plan.validityDurationType)}{" "}
                    <span className="text-success">₹{plan.price}</span>{" "}
                    {plan.isPromoted && (
                        <span className="badge bg-success-subtle text-success">Promoted</span>
                    )}
                </h5>

                {isEditing && (
                    <div className="mt-3">
                        <hr />
                        <Row>
                            <Col lg={8}>
                                <div className="input-group mb-3">
                                    <Input
                                        type="number"
                                        className="form-control"
                                        name="validityDuration"
                                        value={localPlan.validityDuration || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Col>
                            <Col lg={4}>
                                <Select
                                    value={singleValidityType}
                                    onChange={(selected) => {
                                        setSingleValidityType(selected);
                                        setLocalPlan((prev) => ({
                                            ...prev,
                                            validityDurationType: selected.value,
                                        }));
                                    }}
                                    options={singleValidityDurationTypes}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <Label className="form-label">Price</Label>
                                <div className="input-group mb-3">
                                    <span className="input-group-text">₹</span>
                                    <Input
                                        type="number"
                                        className="form-control"
                                        name="price"
                                        value={localPlan.price || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Col>
                            <Col sm={4}>
                                <Label className="form-label">Discount (%)</Label>
                                <div className="input-group mb-3">
                                    <Input
                                        type="number"
                                        className="form-control"
                                        name="discount"
                                        value={localPlan.discount || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Col>
                            <Col sm={4}>
                                <Label className="form-label">Effective Price</Label>
                                <div className="input-group mb-3">
                                    <span className="input-group-text">₹</span>
                                    <Input
                                        type="number"
                                        className="form-control"
                                        name="effectivePrice"
                                        value={localPlan.effectivePrice || ""}
                                        readOnly
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={12}>
                                <div className="form-check">
                                    <Input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="isPromoted"
                                        checked={localPlan.isPromoted || false}
                                        onChange={handleChange}
                                    />
                                    <Label className="form-check-label">
                                        Select to promote this plan
                                    </Label>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};
