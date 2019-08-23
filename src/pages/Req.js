import React, { Component } from 'react';
import { Form, Button, Col, Row, Spinner } from 'react-bootstrap';
import { addRequest, updateRequest, getRequest } from '../utils/http';

class Req extends Component {
    state = {
        req: {
            no: null,
            date: null,
            firm: "",
            fio: "",
            position: "",
            email: ""
        },
        tmpReq: {
            firm: "",
            fio: "",
            position: "",
            email: ""
        },
        showSpinner: false,
        isDisabled: true
    }

    componentDidMount = () => {
        const { match } = this.props;
        if (match.params.id) {
            getRequest(match.params.id).then(resp => {
                resp.status === 200 ?
                    this.setState({
                        req: resp.data,
                        tmpReq: resp.data
                    }) : alert('Error');
            }).catch(err => alert('Connection error'));
        } else {
            this.setState({ isDisabled: false });
        }
    }

    validator = {
        isNameValid: () => {
            return this.state.tmpReq.fio.length > 0;
        },
        isFirmValid: () => {
            return this.state.tmpReq.firm.length > 0;
        },
        isPositionValid: () => {
            return this.state.tmpReq.position.length > 0;
        },
        isEmailValid: () => {
            const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return reg.test(String(this.state.tmpReq.email).toLowerCase());
        },
        isFormValid: function () {
            return this.isNameValid() && this.isFirmValid() &&
                this.isPositionValid() && this.isEmailValid();
        },
    }

    saveRequest = (request) => {
        this.setState({ showSpinner: true });
        if (request.no) {
            updateRequest(request).then(resp => {
                if (resp.status === 204) {
                    this.setState({
                        req: request,
                        isDisabled: true
                    });
                } else {
                    alert("Error");
                }
                console.log(resp);
            }).catch(err => {
                alert("Connection error")
                console.error(err);
            }).finally(() => this.setState({ showSpinner: false }))
        } else {
            addRequest(request).then(resp => {
                if (resp.status === 201) {
                    this.setState({
                        req: request,
                        isDisabled: true
                    });
                } else {
                    alert("Error");
                }
                console.log(resp);
            }).catch(err => {
                alert("Connection error")
                console.error(err);
            }).finally(() => this.setState({ showSpinner: false }));
        }
    }

    changeTmpReq = (value, fildName) => {
        this.setState(state => {
            state.tmpReq[fildName] = value
            return { ...state }
        })
    }

    render() {
        const { isDisabled, req, tmpReq, showSpinner } = this.state;
        const { history } = this.props;

        return (
            <div className="req-edit-form">
                {this.props.children}
                <Form>
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="2">
                            Имя*
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="text"
                                placeholder="Введите полное имя"
                                value={tmpReq.fio}
                                onChange={(event) => this.changeTmpReq(event.target.value, 'fio')}
                                disabled={isDisabled}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="2">
                            Компания*
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="string"
                                placeholder="Введите название компании"
                                value={tmpReq.firm}
                                onChange={(event) => this.changeTmpReq(event.target.value, 'firm')}
                                disabled={isDisabled}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="2">
                            Должность*
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="string"
                                placeholder="Введите должность"
                                value={tmpReq.position}
                                onChange={(event) => this.changeTmpReq(event.target.value, 'position')}
                                disabled={isDisabled}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="2">
                            Email*
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="string"
                                placeholder="Введите адрес электронной почты"
                                value={tmpReq.email}
                                onChange={(event) => this.changeTmpReq(event.target.value, 'email')}
                                disabled={isDisabled}
                            />
                        </Col>
                    </Form.Group>
                    <small>* - поля обязательные для заполнения</small>
                    <div className="req-edit-btn-container">
                        <Button variant="outline-secondary"
                            className="btn-standart"
                            onClick={() => history.push('/')}>
                            Вернуться
                        </Button>
                        <Button variant="success"
                            className="btn-standart"
                            disabled={isDisabled || !this.validator.isFormValid()}
                            onClick={() => this.saveRequest({ ...req, ...tmpReq })}>
                            {
                                showSpinner &&
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            }
                            Сохранить
                        </Button>
                        {
                            isDisabled === false ?
                                <Button variant="danger"
                                    className="btn-standart"
                                    onClick={() => {
                                        this.setState({
                                            tmpReq: {
                                                ...req
                                            },
                                            isDisabled: true
                                        });
                                    }}>
                                    Отмена
                                </Button> :
                                <Button variant="primary"
                                    className="btn-standart"
                                    onClick={() => {
                                        this.setState({
                                            isDisabled: false
                                        })
                                    }}>
                                    Редактировать
                                </Button>
                        }
                    </div>
                </Form>
            </div>
        )
    }
}

export default Req;