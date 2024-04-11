import axios from 'axios';
export const backEndUrl = 'http://localhost:3000';
export const getListCourses = async () => {
    const { data } = await axios.get(`${backEndUrl}/course`);
    return data;
}