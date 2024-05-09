import {
    BookOutlined,
    FontColorsOutlined,
    FormOutlined,
    HighlightOutlined,
    NotificationOutlined,
    QuestionCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Card, Space, Statistic, Typography } from "antd";
import React, { useEffect, useState } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { getAllNews, getAllUser, getAllVocabulary, getListCourses, getListExams, getListLesson, getListQuestion } from "../../apis";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const [dataCount, setDataCount] = useState<{ course: number, user: number, lesson: number, question: number, exam: number, vocab: number, news: number }>();
    useEffect(() => {
        const fetch = async () => {
            const resU = await getAllUser();
            if (resU && resU.data) {
                setDataCount((prev) => ({ ...prev!, user: resU.data.length }))
            }
            const resC = await getListCourses();
            if (resC && resC.data) {
                setDataCount((prev) => ({ ...prev!, course: resC.data.length }))
            }
            const resL = await getListLesson();
            if (resL && resL.data) {
                setDataCount((prev) => ({ ...prev!, lesson: resL.data.length }))
            }
            const resQ = await getListQuestion();
            if (resQ && resQ.data) {
                setDataCount((prev) => ({ ...prev!, question: resQ.data.length }))
            }
            const resE = await getListExams();
            if (resE && resE.data) {
                setDataCount((prev) => ({ ...prev!, exam: resE.data.length }))
            }
            const resV = await getAllVocabulary();
            if (resV && resV.data) {
                setDataCount((prev) => ({ ...prev!, vocab: resV.data.length }))
            }
            const resN = await getAllNews();
            if (resN && resN.data) {
                setDataCount((prev) => ({ ...prev!, news: resN.data.length }))
            }
        }
        fetch();
    }, [])
    return (
        <Space size={20} direction="vertical">
            <Typography.Title style={{ marginLeft: 50 }} level={4}>Dashboard</Typography.Title>
            <Space size={30} style={{ marginLeft: 50, display: 'flex', flexWrap: 'wrap' }} direction="horizontal">
                <DashboardCard
                    icon={
                        <UserOutlined
                            style={{
                                color: "#c41d7f",
                                backgroundColor: "#fff0f6",
                                borderRadius: 20,
                                fontSize: 24,
                                padding: 8,
                            }}
                        />
                    }
                    title={"Người dùng"}
                    value={dataCount?.user}
                />
                <DashboardCard
                    icon={
                        <BookOutlined
                            style={{
                                color: "#cf1322",
                                backgroundColor: "#fff1f0",
                                borderRadius: 20,
                                fontSize: 24,
                                padding: 8,
                            }}
                        />
                    }
                    title={"Khóa học"}
                    value={dataCount?.course}
                />
                <DashboardCard
                    icon={
                        <FormOutlined
                            style={{
                                color: "#08979c",
                                backgroundColor: "#e6fffb",
                                borderRadius: 20,
                                fontSize: 24,
                                padding: 8,
                            }}
                        />
                    }
                    title={"Bài học"}
                    value={dataCount?.lesson}
                />
                <DashboardCard
                    icon={
                        <QuestionCircleOutlined
                            style={{
                                color: "#d46b08",
                                backgroundColor: "#fff7e6",
                                borderRadius: 20,
                                fontSize: 24,
                                padding: 8,
                            }}
                        />
                    }
                    title={"Question"}
                    value={dataCount?.question}
                />
                <DashboardCard
                    icon={
                        <HighlightOutlined
                            style={{
                                color: "#d48806",
                                backgroundColor: "#fffbe6",
                                borderRadius: 20,
                                fontSize: 24,
                                padding: 8,
                            }}
                        />
                    }
                    title={"Exam"}
                    value={dataCount?.exam}
                />
                <DashboardCard
                    icon={
                        <FontColorsOutlined
                            style={{
                                color: "#389e0d",
                                backgroundColor: "#f6ffed",
                                borderRadius: 20,
                                fontSize: 24,
                                padding: 8,
                            }}
                        />
                    }
                    title={"Vocabulary"}
                    value={dataCount?.vocab}
                />
                <DashboardCard
                    icon={
                        <NotificationOutlined
                            style={{
                                color: "#0958d9",
                                backgroundColor: "#e6f4ff",
                                borderRadius: 20,
                                fontSize: 24,
                                padding: 8,
                            }}
                        />
                    }
                    title={"News"}
                    value={dataCount?.news}
                />
            </Space>
            <Space>
                {/* <RecentOrders />
                <DashboardChart /> */}
            </Space>
        </Space>
    );
}

function DashboardCard({ title, value, icon }: { title: string, value?: number, icon: React.ReactNode }) {
    return (
        <Card style={{ minWidth: 170 }}>
            <Space direction="horizontal">
                {icon}
                <Statistic title={title} value={value} />
            </Space>
        </Card>
    );
}
export default Dashboard;