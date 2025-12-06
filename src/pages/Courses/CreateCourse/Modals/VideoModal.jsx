import { Modal, ModalHeader, ModalBody } from "reactstrap";

const VideoModal = ({ isOpen, toggle, videoUrl }) => {
    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>Watch Video</ModalHeader>
            <ModalBody>
                {videoUrl ? (
                    <video
                        src={videoUrl}
                        controls
                        autoPlay
                        style={{ width: "100%", borderRadius: "10px" }}
                    />
                ) : (
                    <p>No video found</p>
                )}
            </ModalBody>
        </Modal>
    );
};

export default VideoModal;
