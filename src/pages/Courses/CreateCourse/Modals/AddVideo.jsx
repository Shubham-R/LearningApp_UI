import { useState } from "react";
import axios from "axios";
import { Button, Card, Modal, ModalHeader, ModalBody } from "reactstrap";
import FeatherIcon from "feather-icons-react";
import { completeVideoUploadAPI, initiateVideoUploadAPI } from "../../../../api/course";

export const AddVideo = ({ isOpen, toggle, courseId }) => {
    courseId = courseId ? courseId : 80028; // for testing
    const [selectedFiles, setSelectedFiles] = useState([]);

    // STEP 1 — choose file(s)
    const handleFileChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);

            console.log("Selected files:", filesArray.map(f => f.name));
        }
    };

    // STEP 2 — on upload click
    const handleUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            alert("Select at least one video");
            return;
        }

        const payload = {
            isExternal: true,
            mimeType: "video/mp4",
            fileList: selectedFiles.map((file) => ({
                isLocked: false,
                fileName: file.name,
                size: file.size,
                multipart: false
            }))
        };

        try {
            // STEP 3 — Initiate upload (get presigned URL)
            const initiateRes = await initiateVideoUploadAPI(payload, courseId, "application/json");
            console.log("initiate response -", initiateRes);

            if (!initiateRes?.status) {
                alert("Failed to initiate upload");
                return;
            }

            const uploadEntries = initiateRes.data;
            console.log("Presigned entries -", uploadEntries);

            if (!uploadEntries || uploadEntries.length === 0) {
                alert("No presigned URLs received!");
                return;
            }

            const uploadResults = [];

            // STEP 4 — Upload each file to AWS using presigned URL
            for (let i = 0; i < uploadEntries.length; i++) {
                const file = selectedFiles[i];
                const entry = uploadEntries[i];

                console.log(`Uploading to S3 - ${file.name}`);

                try {
                    const putRes = await axios.put(entry.presignedUrl, file, {
                        headers: {
                            "Content-Type": file.type,
                        }
                    });

                    console.log("PUT Response -", putRes);

                    const eTag =
                        putRes.headers?.etag?.replace(/"/g, "") || "no-etag-returned";

                    uploadResults.push({
                        uploadId: entry.uploadId,
                        eTag: eTag,
                        checksumSha256: "" 
                    });

                } catch (uploadErr) {
                    console.error(`File upload failed for: ${file.name}`, uploadErr);
                    alert(`Upload failed for ${file.name}`);
                    return;
                }
            }

            console.log("Upload Results -", uploadResults);

            // STEP 5 — Inform backend upload is complete
            const completeRes = await completeVideoUploadAPI(uploadResults, courseId, "application/json");

            console.log("Complete upload response -", completeRes);

            alert("All videos uploaded successfully!");

            toggle(); // close modal

        } catch (err) {
            console.error("Upload error -", err);
            alert("Upload Failed!");
        }
    };

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
                        <p className="text-muted mb-0">
                            Select videos (max 5GB each)
                        </p>
                    </div>

                    <Button
                        color="secondary"
                        className="rounded-pill mt-3"
                        onClick={() => document.getElementById('video-upload')?.click()}
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
                                <p key={i} className="text-muted">{file.name} ({file.size} bytes)</p>
                            ))}
                        </div>
                    )}

                    <Button
                        color="primary"
                        className="rounded-pill mt-3"
                        disabled={selectedFiles.length === 0}
                        onClick={handleUpload}
                    >
                        Upload Videos
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
