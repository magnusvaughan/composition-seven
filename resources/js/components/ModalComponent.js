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
        this.handleChangeTeam = this.handleChangeTeam.bind(this);
        this.handleChangeCountry = this.handleChangeCountry.bind(this);
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
    handleChangeTeam(event) {
        this.setState({ team: event.target.value });
    }
    handleChangeCountry(event) {
        this.setState({ country: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        const form = {
            name: this.state.name,
        };
        let uri = "/api/formmodal";
        axios.post(uri, form).then(response => {
            this.setState({
                modal: !this.state.modal
            });
        });
    }

    render() {
        return (
            <div class="new-song-modal">
                <Button color="success" onClick={this.toggle}>
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
