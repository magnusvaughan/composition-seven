//ModalComponent.js

import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";

export default class ModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modal: false, name: "", team: "", country: "" };

        this.toggle = this.toggle.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    handleChangeName(event) {
        this.setState({ name: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        const form  = this.state.name;
        let uri = "/api/songs/create/"+user_id;
        axios.post(uri, form).then(response => {
            this.setState({
                modal: !this.state.modal
            });
        });
    }

    render() {
        return (
            <div className="new-song-modal">
                <Button className="btn btn-primary" onClick={this.toggle}>
                    Create a new song
                </Button>
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader>Create new song</ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="form-group col-md-10">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        value={this.state.name}
                                        onChange={this.handleChangeName}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <input
                                type="submit"
                                value="Submit"
                                color="primary"
                                className="btn btn-primary"
                            />
                            <Button color="danger" onClick={this.toggle}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        );
    }
}
