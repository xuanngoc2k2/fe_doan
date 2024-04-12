import { Button, Divider, Form, FormInstance, Input, message, Radio } from 'antd';
import './styles/question-exam.scss';
import {
    useEffect,
    useRef,
    useState
} from 'react';
import { IGroupQuestion, IQuestion } from '../custom/type';
import { useParams } from 'react-router-dom';
import { getListQuestionOfExam } from '../apis';

function QuestionExam() {
    const [listQuestion, setListQuestion] = useState<IGroupQuestion[]>([]);
    const [duration, setDuration] = useState(0);
    const { idExam } = useParams();
    const questionRefs = useRef<(HTMLHeadingElement | null)[]>([]);
    const formRef = useRef<FormInstance<unknown>>(null);
    const [selectedQuestions, setSelectedQuestions] = useState<{ [key: number]: boolean }>({}); // Sử dụng đối tượng để lưu trữ trạng thái của các câu hỏi đã được chọn
    const [remainingTime, setRemainingTime] = useState(duration * 60); // Đổi đơn vị thời gian từ phút sang giây
    const [timeExpired, setTimeExpired] = useState(false);


    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getListQuestionOfExam(Number(idExam));
                if (res) {
                    setDuration(res.duration);
                    setListQuestion(res.listQuestion);
                    setRemainingTime(res.duration * 60);
                }
            } catch {
                message.open({
                    type: 'error',
                    content: 'Lỗi lấy data question'
                });
            }
        };
        fetch();
    }, [idExam]);

    useEffect(() => {
        // Tính toán thời gian đếm ngược
        const timer = setTimeout(() => {
            if (remainingTime > 0) {
                setRemainingTime(prevTime => prevTime - 1);
            } else {
                handleSubmit();
                setTimeExpired(true);
            }
        }, 1000);

        // Clear interval khi component unmount
        return () => clearTimeout(timer);
    }, [remainingTime]);

    const totalQuestions = listQuestion.reduce((total, groupQuestion) => {
        return total + groupQuestion.questions.length;
    }, 0);

    const handleSubmit = () => {
        setRemainingTime(0)
        setTimeExpired(true)
        if (formRef.current) {
            const values = formRef.current?.getFieldsValue(); // Lấy giá trị của các trường trong Form
            console.log('Submitted values:', values);

        }
        // Thực hiện các xử lý khác dựa trên giá trị của form ở đây
    };

    const scrollToQuestion = (index: number) => {
        if (questionRefs.current[index]) {
            questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    const handleChecked = (questionIndex: number) => {
        // Cập nhật trạng thái của câu hỏi đã được chọn
        setSelectedQuestions({
            ...selectedQuestions,
            [questionIndex]: true // Đảo ngược trạng thái hiện tại của câu hỏi
        });
    };

    //xử lí sự kiện refresh bài thi
    // useEffect(() => {
    //     const handleBeforeUnload = () => {
    //         // Xử lý sự kiện refresh
    //         setDuration(0);
    //         handleSubmit();
    //     };

    //     window.addEventListener('beforeunload', handleBeforeUnload);

    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // }, []);
    return (
        <div className='question-exam-container'>
            <Form ref={formRef} name='exam-result'>
                <Form.Item name={'examId'}>
                    <Input name='examId' value={idExam} style={{ display: 'none' }} />
                </Form.Item>
                <div className='list-question-content'>
                    {listQuestion.map((groupQuestion, groupIndex) => {
                        let num = 0;
                        if (groupIndex !== 0) {
                            for (let i = 0; i < groupIndex; i++) {
                                num += listQuestion[i].questions.length;
                            }
                        }
                        return (
                            <div key={groupIndex} className='group-question'>
                                <h3>※{groupQuestion.description}</h3>
                                <p>※{groupQuestion.content}</p>
                                <img src={groupQuestion.image} alt='question' />
                                <div className='list-question'>
                                    {groupQuestion.questions.map((question: IQuestion, questionIndex) => {
                                        const numberQuestion = num + questionIndex + 1;
                                        return (
                                            <section key={question.id}>
                                                <div style={{ display: 'flex' }} ref={el => (questionRefs.current[numberQuestion - 1] = el)} id={`#${numberQuestion}`}>
                                                    <h3 style={{ marginRight: 5 }}>Câu {numberQuestion}:</h3>
                                                    <p>{question.question}</p>
                                                </div>
                                                {question.answers.length && (
                                                    <Form.Item name={`${question.id}`}>
                                                        <Radio.Group onChange={() => { handleChecked(numberQuestion) }} key={`question-${question.id}`}>
                                                            {question.answers.map(a => {
                                                                return <Radio value={a.id}>{a.answer}</Radio>;
                                                            })}
                                                        </Radio.Group>
                                                    </Form.Item>
                                                )}
                                                <Divider />
                                            </section>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Form>
            <div>
                <div className='list-question-icon'>
                    <h2>Câu hỏi</h2>
                    <div className='list-question-btn'>
                        {[...Array(totalQuestions)].map((_, index) => (
                            <button className={selectedQuestions[index + 1] ? 'done' : ''} key={index} onClick={() => scrollToQuestion(index)}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <Button onClick={handleSubmit} disabled={timeExpired}>Nộp bài</Button>
                    <p>Thời gian làm bài {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}</p>
                </div>
            </div>
        </div>
    );
}

export default QuestionExam;
