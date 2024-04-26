import axios from './config.axios';
// import axios from 'axios';
import * as type from '../custom/type';
// import { TextToSpeechClient } from '@google-cloud/text-to-speech';
export const backEndUrl = 'http://localhost:3000';
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiaWQiOjEsInVzZXJuYW1lIjoieHVhbm5nb2MyazIiLCJlbWFpbCI6Im5nb2FqZGFuc3NAZ21hbC5jb21kIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzEyOTU0NjY1LCJleHAiOjE4MDEwODI2NjV9.YdcK3IzdutxZZYbcL5BpYqtcBybgtHEffK3aY6gff7o';
// const config = {
//     headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//     }
// }
export const callLogout = async () => {
    const { data } = await axios.get(`${backEndUrl}/auth/logout`);
    return { data };
}
export const callFetchAccount = async () => {
    const { data } = await axios.get(`${backEndUrl}/auth/account`);
    return { data };
}
export const callLogin = async (username: string, password: string) => {
    const { data } = await axios.post(`${backEndUrl}/auth/login`, { username, password });
    return { data };
}
export const getListCourses = async () => {
    const user = await getInfoUser();
    const { data } = await axios.post(`${backEndUrl}/course/all`, { user: user.data });
    return { data };
}
export const getListExams = async () => {
    const { data } = await axios.get(`${backEndUrl}/exams`);
    return { data };
}
export const getExamById = async (id: string) => {
    const { data } = await axios.get(`${backEndUrl}/exams/${id}`);
    return { data };
}
export const getListQuestionOfExam = async (id: number) => {
    const { data } = await axios.post(`${backEndUrl}/exams/question/${id} `, {});
    const examGrquestions = data.data.examGrquestions;
    const listQuestion = [];
    for (const k in examGrquestions) {
        listQuestion.push(examGrquestions[k]['groupQuestion']);
    }
    const duration = data.data.duration;
    return { duration, listQuestion }
}
export const postResult = async (result: unknown) => {
    const { data } = await axios.post(`${backEndUrl}/result`, result);
    return { data }
}

export const getListResult = async () => {
    const { data } = await axios.get(`${backEndUrl}/result`);
    // console.log(data)
    return { data };
}

export const getResultInfo = async (resultId: number) => {
    const { data } = await axios.get(`${backEndUrl}/result/${resultId}`);
    // console.log(data)
    return { data };
}
export const getResultQuestionDetail = async (resultId: number) => {
    const { data } = await axios.post(`${backEndUrl}/result-detail/${resultId}`, {});
    // const duration = data.data.duration;
    const listQuestion = data.data;
    return { listQuestion }
}
export const getAllListVocab = async () => {
    const { data } = await axios.get(`${backEndUrl}/list-vocab`);
    // const duration = data.data.duration;
    return { data }
}

export const postNewList = async (value: type.IListVocab) => {
    const { data } = await axios.post(`${backEndUrl}/list-vocab`, value);
    // const duration = data.data.duration;
    return { data }
}
export const getVocabOfList = async (id: string) => {
    const { data } = await axios.get(`${backEndUrl}/list-vocab/${id}`);
    // const duration = data.data.duration;
    return { data }
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
            return { data }
        }
    }
    catch (error) {
        console.log(error)
    }
    return 'Lỗi';
}
export const creatNewVocabOfList = async (idList: number, vocab: type.IVocabulary) => {
    const { data } = await axios.post(`${backEndUrl}/user-vocabulary/${idList}`, vocab);
    // const duration = data.data.duration;
    return { data }
}
export const deleteVocabOfList = async (idList: number, idVocab: number) => {
    const { data } = await axios.post(`${backEndUrl}/user-vocabulary/remove/${idVocab}/${idList}`, {});
    return { data };
}
export const updateRemember = async (idList: number, idVocab: number) => {
    const { data } = await axios.post(`${backEndUrl}/user-vocabulary/updateRemember/${idVocab}/${idList}`, {});
    return { data };
}
export const renderQuestionVocab = async (idList: number) => {
    const { data } = await axios.post(`${backEndUrl}/user-vocabulary/test/${idList}`, {});
    return { data };
}
export const getResultQuestionVocab = async (listAnswer: type.IQuestionVocab[]) => {
    const { data } = await axios.post(`${backEndUrl}/vocabularys/checkResult`, listAnswer);
    return { data };
}
export const getInfoUser = async () => {
    const { data } = await axios.post(`${backEndUrl}/users/user`, {});
    return { data }
}
export const updateUserInfo = async (user: type.IUser) => {
    const { data } = await axios.put(`${backEndUrl}/users/${user.id}`, { user });
    return { data }
}
export const updatePass = async (pass: string, newPass: string) => {
    const { data } = await axios.post(`${backEndUrl}/users/updatePass`, { pass, newPass });
    return { data }
}
export const getCourseDetail = async (id: number) => {
    const user = await getInfoUser();
    const { data } = await axios.post(`${backEndUrl}/course/${id}`, {
        user: user.data
    });
    return { data }
}
export const updateDoneLesson = async (id: number) => {
    const { data } = await axios.patch(`${backEndUrl}/user-lesson/${id}`, {});
    return { data }
}
export const addNote = async (comment: string, lessonId: number, commentAt?: string) => {
    const { data } = await axios.post(`${backEndUrl}/comment`, { comment, commentAt, lessonId });
    return { data }
}
export const getAllNote = async (lessonId: number, isComment?: boolean) => {
    const { data } = await axios.post(`${backEndUrl}/comment/getAllNote`, { lessonId, isComment: isComment });
    return { data }
}
export const deleteNote = async (id: number) => {
    const { data } = await axios.delete(`${backEndUrl}/comment/${id}`);
    return { data }
}
export const updateNote = async (id: number, comment: string) => {
    const { data } = await axios.patch(`${backEndUrl}/comment/${id}`, { comment });
    return { data }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const client = new TextToSpeechClient({
//     keyFilename: 'D:\\Ki2_Nam4\\DOAN\\fe_doan\\public\\client_secret_850052617440-ks3dlbql8u95hbn0ivtn9eknt1cuolb9.apps.googleusercontent.com.json', // đường dẫn đến credentials.json
// });