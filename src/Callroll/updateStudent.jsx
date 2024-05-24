import axios from 'axios';
import {useParams} from 'react-router-dom';
const params = useParams.courseId

export const updateStudent = ({ id, data }) => axios.patch(`http://localhost:4000/${params}/${id}`, data);