import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  Avatar,
  Typography,
  Spin,
  Button,
  Modal,
  Input,
  Select,
  Form,
  message,
  Popconfirm,
  Tag,
  Space,
} from "antd";
import {
  PlayCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { Sound, SoundType } from "../../../interfaces";
import { soundAPI, soundTypeAPI } from "../../../services/https";
import { useHistory } from "../../../hooks/useHistory";

const { Title, Text } = Typography;
const { Option } = Select;

const CreatorSoundsPage: React.FC = () => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [soundTypes, setSoundTypes] = useState<SoundType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSound, setEditingSound] = useState<Sound | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { playSoundWithHistory } = useHistory();

  const creatorId = localStorage.getItem("id");

  useEffect(() => {
    fetchSounds();
    fetchSoundTypes();
  }, []);

  const fetchSounds = async () => {
    try {
      setLoading(true);
      const response = await soundAPI.getAll();
      const creatorSounds = (response.data || response).filter(
        (sound: Sound) => sound.creator_id === Number(creatorId)
      );
      setSounds(creatorSounds);
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

  const handleCreate = () => {
    setEditingSound(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (sound: Sound) => {
    setEditingSound(sound);
    form.setFieldsValue({
      title: sound.title,
      artist: sound.artist,
      sound_type_id: sound.sound_type_id,
    });
    setModalVisible(true);
  };

  const handleDelete = async (soundId: number) => {
    try {
      await soundAPI.delete(soundId);
      messageApi.success("ลบเพลงสำเร็จ");
      fetchSounds();
    } catch (error) {
      console.error("Error deleting sound:", error);
      messageApi.error("ไม่สามารถลบเพลงได้");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await soundAPI.update({
        ...values,
        ID: editingSound?.ID,
      });

      messageApi.success("แก้ไขเพลงสำเร็จ");
      setModalVisible(false);
      form.resetFields();
      fetchSounds();
    } catch (error) {
      console.error("Error saving sound:", error);
      messageApi.error("ไม่สามารถบันทึกเพลงได้");
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
        <Title level={2}>จัดการเพลง</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          เพิ่มเพลงใหม่
        </Button>
      </div>

      {/* Sounds List */}
      <Card>
        <List
          dataSource={sounds}
          rowKey={(sound) => sound?.ID}
          renderItem={(sound) => (
            <List.Item
              actions={[
                <Button
                  type="text"
                  icon={<PlayCircleOutlined />}
                  onClick={async () => {
                    await playSoundWithHistory(sound.ID);
                    messageApi.success(`กำลังเล่น: ${sound.title}`);
                  }}
                >
                  เล่น
                </Button>,
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(sound)}
                >
                  แก้ไข
                </Button>,
                <Popconfirm
                  title="คุณแน่ใจหรือไม่ที่จะลบเพลงนี้?"
                  onConfirm={() => handleDelete(sound?.ID)}
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
                    icon={<PlayCircleOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                }
                title={
                  <Space>
                    {sound?.title}
                    <Tag color="blue">{sound?.sound_type?.name}</Tag>
                  </Space>
                }
                description={
                  <div>
                    <Text type="secondary">ศิลปิน: {sound?.artist}</Text>
                    <br />
                    <Text type="secondary">
                      เพลงของ {sound?.creator?.username || "ผู้สร้าง"}
                    </Text>
                    <br />
                    <Text type="secondary">
                      คะแนนเฉลี่ย:{" "}
                      {sound?.ratings?.length && sound?.ratings?.length > 0
                        ? (
                            sound?.ratings?.reduce(
                              (acc, rating) => acc + rating.score,
                              0
                            ) / sound?.ratings?.length
                          ).toFixed(1)
                        : "0"}
                      /5
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingSound ? "แก้ไขเพลง" : "เพิ่มเพลงใหม่"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingSound(null);
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="ชื่อเพลง"
            rules={[{ required: true, message: "กรุณาใส่ชื่อเพลง" }]}
          >
            <Input placeholder="ใส่ชื่อเพลง" />
          </Form.Item>

          <Form.Item
            name="artist"
            label="ศิลปิน"
            rules={[{ required: true, message: "กรุณาใส่ชื่อศิลปิน" }]}
          >
            <Input placeholder="ใส่ชื่อศิลปิน" />
          </Form.Item>

          <Form.Item
            name="sound_type_id"
            label="ประเภทเพลง"
            rules={[{ required: true, message: "กรุณาเลือกประเภทเพลง" }]}
          >
            <Select placeholder="เลือกประเภทเพลง">
              {soundTypes?.map((type) => (
                <Option key={type.ID} value={type.ID}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingSound ? "บันทึก" : "สร้าง"}
              </Button>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                  setEditingSound(null);
                }}
              >
                ยกเลิก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreatorSoundsPage;
