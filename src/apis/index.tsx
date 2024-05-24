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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callRegister = async (user: type.IUser): Promise<{ data?: any, message?: string }> => {
    try {
        return await axios.post(`${backEndUrl}/auth/register`, { ...user })
            .then((response: { data?: type.IUser, message?: string }) => {
                if (response.data) {
                    return { data: response.data }; // Trả về dữ liệu nếu có
                } else {
                    console.log(response)
                    return { message: String(response.message) }; // Trả về thông điệp lỗi nếu không có dữ liệu
                }
            })
            .catch(error => {
                throw error; // Ném lỗi để được xử lý ở phần catch bên ngoài
            });
    }
    catch (error) {
        console.log(String(error));
        throw error; // Ném lỗi để được xử lý ở phần catch bên ngoài
    }
};

export const getListCourses = async () => {
    const user = await getInfoUser();
    const { data } = await axios.post(`${backEndUrl}/course/all`, { user: user.data });
    return { data };
}
export const startCourse = async (courseId: number) => {
    const { data } = await axios.post(`${backEndUrl}/user-course`, { courseId });
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
export const adminGetListQuestionExam = async (id: number) => {
    const { data } = await axios.post(`${backEndUrl}/exams/admin/${id}`);
    return { data };
}
export const getListQuestionOfExam = async (id: number) => {
    const { data } = await axios.post(`${backEndUrl}/exams/question/${id} `, {});
    const examGrquestions = data.examGrquestions;
    const listQuestion = [];
    for (const k in examGrquestions) {
        listQuestion.push(examGrquestions[k]);
    }
    const duration = data.duration;
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

export const getRanking = async () => {
    const { data } = await axios.post(`${backEndUrl}/result/ranking`);
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
    const listQuestion = data;
    return { listQuestion }
}
export const getAllListVocab = async (search?: string) => {
    if (search) {
        const { data } = await axios.get(`${backEndUrl}/list-vocab?search=${search}`);
        // const duration = data.data.duration;
        return { data }
    }
    else {
        const { data } = await axios.get(`${backEndUrl}/list-vocab`);
        // const duration = data.data.duration;
        return { data }
    }
}

export const postNewList = async (value: type.IListVocab) => {
    const { data } = await axios.post(`${backEndUrl}/list-vocab`, value);
    return { data }
}
export const updateListVocab = async (id: number, value: type.IListVocab) => {
    const { data } = await axios.put(`${backEndUrl}/list-vocab/${id}`, value);
    return { data }
}
export const getVocabOfList = async (id: string) => {
    const { data } = await axios.get(`${backEndUrl}/list-vocab/${id}`);
    return { data }
}

export const deleteList = async (id: string) => {
    const { data } = await axios.delete(`${backEndUrl}/list-vocab/${id}`);
    return { data }
}
export const copyNewList = async (idList: string, name?: string, des?: string) => {
    const { data } = await axios.post(`${backEndUrl}/list-vocab/copy`, { idList, name, des });
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
            return res.data;
        }
    }
    catch (error) {
        console.log(error)
    }
    return 'Lỗi';
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callUploadVideo = async (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('video', file);
    try {
        const res = await axios.post(`${backEndUrl}/file/upload-video`, bodyFormData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "folder_type": folderType
            }
        })
        if (res.data) {
            return res.data;
        }
    }
    catch (error) {
        console.log(error)
    }
    return 'Lỗi';
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callUploadAudio = async (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('audio', file);
    try {
        const res = await axios.post(`${backEndUrl}/file/upload-audio`, bodyFormData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "folder_type": folderType
            }
        })
        if (res.data) {
            return res.data;
        }
    }
    catch (error) {
        console.log(error)
    }
    return 'Lỗi';
}

