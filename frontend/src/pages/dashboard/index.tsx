import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  List,
  Avatar,
  Typography,
  Spin,
  Button,
  Tag,
  Space,
} from "antd";
import {
  PlayCircleOutlined,
  UserOutlined,
  HeartOutlined,
  HistoryOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Sound, Playlist, History } from "../../interfaces";
import { soundAPI, playlistAPI, historyAPI } from "../../services/https";
import { useHistory } from "../../hooks/useHistory";
import { formatDate } from "../../utils/dateUtils";

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [recentSounds, setRecentSounds] = useState<Sound[]>([]);
  const [myPlaylists, setMyPlaylists] = useState<Playlist[]>([]);
  const [recentHistory, setRecentHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("username") || "User";
  const navigate = useNavigate();
  const { playSoundWithHistory } = useHistory();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch recent sounds
      const soundsResponse = await soundAPI.getAll();
      setRecentSounds((soundsResponse.data || soundsResponse).slice(0, 6));

      // Fetch user playlists
      const playlistsResponse = await playlistAPI.getAll();
      const userPlaylists = (
        playlistsResponse.data || playlistsResponse
      ).filter((playlist: Playlist) => playlist.member_id === Number(userId));
      setMyPlaylists(userPlaylists.slice(0, 4));

      // Fetch recent history
      const historyResponse = await historyAPI.getAll();
      const userHistory = (historyResponse.data || historyResponse).filter(
        (history: History) => history.member_id === Number(userId)
      );
      setRecentHistory(userHistory.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
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
      {/* Welcome Section */}
      <Card
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          marginBottom: 24,
          borderRadius: 16,
        }}
      >
        <Row align="middle" gutter={24}>
          <Col>
            <Avatar
              size={64}
              icon={<UserOutlined />}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            />
          </Col>
          <Col flex="1">
            <Title level={2} style={{ color: "white", margin: 0 }}>
              ยินดีต้อนรับ, {username}! 🎵
            </Title>
            <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 16 }}>
              เริ่มต้นการเดินทางทางดนตรีของคุณวันนี้
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={() => navigate("/sounds")}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: 8,
              }}
            >
              ฟังเพลง
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Recent Sounds */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <PlayCircleOutlined style={{ color: "#1890ff" }} />
                <span>เพลงล่าสุด</span>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate("/sounds")}>
                ดูทั้งหมด
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
            <List
              dataSource={recentSounds}
              rowKey={(sound) => sound?.ID}
              renderItem={(sound) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      icon={<PlayCircleOutlined />}
                      onClick={async () => {
                        await playSoundWithHistory(sound.ID);
                        navigate("/sounds");
                      }}
                    >
                      เล่น
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<PlayCircleOutlined />}
                        style={{ backgroundColor: "#1890ff" }}
                      />
                    }
                    title={sound.title}
                    description={
                      <div>
                        <Text type="secondary">{sound.artist}</Text>
                        <br />
                        <Tag color="blue">{sound.sound_type?.name}</Tag>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* My Playlists */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <HeartOutlined style={{ color: "#ff6b6b" }} />
                <span>เพลย์ลิสต์ของฉัน</span>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate("/playlists")}>
                จัดการ
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
            {myPlaylists.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <HeartOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
                <br />
                <Text type="secondary">ยังไม่มีเพลย์ลิสต์</Text>
                <br />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/playlists")}
                  style={{ marginTop: 8 }}
                >
                  สร้างเพลย์ลิสต์แรก
                </Button>
              </div>
            ) : (
              <List
                dataSource={myPlaylists}
                rowKey={(playlist) => playlist?.ID}
                renderItem={(playlist) => (
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        icon={<PlayCircleOutlined />}
                        onClick={() => navigate(`/playlists/${playlist.ID}`)}
                      >
                        เล่น
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<HeartOutlined />}
                          style={{ backgroundColor: "#ff6b6b" }}
                        />
                      }
                      title={playlist.title}
                      description={
                        <div>
                          <Text type="secondary">
                            {playlist.sounds?.length || 0} เพลง
                          </Text>
                          <br />
                          <Text type="secondary">
                            เพลย์ลิสต์ของ{" "}
                            {playlist.member?.username || "ผู้ใช้"}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent History */}
      <Card
        title={
          <Space>
            <HistoryOutlined style={{ color: "#52c41a" }} />
            <span>ประวัติการฟังล่าสุด</span>
          </Space>
        }
        extra={
          <Button type="link" onClick={() => navigate("/history")}>
            ดูทั้งหมด
          </Button>
        }
      >
        {recentHistory.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <HistoryOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
            <br />
            <Text type="secondary">ยังไม่มีประวัติการฟัง</Text>
            <br />
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => navigate("/sounds")}
              style={{ marginTop: 8 }}
            >
              เริ่มฟังเพลง
            </Button>
          </div>
        ) : (
          <List
            dataSource={recentHistory}
            rowKey={(history) => history.ID}
            renderItem={(history) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    icon={<PlayCircleOutlined />}
                    onClick={async () => {
                      await playSoundWithHistory(history.sound_id);
                      navigate("/sounds");
                    }}
                  >
                    เล่นอีกครั้ง
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={<HistoryOutlined />}
                      style={{ backgroundColor: "#52c41a" }}
                    />
                  }
                  title={history.sound?.title || "ไม่พบข้อมูลเพลง"}
                  description={
                    <div>
                      <Text type="secondary">
                        ศิลปิน: {history.sound?.artist || "ไม่ทราบ"}
                      </Text>
                      <br />
                      <Text type="secondary">
                        ฟังเมื่อ {formatDate(history.played_at)}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
