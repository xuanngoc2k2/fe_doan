export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}
export interface ICourse {
    course_name: string,
    description: string,
    image: string,
    progress?: number,
    totalTime?: string,
    // countUser?: number,
    id: number
    level_required: number,
    lessons?: ILesson[],
    createdAt?: Date,
    totalUsers?: number,
    started: boolean;
}
export interface ILesson {
    id: number,
    lesson_name: string,
    content: string,
    description: string,
    order: number,
    duration: string,
    isQuestion?: boolean,
    isComplete?: boolean,
    currentTime?: string,
    createdAt?: Date,
    thumbnail: string,
    courseId: number,
    course?: ICourse,
    questionId: number,
    question: IQuestion
}
export interface IExam {
    id: number,
    exam_name: string,
    description: string,
    duration: number,
    countUser: number,
    countTypeQuestion: number,
    countQuestion: number,
    type?: string,
    startAt?: Date,
    endAt?: Date,
    createdAt: Date
}
export interface IAnswer {
    id: number;
    answer: string;
    is_true?: boolean;
    isImage?: boolean;
    explain?: string;
}
export interface IResultDetail {
    resultId: number;
    questionId: number,
    user_answer: string,
    is_correct: boolean,
}
export interface IQuestion {
    id: number;
    score: number;
    type: string;
    question: string;
    answers: IAnswer[];
    result_details?: IResultDetail[];
    createdAt?: Date;
    level?: number;
    group_question?: IGroupQuestion;
    image?: string;
}
export const CreateNewQuestion = {
    score: 0,
    type: '',
    question: '',
    answers: [] as IAnswer[],
    level: 0,
    image: ''
}
export const CreateNewGroupQuestion = {
    content: '',
    description: '',
    image: '',
    questions: [] as IQuestion[],
    type: '',
    audio: '',
}

export interface IGroupQuestion {
    content: string;
    description: string;
    image?: string;
    id: number;
    questions: IQuestion[];
    type?: string;
    audio?: string;
}

// export interface IListQuestionItem {
//     groupQuestion: IGroupQuestion[];
// }
export interface IExamGrQuestion {
    groupQuestion: IGroupQuestion;
    groupQuestionId: number
}
export interface IResult {
    id: number
    score: number,
    examId: number,
    count: number,
    createdAt: string
    exam: {
        id: number,
        exam_name: string,
        type: string
    },
    totalScore?: number,
}
export interface ISubmitExam {
    examId: number;
    result: []
}
export interface IVocabulary {
    word?: string;
    example?: string;
    id?: number;
    image?: string;
    level?: number;
    meaning?: string;
    partOfSpeech?: string;
    spell?: string;
    createdAt?: Date;
}
export interface IListVocab {
    id: number;
    name: string;
    description?: string;
}
export interface IListVocabDetail {
    id: number;
    name: string;
    description?: string;
    needRemember: number;
    remembered: number;
    totalWords: number;
    vocabs: [{
        vocab: IVocabulary,
        isRemember: boolean
    }];
    isMine: boolean;
    createdAt?: Date
}
export interface IQuestionVocab {
    meaning: {
        id: number,
        meaning: string,
        spell: string,
        partOfSpeech: string
    },
    ans: string[],
    answer?: string,
    anTrue?: string
}
export interface IUser {
    id: number,
    username: string,
    email: string,
    phone_number: string,
    full_name: string,
    image: string,
    date_of_birth: Date,
    level: number,
    last_login: null,
    password?: string,
    newPass?: string
}
export interface IComment {
    id: number,
    comment: string,
    commentAt?: string,
    lessonId: number,
    user?: IUser,
    createdAt: string
}
export interface INews {
    id?: number,
    content: string,
    image?: string,
    createdAt?: Date
}