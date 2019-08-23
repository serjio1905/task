import Axios from 'axios';

export const checkAlive = () => {
    return Axios.get('/api/life')
}

export const addRequest = (req) => {
    const body = {
        firm: req.firm,
        fio: req.fio,
        position: req.position,
        email: req.email
    }
    return Axios.post('/api/request', body, {
        "Accept": "application/json",
        "Content-type": "application/json",
    });
}

export const updateRequest = (req) => {
    const body = {
        no: req.no,
        firm: req.firm,
        fio: req.fio,
        position: req.position,
        email: req.email,
        date: req.date
    }
    return Axios.put(`/api/request/${req.no}`, body, {
        "Accept": "application/json",
        "Content-type": "application/json",
    });
}

export const getAllRequest = () => {
    return Axios.get('/api/request');
}

export const getRequest = (id) => {
    return Axios.get(`/api/request/${id}`);
}

export const deleteRequest = (id) => {
    return Axios.delete(`/api/request/${id}`);
}
