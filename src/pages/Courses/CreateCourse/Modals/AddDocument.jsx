import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import FeatherIcon from "feather-icons-react";

export const AddDocument = ({
    isOpen,
    toggle,
    selectedFiles = [],      // safe default
    isUploading = false,
    handleFileChange,
    handleUpload
}) => {
    const files = Array.isArray(selectedFiles) ? selectedFiles : [];

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}></ModalHeader>

            <ModalBody>
                <div className="align-items-center d-flex flex-column">

                    {/* Icon */}
                    <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-info-subtle rounded-circle fs-2">
                            <FeatherIcon icon="upload-cloud" className="text-info" />
                        </span>
                    </div>

                    {/* Title */}
                    <div className="mt-4 align-items-center d-flex flex-column">
                        <h5>Upload Document(s)</h5>
                        <p className="text-muted mb-0">
                            You can upload up to 20 files. Max size per file: 40MB.
                        </p>
                    </div>

                    {/* Select File Button */}
                    <Button
                        color="secondary"
                        className="rounded-pill mt-3"
                        onClick={() => document.getElementById("documents-upload")?.click()}
                        disabled={isUploading}
                    >
                        Select File(s)
                    </Button>

                    {/* Hidden File Input */}
                    <input
                        id="documents-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                        multiple
                        onChange={handleFileChange}
                        className="d-none"
                    />

                    {/* Show selected files ONLY if any */}
                    {files.length > 0 && (
                        <div className="mt-3 text-center w-100">
                            <h6>Files Selected:</h6>
                            {files.map((file, i) => (
                                <p key={i} className="text-muted mb-1">
                                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Upload button - only visible when files are selected */}
                    {files.length > 0 && (
                        <Button
                            color="primary"
                            className="rounded-pill mt-3"
                            disabled={isUploading}
                            onClick={handleUpload}
                        >
                            {isUploading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Uploading...
                                </>
                            ) : (
                                "Upload Documents"
                            )}
                        </Button>
                    )}
                </div>
            </ModalBody>
        </Modal>
    );
};
