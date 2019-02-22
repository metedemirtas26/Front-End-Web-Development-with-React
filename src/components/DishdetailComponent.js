import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Modal, ModalHeader, ModalBody, Row, Label, Col, Button
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, Errors, LocalForm } from 'react-redux-form';

import { Loading } from './LoadingComponent';

import { baseUrl } from '../shared/baseUrl';

const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
const required = (val) => val && val.length;

class CommentForm extends Component {

    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
            isModalOpen: false
        };
    }

    handleSubmit(values) {
        this.toggleModal();
        alert('Your Inputs are: ' + JSON.stringify(values));

        this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);

    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>

                            <Row className="form-group">
                                <Label htmlFor="rating" xs="12">Rating</Label>
                                <Col>
                                    <Control.select defaultValue="5" model=".rating" id="rating" name="rating" className="form-control">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </Control.select>
                                </Col>
                            </Row>

                            <Row className="form-group">
                                <Label htmlFor="name" xs="12">Your Name</Label>
                                <Col>
                                    <Control.text model=".name" id="name" name="name"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(18)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".name"
                                        show="touched"
                                        messages={{
                                            required: 'Required ',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>

                            <Row className="form-group">
                                <Label htmlFor="comment" xs="12">Comment</Label>
                                <Col>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        className="form-control" rows="6"
                                    />
                                </Col>
                            </Row>

                            <Row className="form-group">
                                <Col>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
                <Button outline color="secondary" onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>
            </div>
        )
    }
}

function RenderDish({ dish }) {
    if (dish != null) {
        return (
            <div>
                <Card>
                    <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        )
    }
    else {
        return (<div></div>)
    }
}

function RenderComments({ comments, addComment, dishId }) {
    if (comments == null) {
        return (<div></div>)
    }
    const cmnts = comments.map(comment => {
        return (
            <li key={comment.id}>
                <p>{comment.comment}</p>
                <p>-- {comment.author},
                &nbsp;
                    {new Intl.DateTimeFormat('de-DE', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}
                </p>
            </li>
        )
    })
    return (
        <div>
            <h4> Comments </h4>
            <ul className='list-unstyled'>
                {cmnts}
            </ul>
            <CommentForm dishId={dishId} addComment={addComment} />
        </div>
    )
}



const DishDetail = (props) => {

    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if (props.dish != null)
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>

                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} width="100% !important" />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments comments={props.comments}
                            addComment={props.addComment}
                            dishId={props.dish.id}
                        />
                    </div>
                </div>
            </div>
        );
}


export default DishDetail