import axios from 'axios';

export const updateStudent = ({ id, data }) => axios.patch(`http://localhost:4000/students/${id}`, data);