export const creatNewVocabOfList = async (idList: number, vocabulary: type.IVocabulary) => {
    const { data } = await axios.post(`${backEndUrl}/user-vocabulary`, { idList, vocabulary });
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

export const addVocabOfList = async (listVocab: type.IVocabulary[], idList: number) => {
    const { data } = await axios.post(`${backEndUrl}/vocabularys/addVocabOfList`, { listVocab, idList });
    return { data };
}

export const getInfoUser = async () => {
    const { data } = await axios.post(`${backEndUrl}/users/user`, {});
    return { data }
}
export const getAllUser = async () => {
    const { data } = await axios.get(`${backEndUrl}/users`);
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
export const getCourseWithLessons = async (id: number) => {
    const { data } = await axios.post(`${backEndUrl}/course/allWithLesson/${id}`, {});
    return { data }
}
export const updateDoneLesson = async (id: number) => {
    const { data } = await axios.patch(`${backEndUrl}/user-lesson/${id}`, {});
    return { data }
}
export const addNote = async (comment: string, lessonId: number, commentAt?: string) => {
    const data = await axios.post(`${backEndUrl}/comment`, { comment, commentAt, lessonId });
    return data
}
export const getAllNote = async (lessonId: number, isComment?: boolean) => {
    const data = await axios.post(`${backEndUrl}/comment/getAllNote`, { lessonId, isComment: isComment });
    return data;
}
export const deleteNote = async (id: number) => {
    const { data } = await axios.delete(`${backEndUrl}/comment/${id}`);
    return { data }
}
export const updateNote = async (id: number, comment: string) => {
    const { data } = await axios.patch(`${backEndUrl}/comment/${id}`, { comment });
    return { data }
}
export const callDeleteCourse = async (id: number) => {
    const { data } = await axios.delete(`${backEndUrl}/course/${id}`);
    return { data }
}
export const searchCourse = async (search: string, level: number[]) => {
    const { data } = await axios.post(`${backEndUrl}/course/search`, { search, level });
    return { data }
}
export const createNewCourse = async (course: type.ICourse) => {
    const { data } = await axios.post(`${backEndUrl}/course`, { ...course });
    return { data }
}
export const updateCourse = async (id: number, course_name: string, description: string, image: string, level_required: number) => {
    const { data } = await axios.put(`${backEndUrl}/course/${id}`, { course_name, description, image, level_required });
    return { data }
}
export const getListLesson = async () => {
    const { data } = await axios.get(`${backEndUrl}/lesson`);
    return { data }
}
export const searchLesson = async (search: string, courseId?: number) => {
    const { data } = await axios.post(`${backEndUrl}/lesson/search`, { search, courseId });
    return { data }
}
export const getLesson = async (id: number) => {
    const { data } = await axios.get(`${backEndUrl}/lesson/${id}`);
    return { data }
}
export const deleteLesson = async (id: number) => {
    const { data } = await axios.delete(`${backEndUrl}/lesson/${id}`);
    return { data }
}
export const getAllGroupQuestion = async () => {
    const { data } = await axios.get(`${backEndUrl}/group-question`);
    return { data }
}
export const getAllQuestionByGroupQuestion = async (id: number) => {
    const { data } = await axios.get(`${backEndUrl}/group-question/question/${id}`);
    return { data }
}
// export const getQu
export const createNewLesson = async (lesson: type.ILesson) => {
    const { data } = await axios.post(`${backEndUrl}/lesson`, lesson);
    return { data }
}
export const updateLesson = async (id: number, lesson: type.ILesson) => {
    const { data } = await axios.put(`${backEndUrl}/lesson/${id}`, { ...lesson });
    return { data }
}
export const getListQuestion = async () => {
    const { data } = await axios.get(`${backEndUrl}/question`);
    return { data }
}
export const searchQuestion = async (S: { search: string, groupQuestion: number, type: string }) => {
    const { data } = await axios.post(`${backEndUrl}/question/search`, { ...S });
    return { data };
}
export const deleteQuestion = async (id: number) => {
    const { data } = await axios.delete(`${backEndUrl}/question/${id}`);
    return { data };
}
export const getDetailQuestion = async (id: string) => {
    const { data } = await axios.get(`${backEndUrl}/question/${id}`);
    return { data };
}
export const getRandomQuestion = async () => {
    const { data } = await axios.post(`${backEndUrl}/question/random`);
    return { data };
}
export const getDetailQuestionLesson = async (id: string) => {
    const { data } = await axios.post(`${backEndUrl}/question/detail/${id}`);
    return { data };
}
export const getAnswer = async (id: number) => {
    const { data } = await axios.get(`${backEndUrl}/answer/${id}`);
    return { data };
}
export const updateAnswer = async (id: number, answerU: type.IAnswer) => {
    const { answer, explain, isImage } = answerU;
    const { data } = await axios.put(`${backEndUrl}/answer/${id}`, { answer, explain, isImage });
    return { data };
}
export const addAnswer = async (answer: type.IAnswer, questionId: number) => {
    const { data } = await axios.post(`${backEndUrl}/answer`, { ...answer, questionId, is_true: false });
    return { data };
}
export const deleteAnswer = async (id: number) => {
    const { data } = await axios.delete(`${backEndUrl}/answer/${id}`);
    return { data };
}
export const updateQuestion = async (id: number, question: type.IQuestion) => {
    const { data } = await axios.put(`${backEndUrl}/question/${id}`, { ...question });
    return { data };
}
export const checkAnswerQuestion = async (idAns: number, idQues: number) => {
    const { data } = await axios.post(`${backEndUrl}/question/check`, { idAns, idQues });
    return { data };
}
export const createNewQuestion = async (question: type.IQuestion[], group_question: type.IGroupQuestion) => {
    const { data } = await axios.post(`${backEndUrl}/question/create-new`, { question, group_question });
    return { data };
}
export const updateGroupQuestion = async (id: number, dataUpdate: type.IGroupQuestion) => {
    const { data } = await axios.put(`${backEndUrl}/group-question/${id}`, { ...dataUpdate });
    return { data };
}
export const getQuestionByIdGr = async (idGroup: string, idQuestion: string) => {
    const { data } = await axios.post(`${backEndUrl}/group-question/question`, { idGroup, idQuestion });
    return { data };
}
export const deleteExam = async (id: number) => {
    const { data } = await axios.delete(`${backEndUrl}/exams/${id}`);
    return { data };
}
export const updateExam = async (id: number, exam: type.IExam, questions: type.IQuestion[]) => {
    const { data } = await axios.put(`${backEndUrl}/exams/${id}`, { exam, questions });
    return { data };
}
export const getExamByType = async (type: string) => {
    const { data } = await axios.post(`${backEndUrl}/exams/type`, { type });
    return { data };
}
export const searchExam = async (search: string, type: string) => {
    const { data } = await axios.post(`${backEndUrl}/exams/search`, { search, type });
    return { data };
}
// export const createNewExam = async (exam: type.IExam, group_questions: type.IGroupQuestion[]) => {
//     const { data } = await axios.post(`${backEndUrl}/exams`, { exam, group_questions });
//     return { data };
// }
//test new
export const createNewExam = async (exam: type.IExam, questions: type.IQuestion[]) => {
    const { data } = await axios.post(`${backEndUrl}/exams`, { exam, questions });
    return { data };
}
export const getAllVocabulary = async (id?: number, word?: string, meaning?: string, level?: string[], listId?: number) => {
    const { data } = await axios.post(`${backEndUrl}/vocabularys/search`, { id, word, meaning, level, listId });
    return { data };
}
export const searchVocab = async (search: string) => {
    const { data } = await axios.post(`${backEndUrl}/vocabularys/userSearch`, { search });
    if (data) {
        return { data };
    }
    else {
        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${search}&langpair=ko|vi`);
            if (response.ok) {
                const data = await response.json();
                console.log(data.responseData.translatedText)
                const word = data.responseData.translatedText
                const apiUrl = `https://ac.dict.naver.com/enendict/ac?q=${encodeURIComponent(search)}&q_enc=utf-8&st=11001`;
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data.items && data.items.length > 0) {
                            const pronunciation = data.items[0].hvoice;
                            console.log("Phiên âm của từ '" + word + "' là: " + pronunciation);
                        } else {
                            console.log("Không tìm thấy phiên âm cho từ '" + word + "'");
                        }
                    })
                    .catch(error => {
                        console.error("Lỗi khi tìm phiên âm:", error);
                    });
                return { data: { word: search, meaning: data.responseData.translatedText } };
            } else {
                console.error("Failed to fetch translation:", response.statusText);
                return { data: null };
            }
        } catch (fetchError) {
            console.error("Error fetching translation:", fetchError);
            return { data: null };
        }
    }
}
export const deleteVocab = async (id: number) => {
    const { data } = await axios.delete(`${backEndUrl}/vocabularys/${id}`);
    return { data };
}
export const createNewVocab = async (newVocab: type.IVocabulary, idList?: number) => {
    const { data } = await axios.post(`${backEndUrl}/vocabularys`, { newVocab, idList });
    return { data };
}
export const getVocabById = async (id: number) => {
    const { data } = await axios.get(`${backEndUrl}/vocabularys/${id}`);
    return { data };
}
export const updateVocab = async (id: number, vocab: type.IVocabulary) => {
    const { data } = await axios.put(`${backEndUrl}/vocabularys/${id}`, { ...vocab });
    return { data };
}

