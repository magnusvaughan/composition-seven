import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export default class NewSongModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modal: false, name: "" };

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

    handleSubmit(e) {
        e.preventDefault();
        this.props.onDeleteSongSubmit(e, this.state.name);
        this.setState({
            modal: !this.state.modal,
            name: ''
        });
    }

    render() {
        return (
            <div className="new-song-modal">
                <Button className="btn btn-primary crud-button" onClick={this.toggle}>
                    Delete
                </Button>
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader>Are you sure you want to delete this song?</ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="form-group col-md-10">
                                    <h5>{this.props.songName}</h5>
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
