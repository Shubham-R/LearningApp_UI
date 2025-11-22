import { useState } from "react";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import { createFolderAPI } from "../../../../api/course";
import Swal from "sweetalert2";

export const AddFolder = ({ isOpen, toggle, onAddFolderHandler, courseId }) => {
    courseId = courseId ? courseId : 80028 // for testing
    const [folderName, setFolderName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!folderName.trim()) {
            setError("Folder name is required");
            return;
        }

        setError("");

        try {
            setLoading(true);

            const payload = { folderName };

            const response = await createFolderAPI(payload, courseId, "application/json");
            console.log("folder response--", response);
            if (response?.status === true) {
                onAddFolderHandler(response);
                // SUCCESS ALERT
                Swal.fire({
                    icon: "success",
                    title: "Folder Created Successfully",
                    text: `Folder "${folderName}" has been added.`,
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                // FAILURE ALERT
                Swal.fire({
                    icon: "warning",
                    title: "Failed to Create Folder",
                    text: response?.message || "Please try again.",
                });
            }
            toggle();
            setFolderName("");
        } catch (error) {
            console.error("Error creating folder:", error);
            // ERROR ALERT
            Swal.fire({
                icon: "error",
                title: "Something Went Wrong",
                text: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setFolderName(value);

        if (!value.trim()) setError("Folder name is required");
        else setError("");
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Create New Folder</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="folderName">Folder Name</Label>
                        <Input
                            type="text"
                            id="folderName"
                            value={folderName}
                            onChange={handleChange}
                            placeholder="Enter folder name"
                        />

                        {/* Validation Message */}
                        {error && (
                            <small className="text-danger">
                                {error}
                            </small>
                        )}
                    </FormGroup>

                    <Button
                        color="primary"
                        type="submit"
                        disabled={loading || !folderName.trim()}
                    >
                        {loading ? "Creating..." : "Create Folder"}
                    </Button>
                </Form>
            </ModalBody>
        </Modal>
    );
};
