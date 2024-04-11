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