import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  List,
  Typography,
  Spin,
  Rate,
  Button,
  Input,
  Select,
  Modal,
  message,
} from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  HeartOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { Sound, SoundType, Playlist } from "../../interfaces";
import {
  soundAPI,
  soundTypeAPI,
  ratingAPI,
  playlistAPI,
} from "../../services/https";
import { useHistory } from "../../hooks/useHistory";

const { Title, Text } = Typography;
const { Option } = Select;

const SoundsPage: React.FC = () => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [soundTypes, setSoundTypes] = useState<SoundType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(
    null
  );
  const [messageApi, contextHolder] = message.useMessage();
  const searchInputRef = React.useRef<any>(null);
  const navigate = useNavigate();
  const { playSoundWithHistory } = useHistory();

  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchSounds();
    fetchSoundTypes();
    fetchUserPlaylists();
  }, []);

  const fetchSounds = async () => {
    try {
      setLoading(true);
      const response = await soundAPI.getAll();
      setSounds(response.data || response);
    } catch (error) {
      console.error("Error fetching sounds:", error);
      messageApi.error("ไม่สามารถโหลดเพลงได้");
    } finally {
      setLoading(false);
    }
  };

  const fetchSoundTypes = async () => {
    try {
      const response = await soundTypeAPI.getAll();
      setSoundTypes(response.data || response);
    } catch (error) {
      console.error("Error fetching sound types:", error);
    }
  };

  const fetchUserPlaylists = async () => {
    try {
      const response = await playlistAPI.getAll();
      const userPlaylists = (response.data || response).filter(
        (playlist: Playlist) => playlist.member_id === Number(userId)
      );
      setUserPlaylists(userPlaylists);
    } catch (error) {
      console.error("Error fetching user playlists:", error);
    }
  };

  const handlePlay = async (soundId: number) => {
    setCurrentlyPlaying(currentlyPlaying === soundId ? null : soundId);
    
    // บันทึกประวัติการฟัง
    const historyResult = await playSoundWithHistory(soundId);
    
    if (historyResult) {
      messageApi.success("เริ่มเล่นเพลงและบันทึกประวัติการฟังแล้ว");
    } else {
      messageApi.success("เริ่มเล่นเพลง");
    }
  };

  const handleRate = (sound: Sound) => {
    setSelectedSound(sound);
    setRatingModalVisible(true);
  };

  const handleAddToPlaylist = (sound: Sound) => {
    setSelectedSound(sound);
    setPlaylistModalVisible(true);
  };

  const submitAddToPlaylist = async () => {
    if (!selectedSound || !selectedPlaylistId || !userId) return;

    try {
      await playlistAPI.addToPlaylist({
        playlist_id: selectedPlaylistId,
        sound_id: selectedSound.ID,
      });
      messageApi.success("เพิ่มเพลงลงในเพลย์ลิสต์สำเร็จ");
      setPlaylistModalVisible(false);
      setSelectedPlaylistId(null);
      setSelectedSound(null);
    } catch (error) {
      console.error("Error adding sound to playlist:", error);
      messageApi.error("ไม่สามารถเพิ่มเพลงลงในเพลย์ลิสต์ได้");
    }
  };

  const submitRating = async () => {
    if (!selectedSound || !userId || userRating === 0) return;

    try {
      await ratingAPI.create({
        score: userRating,
        sound_id: selectedSound.ID,
        member_id: Number(userId),
      });
      messageApi.success("ให้คะแนนสำเร็จ");
      setRatingModalVisible(false);
      setUserRating(0);
      setSelectedSound(null);
    } catch (error) {
      console.error("Error submitting rating:", error);
      messageApi.error("ไม่สามารถให้คะแนนได้");
    }
  };

  const filteredSounds = sounds.filter((sound) => {
    const matchesSearch =
      sound.title.toLowerCase().includes(searchText.toLowerCase()) ||
      sound.artist.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = selectedType
      ? sound.sound_type_id === selectedType
      : true;
    return matchesSearch && matchesType;
  });

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
      <Title level={2}>เพลงทั้งหมด</Title>

      {/* Search and Filter */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={12}>
            <Input.Search
              ref={searchInputRef}
              placeholder="ค้นหาเพลงหรือศิลปิน..."
              value={searchText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchText(e.target.value)
              }
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="เลือกประเภทเพลง"
              style={{ width: "100%" }}
              value={selectedType}
              onChange={setSelectedType}
              allowClear
            >
              {soundTypes.map((type) => (
                <Option key={type.ID} value={type.ID}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => {
                setSearchText("");
                setSelectedType(null);
              }}
            >
              ล้างตัวกรอง
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Sounds List */}
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
        dataSource={filteredSounds}
        rowKey={(sound) => sound.ID}
        renderItem={(sound) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <div
                  style={{
                    height: 200,
                    background:
                      "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handlePlay(sound.ID)}
                >
                  {currentlyPlaying === sound.ID ? (
                    <PauseCircleOutlined
                      style={{ fontSize: 48, color: "white" }}
                    />
                  ) : (
                    <PlayCircleOutlined
                      style={{ fontSize: 48, color: "white" }}
                    />
                  )}
                </div>
              }
              actions={[
                <Button
                  type="text"
                  icon={<HeartOutlined />}
                  onClick={() => handleRate(sound)}
                >
                  ให้คะแนน
                </Button>,
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={() => handleAddToPlaylist(sound)}
                >
                  เพิ่มเพลย์ลิสต์
                </Button>,
              ]}
            >
              <Card.Meta
                title={sound.title}
                description={
                  <div>
                    <Text type="secondary">{sound.artist}</Text>
                    <br />
                    <Text type="secondary">{sound.sound_type?.name}</Text>
                    <br />
                    <Rate
                      disabled
                      defaultValue={
                        sound.ratings && sound.ratings.length > 0
                          ? sound.ratings.reduce(
                              (acc, rating) => acc + rating.score,
                              0
                            ) / sound.ratings.length
                          : 0
                      }
                    />
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      {/* Rating Modal */}
      <Modal
        title="ให้คะแนนเพลง"
        open={ratingModalVisible}
        onOk={submitRating}
        onCancel={() => {
          setRatingModalVisible(false);
          setUserRating(0);
          setSelectedSound(null);
        }}
        okText="ให้คะแนน"
        cancelText="ยกเลิก"
      >
        {selectedSound && (
          <div>
            <p>
              <strong>เพลง:</strong> {selectedSound.title}
            </p>
            <p>
              <strong>ศิลปิน:</strong> {selectedSound.artist}
            </p>
            <div style={{ marginTop: 16 }}>
              <Text>ให้คะแนน: </Text>
              <Rate value={userRating} onChange={setUserRating} />
            </div>
          </div>
        )}
      </Modal>

      {/* Add to Playlist Modal */}
      <Modal
        title="เพิ่มเพลงลงในเพลย์ลิสต์"
        open={playlistModalVisible}
        onOk={submitAddToPlaylist}
        onCancel={() => {
          setPlaylistModalVisible(false);
          setSelectedPlaylistId(null);
          setSelectedSound(null);
        }}
        okText="เพิ่มเพลง"
        cancelText="ยกเลิก"
        okButtonProps={{ disabled: !selectedPlaylistId }}
      >
        {selectedSound && (
          <div>
            <p>
              <strong>เพลง:</strong> {selectedSound.title}
            </p>
            <p>
              <strong>ศิลปิน:</strong> {selectedSound.artist}
            </p>
            <div style={{ marginTop: 16 }}>
              <Text>เลือกเพลย์ลิสต์: </Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                placeholder="เลือกเพลย์ลิสต์"
                value={selectedPlaylistId}
                onChange={setSelectedPlaylistId}
              >
                {userPlaylists.map((playlist) => (
                  <Option key={playlist.ID} value={playlist.ID}>
                    {playlist.title}
                  </Option>
                ))}
              </Select>
              {userPlaylists.length === 0 && (
                <div style={{ marginTop: 8 }}>
                  <Text
                    type="secondary"
                    style={{ display: "block", marginBottom: 8 }}
                  >
                    คุณยังไม่มีเพลย์ลิสต์ กรุณาสร้างเพลย์ลิสต์ก่อน
                  </Text>
                  <Button
                    type="primary"
                    onClick={() => {
                      setPlaylistModalVisible(false);
                      navigate("/playlists");
                    }}
                  >
                    ไปสร้างเพลย์ลิสต์
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SoundsPage;
