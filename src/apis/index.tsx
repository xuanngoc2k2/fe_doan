import axios from 'axios';
export const backEndUrl = 'http://localhost:3000';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiaWQiOjExLCJ1c2VybmFtZSI6Inh1YW5uZ29jMmsyIiwiZW1haWwiOiJuZ29hamRhbnNzQGdtYWwuY29tZCIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcxMjgwNTY5OSwiZXhwIjoxODAwOTMzNjk5fQ.AY8V1L6QqIcMToK7kOh75aBza-XhL-LccnMyTIRbkxc';
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
export const getListQuestionOfExam = async (id: number) => {
    const { data } = await axios.post(`${backEndUrl}/exams/question/${id} `, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const examGrquestions = data.data.examGrquestions;
    const listQuestion = [];
    for (const k in examGrquestions) {
        listQuestion.push(examGrquestions[k]['groupQuestion']);
    }
    const duration = data.data.duration;
    return { duration, listQuestion }
}