import { useState } from "react";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";

export const AddFolder = ({ isOpen, toggle, onAddFolderHandler }) => {
    const [folderName, setFolderName] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        // Handle folder creation logic here
        console.log('Folder Name:', folderName);
        onAddFolderHandler(folderName);
        // After handling, you might want to close the modal
        toggle();
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
            Create New Folder
        </ModalHeader>
        <ModalBody>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="folderName">Folder Name</Label>
                    <Input
                        type="text"
                        id="folderName"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        placeholder="Enter folder name"
                        required
                    />
                </FormGroup>
                <Button color="primary" type="submit">Create Folder</Button>
            </Form>
        </ModalBody>
    </Modal>);
}