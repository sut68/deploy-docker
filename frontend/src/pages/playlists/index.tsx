import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  List,
  Avatar,
  Typography,
  Spin,
  Button,
  Modal,
  Input,
  message,
  Popconfirm,
} from "antd";
import {
  HeartOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import type { Playlist, Sound } from "../../interfaces";
import { playlistAPI, soundAPI } from "../../services/https";

const { Title, Text } = Typography;

const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [editPlaylistTitle, setEditPlaylistTitle] = useState("");
  const [newPlaylistSelectedSoundIds, setNewPlaylistSelectedSoundIds] =
    useState<number[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const createPlaylistInputRef = React.useRef<any>(null);
  const editPlaylistInputRef = React.useRef<any>(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchPlaylists();
    fetchSounds();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await playlistAPI.getAll();
      const userPlaylists = (response.data || response).filter(
        (playlist: Playlist) => playlist.member_id === Number(userId)
      );
      setPlaylists(userPlaylists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      messageApi.error("ไม่สามารถโหลดเพลย์ลิสต์ได้");
    } finally {
      setLoading(false);
    }
  };

  const fetchSounds = async () => {
    try {
      const response = await soundAPI.getAll();
      setSounds(response.data || response);
    } catch (error) {
      console.error("Error fetching sounds:", error);
    }
  };

  const handleCreatePlaylist = async () => {
    if (
      !newPlaylistTitle.trim() ||
      !userId ||
      newPlaylistSelectedSoundIds.length === 0
    ) {
      messageApi.error("กรุณาใส่ชื่อเพลย์ลิสต์และเลือกเพลงอย่างน้อย 1 เพลง");
      return;
    }

    try {
      // สร้างเพลย์ลิสต์ใหม่
      const playlistResponse = await playlistAPI.create({
        title: newPlaylistTitle,
        member_id: Number(userId),
        sounds: newPlaylistSelectedSoundIds.map((soundId: number) => ({
          ID: soundId,
        })),
      });

      if (playlistResponse.status == 201) {
        messageApi.success("สร้างเพลย์ลิสต์สำเร็จ");
        setCreateModalVisible(false);
        setNewPlaylistTitle("");
        setNewPlaylistSelectedSoundIds([]);
        setTimeout(() => {
          fetchPlaylists();
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      messageApi.error("ไม่สามารถสร้างเพลย์ลิสต์ได้");
    }
  };

  const handleEditPlaylist = async () => {
    if (!selectedPlaylist || !editPlaylistTitle.trim()) return;

    try {
      // Update playlist title
      await playlistAPI.update({
        ID: selectedPlaylist.ID,
        title: editPlaylistTitle,
      });

      messageApi.success("แก้ไขเพลย์ลิสต์สำเร็จ");
      setEditModalVisible(false);
      setEditPlaylistTitle("");
      setSelectedPlaylist(null);
      fetchPlaylists();
    } catch (error) {
      console.error("Error updating playlist:", error);
      messageApi.error("ไม่สามารถแก้ไขเพลย์ลิสต์ได้");
    }
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    try {
      await playlistAPI.delete(playlistId);

        messageApi.success("ลบเพลย์ลิสต์สำเร็จ");
        setTimeout(() => {
          fetchPlaylists();
        }, 1500);
    } catch (error) {
      console.error("Error deleting playlist:", error);
      messageApi.error("ไม่สามารถลบเพลย์ลิสต์ได้");
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={2}>เพลย์ลิสต์ของฉัน</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          สร้างเพลย์ลิสต์ใหม่
        </Button>
      </div>

      {/* Playlists Grid */}
      <Row gutter={[16, 16]}>
        {playlists.map((playlist) => (
          <Col xs={24} sm={12} md={8} lg={6} key={playlist.ID}>
            <Card
              hoverable
              cover={
                <div
                  style={{
                    height: 200,
                    background:
                      "linear-gradient(45deg, #ff6b6b 0%, #ee5a24 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/playlists/${playlist.ID}`)}
                >
                  <HeartOutlined style={{ fontSize: 48, color: "white" }} />
                </div>
              }
              actions={[
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedPlaylist(playlist);
                    setEditPlaylistTitle(playlist.title);
                    setEditModalVisible(true);
                  }}
                >
                  แก้ไข
                </Button>,
                <Popconfirm
                  title="คุณแน่ใจหรือไม่ที่จะลบเพลย์ลิสต์นี้?"
                  onConfirm={() => handleDeletePlaylist(playlist.ID)}
                  okText="ใช่"
                  cancelText="ไม่"
                >
                  <Button type="text" danger icon={<DeleteOutlined />}>
                    ลบ
                  </Button>
                </Popconfirm>,
              ]}
            >
              <Card.Meta
                title={playlist.title}
                description={
                  <div>
                    <Text type="secondary">
                      {playlist.sounds?.length || 0} เพลง
                    </Text>
                    <br />
                    <Text type="secondary">
                      เพลย์ลิสต์ของ {playlist.member?.username || 'ผู้ใช้'}
                    </Text>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create Playlist Modal */}
      <Modal
        title="สร้างเพลย์ลิสต์ใหม่"
        open={createModalVisible}
        onOk={handleCreatePlaylist}
        onCancel={() => {
          setCreateModalVisible(false);
          setNewPlaylistTitle("");
          setNewPlaylistSelectedSoundIds([]);
        }}
        okText="สร้าง"
        cancelText="ยกเลิก"
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>ชื่อเพลย์ลิสต์:</Text>
          <Input
            ref={createPlaylistInputRef}
            value={newPlaylistTitle}
            onChange={(e) => setNewPlaylistTitle(e.target.value)}
            placeholder="ใส่ชื่อเพลย์ลิสต์"
            style={{ marginTop: 8 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>เลือกเพลง (อย่างน้อย 1 เพลง):</Text>
          <div style={{ marginTop: 8, maxHeight: 300, overflowY: "auto" }}>
            <List
              size="small"
              dataSource={sounds}
              rowKey={(sound) => sound.ID}
              renderItem={(sound) => {
                const isSelected = newPlaylistSelectedSoundIds.includes(
                  sound.ID
                );

                return (
                  <List.Item
                    style={{
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#f0f8ff" : "white",
                      border: isSelected
                        ? "1px solid #1890ff"
                        : "1px solid #f0f0f0",
                      borderRadius: "4px",
                      marginBottom: "4px",
                    }}
                    onClick={() => {
                      if (isSelected) {
                        setNewPlaylistSelectedSoundIds(
                          newPlaylistSelectedSoundIds.filter(
                            (ID) => ID !== sound.ID
                          )
                        );
                      } else {
                        setNewPlaylistSelectedSoundIds([
                          ...newPlaylistSelectedSoundIds,
                          sound.ID,
                        ]);
                      }
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<PlayCircleOutlined />} />}
                      title={sound.title}
                      description={sound.artist}
                    />
                    {isSelected && (
                      <div
                        style={{
                          color: "#1890ff",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </List.Item>
                );
              }}
            />
          </div>
        </div>
      </Modal>

      {/* Edit Playlist Modal */}
      <Modal
        title="แก้ไขเพลย์ลิสต์"
        open={editModalVisible}
        onOk={handleEditPlaylist}
        onCancel={() => {
          setEditModalVisible(false);
          setEditPlaylistTitle("");
          setSelectedPlaylist(null);
        }}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>ชื่อเพลย์ลิสต์:</Text>
          <Input
            ref={editPlaylistInputRef}
            value={editPlaylistTitle}
            onChange={(e) => setEditPlaylistTitle(e.target.value)}
            placeholder="ใส่ชื่อเพลย์ลิสต์"
            style={{ marginTop: 8 }}
          />
        </div>

        {selectedPlaylist && (
          <div>
            <Text strong>เพลงในเพลย์ลิสต์:</Text>
            <List
              size="small"
              dataSource={selectedPlaylist.sounds || []}
              rowKey={(sound) => sound.ID}
              renderItem={(sound) => {
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<PlayCircleOutlined />} />}
                      title={sound.title}
                      description={sound.artist}
                    />
                  </List.Item>
                );
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PlaylistsPage;
