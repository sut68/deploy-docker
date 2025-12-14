import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  Avatar,
  Typography,
  Spin,
  Button,
  Popconfirm,
  Empty,
  Tag,
  Space,
  message,
} from "antd";
import {
  HistoryOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { History } from "../../interfaces";
import { historyAPI } from "../../services/https";
import { useHistory } from "../../hooks/useHistory";
import { formatDate } from "../../utils/dateUtils";

const { Title, Text } = Typography;

const HistoryPage: React.FC = () => {
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const { playSoundWithHistory } = useHistory();

  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    try {
      setLoading(true);
      const response = await historyAPI.getAll();
      const userHistories = (response.data || response).filter(
        (history: History) => history.member_id === Number(userId)
      );
      // Sort by played_at descending (most recent first)
      userHistories.sort(
        (a: History, b: History) =>
          new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
      );
      setHistories(userHistories);
    } catch (error) {
      console.error("Error fetching histories:", error);
      messageApi.error("ไม่สามารถโหลดประวัติการฟังได้");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (historyId: number) => {
    try {
      await historyAPI.delete(historyId);
      messageApi.success("ลบประวัติการฟังสำเร็จ");
      fetchHistories();
    } catch (error) {
      console.error("Error deleting history:", error);
      messageApi.error("ไม่สามารถลบประวัติการฟังได้");
    }
  };

  const handlePlayAgain = async (soundId: number) => {
    // บันทึกประวัติการฟังใหม่
    const historyResult = await playSoundWithHistory(soundId);

    if (historyResult) {
      messageApi.success("เริ่มเล่นเพลงอีกครั้งและบันทึกประวัติการฟังแล้ว");
    } else {
      messageApi.success("เริ่มเล่นเพลงอีกครั้ง");
    }
  };



  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {contextHolder}
      <Title level={2}>ประวัติการฟัง</Title>

      {histories.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="ยังไม่มีประวัติการฟัง"
          />
        </Card>
      ) : (
        <Card>
          <List
            dataSource={histories}
            rowKey={(history) => history.ID}
            renderItem={(history) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handlePlayAgain(history.sound_id)}
                  >
                    เล่นอีกครั้ง
                  </Button>,
                  <Popconfirm
                    title="คุณแน่ใจหรือไม่ที่จะลบประวัติการฟังนี้?"
                    onConfirm={() => handleDeleteHistory(history.ID)}
                    okText="ใช่"
                    cancelText="ไม่"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      ลบ
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={<HistoryOutlined />}
                      style={{ backgroundColor: "#1890ff" }}
                    />
                  }
                  title={
                    <Space>
                      {history.sound?.title || "ไม่พบข้อมูลเพลง"}
                      <Tag color="blue">{history.sound?.sound_type?.name}</Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Text type="secondary">
                        ศิลปิน: {history.sound?.artist || "ไม่ทราบ"}
                      </Text>
                      <br />
                      <Text type="secondary">
                        <ClockCircleOutlined /> {formatDate(history.played_at)}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default HistoryPage;
