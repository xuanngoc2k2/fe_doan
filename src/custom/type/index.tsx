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
}

export interface IQuestion {
    id: number;
    score: number;
    type: string;
    question: string;
    answers: IAnswer[];
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
