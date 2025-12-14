import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Typography,
  Spin,
  Button,
  Progress,
  Tag,
  Space,
} from "antd";
import {
  PlayCircleOutlined,
  UserOutlined,
  HeartOutlined,
  StarOutlined,
  PlusOutlined,
  EditOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Sound, Rating } from "../../../interfaces";
import { soundAPI, ratingAPI } from "../../../services/https";
import { useHistory } from "../../../hooks/useHistory";
import { formatCurrentDateTime } from "../../../utils/dateUtils";

const { Title, Text } = Typography;

const CreatorDashboard: React.FC = () => {
  const [mySounds, setMySounds] = useState<Sound[]>([]);
  const [recentRatings, setRecentRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSounds: 0,
    totalRatings: 0,
    averageRating: 0,
    totalPlays: 0,
  });

  const creatorId = localStorage.getItem("id");
  const username = localStorage.getItem("username") || "Creator";
  const navigate = useNavigate();
  const { playSoundWithHistory } = useHistory();

  useEffect(() => {
    fetchCreatorData();
  }, []);

  const fetchCreatorData = async () => {
    try {
      setLoading(true);

      // Fetch all sounds and filter by creator
      const soundsResponse = await soundAPI.getAll();
      const creatorSounds = (soundsResponse.data || soundsResponse).filter(
        (sound: Sound) => sound.creator_id === Number(creatorId)
      );
      setMySounds(creatorSounds.slice(0, 5));
      setStats((prev) => ({ ...prev, totalSounds: creatorSounds.length }));

      // Calculate total plays (simulated from history)
      const totalPlays = creatorSounds.reduce((acc: number) => {
        // This would come from history data in a real implementation
        return acc + Math.floor(Math.random() * 1000);
      }, 0);
      setStats((prev) => ({ ...prev, totalPlays }));

      // Fetch ratings for creator's sounds
      const ratingsResponse = await ratingAPI.find({ sound_id: undefined });
      const creatorRatings = (ratingsResponse.data || ratingsResponse).filter(
        (rating: Rating) => {
          return creatorSounds.some((sound: Sound) => sound.ID === rating.sound_id);
        }
      );
      setRecentRatings(creatorRatings.slice(0, 5));
      setStats((prev) => ({
        ...prev,
        totalRatings: creatorRatings.length,
        averageRating:
          creatorRatings.length > 0
            ? creatorRatings.reduce(
                (acc: number, rating: Rating) => acc + rating.score,
                0
              ) / creatorRatings.length
            : 0,
      }));
    } catch (error) {
      console.error("Error fetching creator data:", error);
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
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
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
              จัดการและติดตามผลงานเพลงของคุณ
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate("/creator/sounds")}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: 8,
              }}
            >
              เพิ่มเพลงใหม่
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stats-card">
            <Statistic
              title="เพลงทั้งหมด"
              value={stats.totalSounds}
              prefix={<PlayCircleOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stats-card">
            <Statistic
              title="การเล่นทั้งหมด"
              value={stats.totalPlays}
              prefix={<UserOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stats-card">
            <Statistic
              title="คะแนนเฉลี่ย"
              value={stats.averageRating.toFixed(1)}
              prefix={<StarOutlined style={{ color: "#faad14" }} />}
              suffix="/ 5"
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stats-card">
            <Statistic
              title="การให้คะแนน"
              value={stats.totalRatings}
              prefix={<HeartOutlined style={{ color: "#ff6b6b" }} />}
              valueStyle={{ color: "#ff6b6b" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* My Sounds */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <PlayCircleOutlined style={{ color: "#1890ff" }} />
                <span>เพลงของฉัน</span>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate("/creator/sounds")}>
                จัดการทั้งหมด
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
            {mySounds.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <PlayCircleOutlined
                  style={{ fontSize: 48, color: "#d9d9d9" }}
                />
                <br />
                <Text type="secondary">ยังไม่มีเพลง</Text>
                <br />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/creator/sounds")}
                  style={{ marginTop: 8 }}
                >
                  เพิ่มเพลงแรก
                </Button>
              </div>
            ) : (
              <List
                dataSource={mySounds}
                rowKey={(sound) => sound.ID}
                renderItem={(sound) => (
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        icon={<PlayCircleOutlined />}
                        onClick={async () => {
                          await playSoundWithHistory(sound.ID);
                        }}
                      >
                        เล่น
                      </Button>,
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => navigate("/creator/sounds")}
                      >
                        แก้ไข
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
                          <br />
                          <Progress
                            percent={Math.floor(Math.random() * 100)}
                            size="small"
                            showInfo={false}
                            strokeColor="#1890ff"
                          />
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Recent Ratings */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <StarOutlined style={{ color: "#faad14" }} />
                <span>คะแนนล่าสุด</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            {recentRatings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <StarOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
                <br />
                <Text type="secondary">ยังไม่มีคะแนน</Text>
              </div>
            ) : (
              <List
                dataSource={recentRatings}
                rowKey={(rating) => rating.ID}
                renderItem={(rating) => {
                  const sound = mySounds.find((s) => s.ID === rating.sound_id);
                  return (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={<StarOutlined />}
                            style={{ backgroundColor: "#faad14" }}
                          />
                        }
                        title={sound?.title || "ไม่พบข้อมูลเพลง"}
                        description={
                          <div>
                            <Text type="secondary">
                              คะแนน: {rating.score}/5
                            </Text>
                            <br />
                            <Text type="secondary">
                              เมื่อ {formatCurrentDateTime()}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Performance Overview */}
      <Card
        title={
          <Space>
            <RiseOutlined style={{ color: "#52c41a" }} />
            <span>ภาพรวมประสิทธิภาพ</span>
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div style={{ textAlign: "center" }}>
              <Title level={4}>เพลงยอดนิยม</Title>
              <Text>เพลงที่มีการเล่นมากที่สุด</Text>
              <div style={{ marginTop: 16 }}>
                {mySounds.slice(0, 3).map((sound, index) => (
                  <div key={sound.ID} style={{ marginBottom: 8 }}>
                    <Text>
                      {index + 1}. {sound.title}
                    </Text>
                    <Progress
                      percent={Math.floor(Math.random() * 100)}
                      size="small"
                      showInfo={false}
                      strokeColor="#1890ff"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: "center" }}>
              <Title level={4}>คะแนนเฉลี่ย</Title>
              <Text>คะแนนเฉลี่ยของเพลงทั้งหมด</Text>
              <div style={{ marginTop: 16 }}>
                <Progress
                  type="circle"
                  percent={Math.floor((stats.averageRating / 5) * 100)}
                  format={() => `${stats.averageRating.toFixed(1)}/5`}
                  strokeColor="#faad14"
                />
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: "center" }}>
              <Title level={4}>การเติบโต</Title>
              <Text>จำนวนเพลงที่เพิ่มขึ้น</Text>
              <div style={{ marginTop: 16 }}>
                <Progress
                  type="circle"
                  percent={Math.min(stats.totalSounds * 10, 100)}
                  format={() => `${stats.totalSounds} เพลง`}
                  strokeColor="#52c41a"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CreatorDashboard;
