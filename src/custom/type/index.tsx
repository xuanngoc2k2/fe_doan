export interface ICourse {
    course_name: string,
    description: string,
    image: string,
    progress?: number,
    time: number,
    countUser: number,
    id: number
}
export interface IExam {
    id: 6,
    exam_name: string,
    description: string,
    duration: number,
    countUser: number,
    countTypeQuestion: number,
    countQuestion: number,
    type: string
}
export interface IAnswer {
    id: number;
    answer: string;
    is_true?: boolean;
    isImage?: boolean;
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
}

export interface IGroupQuestion {
    content: string;
    description: string;
    image?: string;
    id: number;
    questions: IQuestion[];
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
    }
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
}
export interface IListVocab {
    name: string;
    description?: string;
}
export interface IListVocabDetail {
    name: string;
    description?: string;
    needRemember: number;
    totalWords: number;
    vocabs: [{
        vocab: IVocabulary,
        isRemember: boolean
    }]
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