export const getVocabNotOfList = async (idList: number, id?: number, word?: string, meaning?: string, level?: string[]) => {
    const { data } = await axios.post(`${backEndUrl}/vocabularys/get-not-of-list`, { idList, id, word, meaning, level });
    return { data };
}

export const getListVocabWithCourse = async () => {
    const { data } = await axios.post(`${backEndUrl}/user-vocabulary/course`, {});
    return { data };
}
export const getAllNews = async () => {
    const { data } = await axios.get(`${backEndUrl}/news`);
    return { data };
}
export const deleteNews = async (id: number) => {
    const { data } = await axios.delete(`${backEndUrl}/news/${id}`);
    return { data };
}
export const searchNews = async (search: string) => {
    const { data } = await axios.post(`${backEndUrl}/news/search`, { search });
    return { data };
}
export const creatNewNews = async (news: type.INews) => {
    const { data } = await axios.post(`${backEndUrl}/news`, { ...news });
    return { data };
}
export const updateNews = async (id: number, news: type.INews) => {
    const { data } = await axios.put(`${backEndUrl}/news/${id}`, { ...news });
    return { data };
}
export const getNewsById = async (id: number) => {
    const { data } = await axios.get(`${backEndUrl}/news/${id}`);
    return { data };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const client = new TextToSpeechClient({
//     keyFilename: 'D:\\Ki2_Nam4\\DOAN\\fe_doan\\public\\client_secret_850052617440-ks3dlbql8u95hbn0ivtn9eknt1cuolb9.apps.googleusercontent.com.json', // đường dẫn đến credentials.json
// });