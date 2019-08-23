import React, { Component } from 'react';
import { Table, Button, Modal} from 'react-bootstrap';
import moment from 'moment';
import { FaPen, FaTrash } from 'react-icons/fa';
import { getAllRequest, deleteRequest } from '../utils/http'

class ReqList extends Component {
    state = {
        reqs: [],
        showModal: false,
        currentReqId: null
        // reqs: [
        //     {
        //         no: 1,
        //         date: 123456,
        //         firm: "Roga i kopyta",
        //         fio: "Ivanov Ivan Ivanovitch",
        //         position: "director",
        //         email: "ivan@mail.com"
        //     }
        // ]
    }

    componentDidMount() {
        getAllRequest().then(resp => {
            resp.status === 200 ? this.setState({ reqs: resp.data }) : alert('Connection error');
        })
    }

    _deleteRow = () => {
        const {currentReqId} = this.state;
        deleteRequest(currentReqId).then(resp => {
            resp.status === 200 ? this.setState(state => {
                for (let i = 0; i < state.reqs.length; i++) {
                    if (state.reqs[i].no === currentReqId) {
                        state.reqs.splice(i, 1);
                        break;
                    }
                }
                return { ...state }
            }) : alert('Error');
        }).catch(err => alert('Connection error'));
    }

    _renderRows = () => {
        const { reqs } = this.state;
        const { history } = this.props;

        return reqs.map(req => {
            return (
                <tr key={req.no}
                    className="req-row">
                    <td>{req.no}</td>
                    <td>{moment(req.date).format('MMMM Do YYYY, h:mm:ss')}</td>
                    <td>{req.firm}</td>
                    <td>{req.fio}</td>
                    <td>{req.position}</td>
                    <td>{req.email}</td>
                    <td align="center">
                        <FaPen color="#28A745" onClick={() => history.push(`/req/${req.no}`)} />
                    </td>
                    <td align="center">
                        <FaTrash color="red" onClick={() => this.setState({currentReqId: req.no, showModal: true})} />
                    </td>
                </tr>
            )
        });
    }

    render() {
        const { history } = this.props;

        return (
            <div className="list">
                <div className="list-header">
                    <Button className="btn-standart"
                        variant="success"
                        onClick={() => history.push('/req')}>
                        Добавить
                    </Button>
                    <p>
                        Выберите запись в таблице для редактирования или нажмите на кнопку
                        "Добавить" для создания новой записи
                    </p>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th className="th-center">Дата</th>
                            <th className="th-center">Компания</th>
                            <th className="th-center">ФИО</th>
                            <th className="th-center">Должность</th>
                            <th className="th-center">Email</th>
                            <th colSpan={2} className="th-center">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this._renderRows()}
                    </tbody>
                </Table>
                <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Подтверждение</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Вы действительно хотите удалить запись?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({showModal: false})}>
                            Отмена
                        </Button>
                        <Button variant="danger" onClick={() => {
                            this._deleteRow();
                            this.setState({showModal: false});
                        }}>
                            Да
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default ReqList;