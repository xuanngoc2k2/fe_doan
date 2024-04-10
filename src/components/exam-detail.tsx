import { FieldTimeOutlined, UserOutlined } from "@ant-design/icons";
import {
    // Divider,
    Tag
} from "antd";
import './styles/exam-detail.scss'
import { Link } from "react-router-dom";

const exam = {
    id: 6,
    exam_name: 'TOPIK Trung cấp 4 chính thức',
    description: 'Kiến thức nhập môn tiếng Hàn',
    duration: 40,
    countUser: 230,
    countTypeQuestion: 10,
    countQuestion: 200,
    type: 'TOPIK II'
}
function ExamDetail() {
    return (
        <div className="exam-detail-container">
            <div className="exam-detail">
                <Tag color="cyan">{exam.type}</Tag>
                <h1 style={{ marginBottom: 10 }}>{exam.exam_name}</h1>
                <span className="exam-detail-info-t">Thông tin đề thi</span>
                <div className="exam-detail-info">
                    <div className="exam-detail-info-item">
                        <FieldTimeOutlined />
                        <p>Thời gian làm bài: {exam.duration} | {exam.countTypeQuestion} phần thi | {exam.countQuestion} câu hỏi</p>
                    </div>
                    <div className="exam-detail-info-item">
                        <UserOutlined />
                        <p>{exam.countUser} người đã luyện tập đề thi này</p>
                    </div>
                    <div className="exam-detail-info-item">
                        <p>
                            {exam.description}
                        </p>
                    </div>
                </div>
                <div className="exam-detail-btn">
                    <div className="exam-detail-info-t"><Link to={`/exam/questions/${exam.id}`}>Làm đề thi ngay</Link></div>
                </div>
            </div>
            {/* <Divider /> */}
        </div>
    );
}

export default ExamDetail;