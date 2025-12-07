import { useState } from "react";
import axios from "axios";
import { Button, Card, Modal, ModalHeader, ModalBody } from "reactstrap";
import FeatherIcon from "feather-icons-react";
import { completeVideoUploadAPI, initiateVideoUploadAPI } from "../../../../api/course";
import Swal from "sweetalert2";

export const AddVideo = ({ isOpen, toggle, courseId, setContents, onAddFolderHandler, folderID }) => {
    console.log("folder id add video--", folderID);
    
    courseId = courseId ? courseId : 80028; // for testing
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // STEP 1 — choose file(s)
    const handleFileChange = (e) => {
        setSelectedFiles([]);
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);
        }
    };

    // STEP 2 — on upload click
    const handleUpload = async () => {
        if (!selectedFiles.length) {
            Swal.fire({
                icon: "error",
                title: "Warning",
                text: "Select at least one video"
            });
            return;
        }

        setIsUploading(true); // START LOADER

        let payload = {
            isExternal: folderID ? false: true,
            mimeType: "video/mp4",
            fileList: selectedFiles.map((file) => ({
                isLocked: false,
                fileName: file.name,
                size: file.size,
                multipart: false
            }))
        };

        if(folderID != 0) {
            payload.folderId = folderID;
        }

        try {
            // STEP 3 — Initiate upload
            const initiateRes = await initiateVideoUploadAPI(payload, courseId, "application/json");

            if (!initiateRes?.status) {
                Swal.fire({ icon: "error", title: "Failed", text: "Failed to initiate upload" });
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

            // STEP 4 — Upload each file
            for (let i = 0; i < uploadEntries.length; i++) {
                const file = selectedFiles[i];
                const entry = uploadEntries[i];

                try {
                    const putRes = await axios.put(entry.presignedUrl, file, {
                        headers: {
                            "Content-Type": file.type,
                        }
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

            // STEP 5 — Notify backend upload is complete
            const completeRes = await completeVideoUploadAPI(uploadResults, courseId, "application/json");

            if (completeRes?.status) {
                const addedVideos = (completeRes.data || []).map(v => ({
                    id: v.courseContentId,
                    name: v.fileName || "Uploaded Video",
                    type: "video",
                    url: v.presignedGetUrl
                }));

                await setContents(prev => [...prev, ...addedVideos]);

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

            toggle();

        } catch (err) {
            console.error("Upload error -", err);
            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "Something went wrong."
            });
        }

        setIsUploading(false); // STOP LOADER (always)
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}></ModalHeader>

            <ModalBody>
                {/* FULL SCREEN LOADER */}
                {/* {isUploading && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(255, 255, 255, 0.8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 9999
                        }}
                    >
                        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }}></div>
                    </div>
                )} */}

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
                        onClick={() => document.getElementById('video-upload').click()}
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
                                <p key={i} className="text-muted">{file.name} ({file.size} bytes)</p>
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
