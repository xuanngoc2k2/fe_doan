import axios from 'axios';
export const backEndUrl = 'http://localhost:3000';
export const getListCourses = async () => {
    const { data } = await axios.get(`${backEndUrl}/course`);
    return data;
}
export const getListExams = async () => {
    const { data } = await axios.get(`${backEndUrl}/exams`);
    return data;
}
export const getExamById = async (id: string) => {
    const { data } = await axios.get(`${backEndUrl}/exams/${id}`);
    return data;
}