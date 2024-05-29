import { Card, Progress, ProgressProps, Tag, Tooltip } from 'antd';
import './styles/card-course.scss';
import {
    FieldTimeOutlined,
    TeamOutlined,
    //  UsergroupAddOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ICourse } from '../custom/type';
import { backEndUrl } from '../apis';

const twoColors: ProgressProps['strokeColor'] = {
    '0%': '#108ee9',
    '100%': '#87d068',
};
const CardCourse: React.FC<{ course: ICourse }> = ({ course }) => {
    return (
        <div className='card-course' style={{ marginBottom: 20 }}>
            <Link to={course.id ? `/course/${course.id}` : '/'}>
                <Card
                    // style={{ position: 'relative' }}
                    hoverable
                    cover={
                        <img
                            style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
                            alt="example"
                            src={`${backEndUrl}/images/course/${course.image}`} />}
                >
                    <div className='course-info'>
                        <div className='course-name'>
                            <h2>{course.course_name}</h2>
                            <div className='course-time'>
                                <Tag color='geekblue' style={{ display: 'flex', marginInlineEnd: 0 }}><FieldTimeOutlined style={{ color: '#1677ff', fontSize: 20 }} /> <p style={{ fontSize: 14, fontWeight: 500, margin: 3 }}>{course.totalTime}</p></Tag>
                                {/* <p><UsergroupAddOutlined style={{ color: '#1677ff', fontSize: 20 }} /> 888888</p> */}
                            </div>
                        </div>
                        <Tooltip placement='bottom' title={course.description}><p className='course-description'>{course.description}</p></Tooltip>
                    </div>
                    <div className='course-progress'>
                        <Progress strokeColor={twoColors} percent={course.progress || 0} showInfo={false} />
                        <p>{course.progress || 0}% Hoàn thành</p>
                    </div>
                    <div className='course-people'>
                        <TeamOutlined /> <span>{course.totalUsers} tham gia</span>
                    </div>
                    {/* <Meta title="Europe Street beat" description="www.instagram.com" /> */}
                </Card>
            </Link>
        </div>
    );
};

export default CardCourse;
