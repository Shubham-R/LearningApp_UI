import { useState } from "react";
import { Button, Card, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import FeatherIcon from "feather-icons-react";


export const AddVideo = ({ isOpen, toggle }) => {
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
                            icon="video"
                            className="text-info"
                        />
                    </span>
                </div>
                <div className="mt-4 align-items-center d-flex flex-column">
                    <h5>Upload Video(s)</h5>
                    <p className="text-muted mb-0">Select multiple videos from your local storage * Max. upto 5Gb per video</p>
                </div>
                <label htmlFor="video-upload">
                    <Button color="secondary" className="rounded-pill" onClick={() => document.getElementById('video-upload')?.click()}> Select File(s) </Button>
                </label>
                <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleFileChange}
                    className="d-none"
                />
                <Card className="mt-4 w-100">
                    <div className="card-header bg-danger-subtle" id="videoAlerrt">
                        <p class="text-muted mb-0">              * Video restrictions (decide the maximum number of views and/or the maximum view duration) are available for Classplus powered videos. Use our new video player for seamless video viewing experience.
                        </p>
                    </div>
                </Card>
            </div>
        </ModalBody>
    </Modal>);
}