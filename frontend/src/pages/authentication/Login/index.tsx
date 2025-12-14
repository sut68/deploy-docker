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
  LoginMemberRequest,
  LoginCreatorRequest,
} from "../../../interfaces";
import logo from "../../../assets/logo.png";
import { useState } from "react";

const { Title, Text } = Typography;

type UserRole = "member" | "creator" | null;

function SignInPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const onFinishMember = async (values: LoginMemberRequest) => {
    try {
      const res = await authAPI.memberLogin(values);

      if (res.status === 200) {
        messageApi.success("Welcome back to Music System!");
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("id", res.data.data.id);
        localStorage.setItem(
          "username",
          res.data.data.username || values.username
        );
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("role", "member");
        setTimeout(() => {
          location.href = "/";
        }, 2000);
      } else {
        messageApi.error(res.data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      messageApi.error("Login failed. Please try again.");
    }
  };

  const onFinishCreator = async (values: LoginCreatorRequest) => {
    try {
      const res = await authAPI.creatorLogin(values);

      if (res.status === 200) {
        messageApi.success("Welcome back to Music System!");
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("id", res.data.data.id);
        localStorage.setItem(
          "username",
          res.data.data.username || values.username
        );
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("role", "creator");
        setTimeout(() => {
          location.href = "/";
        }, 2000);
      } else {
        messageApi.error(res.data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      messageApi.error("Login failed. Please try again.");
    }
  };

  const RoleSelectionCard = () => (
    <Card
      className="card-login"
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
            Welcome to Music System
          </Title>
          <Text type="secondary">
            Choose your role to sign in to your account
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
                  Sign in to access your playlists and music library
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
                  Sign in to manage your music content and uploads
                </Text>
              </Card>
            </Col>
          </Row>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Text type="secondary">Don't have an account? </Text>
            <a onClick={() => navigate("/signup")} style={{ color: "#1890ff" }}>
              Sign up now!
            </a>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const CreatorLoginForm = () => (
    <Card
      className="card-login"
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
            Creator Sign In
          </Title>
          <Text type="secondary">Sign in to your creator account</Text>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Form
            name="creator-login"
            onFinish={onFinishCreator}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              label="Username or Email"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username or email!",
                },
              ]}
            >
              <Input placeholder="Enter your username or email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{
                  width: "100%",
                  height: 48,
                  fontSize: 16,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  marginBottom: 20,
                }}
              >
                Sign In as Creator
              </Button>
              <div style={{ textAlign: "center" }}>
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

  const MemberLoginForm = () => (
    <Card
      className="card-login"
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
            Member Sign In
          </Title>
          <Text type="secondary">Sign in to your member account</Text>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Form
            name="member-login"
            onFinish={onFinishMember}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              label="Username or Email"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username or email!",
                },
              ]}
            >
              <Input placeholder="Enter your username or email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{
                  width: "100%",
                  height: 48,
                  fontSize: 16,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  marginBottom: 20,
                }}
              >
                Sign In as Member
              </Button>
              <div style={{ textAlign: "center" }}>
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
        className="login"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {selectedRole === null && <RoleSelectionCard />}
        {selectedRole === "creator" && <CreatorLoginForm />}
        {selectedRole === "member" && <MemberLoginForm />}
      </Flex>
    </>
  );
}

export default SignInPages;
