import { Button, Card, Modal, ModalHeader, ModalBody } from "reactstrap";
import FeatherIcon from "feather-icons-react";

export const AddVideo = ({
    isOpen,
    toggle,
    selectedFiles,
    isUploading,
    handleFileChange,
    handleUpload
}) => {

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}></ModalHeader>

            <ModalBody>
                <div className="align-items-center d-flex flex-column">

                    <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-info-subtle rounded-circle fs-2">
                            <FeatherIcon icon="video" className="text-info" />
                        </span>
                    </div>

                    <div className="mt-4 align-items-center d-flex flex-column">
                        <h5>Upload Video(s)</h5>
                        <p className="text-muted mb-0">Select videos (max 5GB each)</p>
                    </div>

                    <Button
                        color="secondary"
                        className="rounded-pill mt-3"
                        onClick={() => document.getElementById("video-upload").click()}
                        disabled={isUploading}
                    >
                        Select File(s)
                    </Button>

                    <input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleFileChange}
                        className="d-none"
                    />

                    {selectedFiles.length > 0 && (
                        <div className="mt-3 text-center">
                            <h6>Files Selected:</h6>
                            {selectedFiles.map((file, i) => (
                                <p key={i} className="text-muted">
                                    {file.name} ({file.size} bytes)
                                </p>
                            ))}
                        </div>
                    )}

                    <Button
                        color="primary"
                        className="rounded-pill mt-3"
                        disabled={selectedFiles.length === 0 || isUploading}
                        onClick={handleUpload}
                    >
                        {isUploading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Uploading...
                            </>
                        ) : (
                            "Upload Videos"
                        )}
                    </Button>

                    <Card className="mt-4 w-100">
                        <div className="card-header bg-danger-subtle">
                            <p className="text-muted mb-0">
                                * Video restrictions apply. Use our new video player for best experience.
                            </p>
                        </div>
                    </Card>
                </div>
            </ModalBody>
        </Modal>
    );
};
