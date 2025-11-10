import { useState } from "react";
import { Button, Card, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import FeatherIcon from "feather-icons-react";


export const AddImage = ({ isOpen, toggle }) => {
    const [selectedFiles, setSelectedFiles] = useState(null)
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        // Handle folder creation logic here
        console.log('Folder Name:', folderName);
        // After handling, you might want to close the modal
        toggle();
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(e.target.files);
            console.log('Selected files:', Array.from(e.target.files).map(f => f.name));
        }
    };

    return (<Modal
        isOpen={isOpen}
        toggle={() => {
            toggle();
        }}
    >
        <ModalHeader className="modal-title" toggle={() => {
            toggle();
        }}>
        </ModalHeader>
        <ModalBody >
            <div className="align-items-center d-flex flex-column">
                <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-info-subtle rounded-circle fs-2">
                        <FeatherIcon
                            icon="image"
                            className="text-info"
                        />
                    </span>
                </div>
                <div className="mt-4 align-items-center d-flex flex-column">
                    <h5>Upload Image(s)</h5>
                    <p className="text-muted mb-0">Select multiple image from your local storage * Max.</p>
                </div>
                <label htmlFor="video-upload">
                    <Button color="secondary" className="rounded-pill" onClick={() => document.getElementById('image-upload')?.click()}> Select File(s) </Button>
                </label>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="d-none"
                />
            </div>
        </ModalBody>
    </Modal>);
}