import React, { useEffect, useState } from "react";
import { Card, List, Avatar, Typography, Spin, Button, message } from "antd";
import {
  PlayCircleOutlined,
  ArrowLeftOutlined,
  HeartOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import type { Playlist, Sound } from "../../interfaces";
import { playlistAPI } from "../../services/https";
import { useHistory } from "../../hooks/useHistory";

const { Title, Text } = Typography;

const PlaylistDetail: React.FC = () => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { playSoundWithHistory } = useHistory();

  useEffect(() => {
    if (id) {
      fetchPlaylistDetail();
    }
  }, [id]);

  const fetchPlaylistDetail = async () => {
    try {
      setLoading(true);
      const response = await playlistAPI.getById(Number(id));
      setPlaylist(response.data || response);
    } catch (error) {
      console.error("Error fetching playlist detail:", error);
      messageApi.error("ไม่สามารถโหลดรายละเอียดเพลย์ลิสต์ได้");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySound = async (sound: Sound) => {
    // บันทึกประวัติการฟัง
    const historyResult = await playSoundWithHistory(sound.ID);

    if (historyResult) {
      messageApi.success(
        `กำลังเล่น: ${sound.title} - ${sound.artist} และบันทึกประวัติการฟังแล้ว`
      );
    } else {
      messageApi.success(`กำลังเล่น: ${sound.title} - ${sound.artist}`);
    }
  };

  const handleRemoveSound = async (sound: Sound) => {
    if (!playlist) {
      messageApi.error("ไม่พบข้อมูลเพลย์ลิสต์");
      return;
    }

    try {
      // Find the sound_playlist record to get the ID for removal
      const soundPlaylist = playlist?.sound_playlists?.find(
        (sp) => sp?.sound?.ID === sound.ID
      );

      if (!soundPlaylist) {
        messageApi.error("ไม่พบข้อมูลเพลงในเพลย์ลิสต์");
        return;
      }

      await playlistAPI.removeFromPlaylist(soundPlaylist.ID);
      messageApi.success(`ลบเพลง "${sound.title}" ออกจากเพลย์ลิสต์แล้ว`);

      setTimeout(() => {
        fetchPlaylistDetail();
      }, 1500);

      // Refresh playlist data
    } catch (error) {
      console.error("Error removing sound from playlist:", error);
      messageApi.error("ไม่สามารถลบเพลงออกจากเพลย์ลิสต์ได้");
    }
  };

  const handleBack = () => {
    navigate("/playlists");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Text>ไม่พบเพลย์ลิสต์</Text>
      </div>
    );
  }

  return (
    <div>
      {contextHolder}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ marginBottom: 16 }}
        >
          กลับไปยังเพลย์ลิสต์
        </Button>

        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 80,
                height: 80,
                background: "linear-gradient(45deg, #ff6b6b 0%, #ee5a24 100%)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HeartOutlined style={{ fontSize: 32, color: "white" }} />
            </div>

            <div style={{ flex: 1 }}>
              <Title level={2} style={{ margin: 0 }}>
                {playlist.title}
              </Title>
              <Text type="secondary">{playlist.sounds?.length || 0} เพลง</Text>
              <br />
              <Text type="secondary">
                เพลย์ลิสต์ของ {playlist?.member?.username || 'ผู้ใช้'}
              </Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Songs List */}
      <Card title="รายการเพลง">
        {playlist.sound_playlists && playlist.sound_playlists.length > 0 ? (
          <List
            dataSource={playlist.sound_playlists}
            rowKey={(sound) => sound.ID}
            renderItem={(sound, index) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => sound?.sound && handlePlaySound(sound.sound)}
                    disabled={!sound?.sound}
                  >
                    เล่น
                  </Button>,
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => sound?.sound && handleRemoveSound(sound.sound)}
                    disabled={!sound?.sound}
                  >
                    ลบ
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: "#1890ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {index + 1}
                    </Avatar>
                  }
                  title={
                    <div>
                      <Text strong>{sound?.sound?.title}</Text>
                    </div>
                  }
                  description={
                    <div>
                      <Text type="secondary">{sound?.sound?.artist}</Text>
                      {sound?.sound?.sound_type && (
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            ประเภท: {sound?.sound?.sound_type?.name}
                          </Text>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary">ยังไม่มีเพลงในเพลย์ลิสต์นี้</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PlaylistDetail;
