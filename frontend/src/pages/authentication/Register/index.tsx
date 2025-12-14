import {
  Button,
  Card,
  Form,
  Input,
  message,
  Flex,
  Row,
  Col,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../../services/https";
import type {
  CreateMemberRequest,
  CreateCreatorRequest,
} from "../../../interfaces";
import logo from "../../../assets/logo.png";
import { useState } from "react";

const { Title, Text } = Typography;

type UserRole = "member" | "creator" | null;

function RegisterPage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const onFinishCreator = async (values: CreateCreatorRequest) => {
    try {
      const res = await authAPI.creatorSignup(values);

      if (res.status === 201 || res.status === 200) {
        messageApi.success("Registration successful!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        messageApi.error(
          res.data?.error || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      messageApi.error("Registration failed. Please try again.");
    }
  };

  const onFinishMember = async (values: CreateMemberRequest) => {
    try {
      const res = await authAPI.memberSignup(values);

      if (res.status === 201 || res.status === 200) {
        messageApi.success("Registration successful!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        messageApi.error(
          res.data?.error || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      messageApi.error("Registration failed. Please try again.");
    }
  };

  const RoleSelectionCard = () => (
    <Card
      className="card-register"
      style={{
        width: 600,
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      }}
    >
      <Row align={"middle"} justify={"center"} style={{ padding: "20px 0" }}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
          style={{ textAlign: "center", marginBottom: 30 }}
        >
          <img
            alt="logo"
            style={{ width: "60%", marginBottom: 16 }}
            src={logo}
            className="images-logo"
          />
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            Join Music System
          </Title>
          <Text type="secondary">
            Choose your role to start your musical journey
          </Text>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12}>
              <Card
                hoverable
                onClick={() => setSelectedRole("member")}
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                  border:
                    selectedRole === "member"
                      ? "2px solid #1890ff"
                      : "1px solid #d9d9d9",
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
                <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                  Member
                </Title>
                <Text type="secondary">
                  Listen to music, create playlists, and enjoy your favorite
                  tracks
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12}>
              <Card
                hoverable
                onClick={() => setSelectedRole("creator")}
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                  border:
                    selectedRole === "creator"
                      ? "2px solid #1890ff"
                      : "1px solid #d9d9d9",
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
                <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                  Creator
                </Title>
                <Text type="secondary">
                  Upload your music, manage your content, and share your
                  creativity
                </Text>
              </Card>
            </Col>
          </Row>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Text type="secondary">Already have an account? </Text>
            <a onClick={() => navigate("/login")} style={{ color: "#1890ff" }}>
              Sign in here
            </a>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const CreatorRegistrationForm = () => (
    <Card
      className="card-register"
      style={{
        width: 500,
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      }}
    >
      <Row align={"middle"} justify={"center"} style={{ padding: "20px 0" }}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <img
            alt="logo"
            style={{ width: "60%", marginBottom: 16 }}
            src={logo}
            className="images-logo"
          />
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            Creator Registration
          </Title>
          <Text type="secondary">
            Create your creator account to share your music
          </Text>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Form
            name="creator-register"
            onFinish={onFinishCreator}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                {
                  min: 3,
                  message: "Username must be at least 3 characters!",
                },
                {
                  max: 20,
                  message: "Username must be less than 20 characters!",
                },
              ]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters!",
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
                style={{
                  width: "100%",
                  height: 48,
                  fontSize: 16,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
              >
                Create Creator Account
              </Button>
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Button
                  type="link"
                  onClick={() => setSelectedRole(null)}
                  style={{ color: "#1890ff" }}
                >
                  ← Back to role selection
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );

  const MemberRegistrationForm = () => (
    <Card
      className="card-register"
      style={{
        width: 500,
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      }}
    >
      <Row align={"middle"} justify={"center"} style={{ padding: "20px 0" }}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <img
            alt="logo"
            style={{ width: "60%", marginBottom: 16 }}
            src={logo}
            className="images-logo"
          />
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            Member Registration
          </Title>
          <Text type="secondary">
            Create your member account to enjoy music
          </Text>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Form
            name="member-register"
            onFinish={onFinishMember}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                {
                  min: 3,
                  message: "Username must be at least 3 characters!",
                },
                {
                  max: 20,
                  message: "Username must be less than 20 characters!",
                },
              ]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters!",
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
                style={{
                  width: "100%",
                  height: 48,
                  fontSize: 16,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
              >
                Create Member Account
              </Button>
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Button
                  type="link"
                  onClick={() => setSelectedRole(null)}
                  style={{ color: "#1890ff" }}
                >
                  ← Back to role selection
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );

  return (
    <>
      {contextHolder}
      <Flex
        justify="center"
        align="center"
        className="register"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {selectedRole === null && <RoleSelectionCard />}
        {selectedRole === "creator" && <CreatorRegistrationForm />}
        {selectedRole === "member" && <MemberRegistrationForm />}
      </Flex>
    </>
  );
}

export default RegisterPage;
