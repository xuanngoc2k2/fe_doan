import axios from 'axios';
export const backEndUrl = 'http://localhost:3000';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiaWQiOjExLCJ1c2VybmFtZSI6Inh1YW5uZ29jMmsyIiwiZW1haWwiOiJuZ29hamRhbnNzQGdtYWwuY29tZCIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzEyOTAxNjg4LCJleHAiOjE4MDEwMjk2ODh9.W-YfglC3P_9ktvMzqQv0BPH8kyAkjTxVreO8Buo_0u8';
const config = {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
}
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
    const { data } = await axios.post(`${backEndUrl}/exams/question/${id} `, {}, config);
    const examGrquestions = data.data.examGrquestions;
    const listQuestion = [];
    for (const k in examGrquestions) {
        listQuestion.push(examGrquestions[k]['groupQuestion']);
    }
    const duration = data.data.duration;
    return { duration, listQuestion }
}
export const postResult = async (result: unknown) => {
    const { data } = await axios.post(`${backEndUrl}/result`, result, config);
    return { data }
}

export const getListResult = async () => {
    const { data } = await axios.get(`${backEndUrl}/result`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
    // console.log(data)
    return data;
}

export const getResultInfo = async (resultId: number) => {
    const { data } = await axios.get(`${backEndUrl}/result/${resultId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
    // console.log(data)
    return data;
}
export const getResultQuestionDetail = async (resultId: number) => {
    const { data } = await axios.post(`${backEndUrl}/result-detail/${resultId}`, {}, config);
    // const duration = data.data.duration;
    const listQuestion = data.data;
    return { listQuestion }
}