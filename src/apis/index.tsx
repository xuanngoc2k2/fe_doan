import axios from 'axios';
import { IListVocab, IVocabulary } from '../custom/type';
// import { TextToSpeechClient } from '@google-cloud/text-to-speech';
export const backEndUrl = 'http://localhost:3000';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiaWQiOjEsInVzZXJuYW1lIjoieHVhbm5nb2MyazIiLCJlbWFpbCI6Im5nb2FqZGFuc3NAZ21hbC5jb21kIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzEyOTU0NjY1LCJleHAiOjE4MDEwODI2NjV9.YdcK3IzdutxZZYbcL5BpYqtcBybgtHEffK3aY6gff7o';
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
export const getAllListVocab = async () => {
    const { data } = await axios.get(`${backEndUrl}/list-vocab`, config);
    // const duration = data.data.duration;
    return data
}

export const postNewList = async (value: IListVocab) => {
    const { data } = await axios.post(`${backEndUrl}/list-vocab`, value, config);
    // const duration = data.data.duration;
    return { data }
}
export const getVocabOfList = async (id: string) => {
    const { data } = await axios.get(`${backEndUrl}/list-vocab/${id}`, config);
    // const duration = data.data.duration;
    return data
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callUploadSingleFile = async (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
        const res = await axios.post(`${backEndUrl}/file/upload`, bodyFormData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "folder_type": folderType
            }
        })
        if (res.data) {
            const { data } = res.data;
            return data
        }
    }
    catch (error) {
        console.log(error)
    }
    return 'Lỗi';
}
export const creatNewVocabOfList = async (idList: number, vocab: IVocabulary) => {
    const { data } = await axios.post(`${backEndUrl}/user-vocabulary/${idList}`, vocab, config);
    // const duration = data.data.duration;
    return data
}
export const deleteVocabOfList = async (idList: number, idVocab: number) => {
    const { data } = await axios.post(`${backEndUrl}/user-vocabulary/remove/${idVocab}/${idList}`, {}, config);
    return data;
}
export const updateRemember = async (idList: number, idVocab: number) => {
    const { data } = await axios.post(`${backEndUrl}/user-vocabulary/updateRemember/${idVocab}/${idList}`, {}, config);
    return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const client = new TextToSpeechClient({
//     keyFilename: 'D:\\Ki2_Nam4\\DOAN\\fe_doan\\public\\client_secret_850052617440-ks3dlbql8u95hbn0ivtn9eknt1cuolb9.apps.googleusercontent.com.json', // đường dẫn đến credentials.json
// });