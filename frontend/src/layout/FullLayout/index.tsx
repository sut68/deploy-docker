import React, { useState, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../../App.css";
import {
  UserOutlined,
  DashboardOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  HistoryOutlined,
  EditOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  theme,
  Button,
  message,
  Typography,
  Avatar,
  Space,
} from "antd";
import type { MenuProps } from "antd";
import logo from "../../assets/logo.png";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const FullLayout: React.FC = () => {
  const page = localStorage.getItem("page");
  const [messageApi, contextHolder] = message.useMessage();

  const [collapsed, setCollapsed] = useState(false);
  const siderRef = React.useRef<any>(null);

  // Theme tokens (kept for future use) — removed unused binding to satisfy linter
  theme.useToken();

  const setCurrentPage = (val: string) => {
    localStorage.setItem("page", val);
  };

  const Logout = () => {
    localStorage.clear();
    messageApi.success("ออกจากระบบสำเร็จ");
    setTimeout(() => {
      location.href = "/";
    }, 2000);
  };

  const userRole = localStorage.getItem("role") || "member";
  const username = localStorage.getItem("username") || "User";
  const isCreator = userRole === "creator";
  const navigate = useNavigate();

  // Create menu items based on user role
  const menuItems: MenuProps["items"] = useMemo(() => {
    const items: MenuProps["items"] = [
      {
        key: "dashboard",
        icon: <DashboardOutlined style={{ fontSize: "18px" }} />,
        label: "แดชบอร์ด",
        onClick: () => {
          setCurrentPage("dashboard");
          navigate("/");
        },
      },
    ];

    if (!isCreator) {
      // Member menu items
      items.push(
        {
          key: "sounds",
          icon: <PlayCircleOutlined style={{ fontSize: "18px" }} />,
          label: "เพลงทั้งหมด",
          onClick: () => {
            setCurrentPage("sounds");
            navigate("/sounds");
          },
        },
        {
          key: "playlists",
          icon: <HeartOutlined style={{ fontSize: "18px" }} />,
          label: "เพลย์ลิสต์",
          onClick: () => {
            setCurrentPage("playlists");
            navigate("/playlists");
          },
        },
        {
          key: "history",
          icon: <HistoryOutlined style={{ fontSize: "18px" }} />,
          label: "ประวัติการฟัง",
          onClick: () => {
            setCurrentPage("history");
            navigate("/history");
          },
        }
      );
    } else {
      // Creator menu items
      items.push({
        key: "creator-sounds",
        icon: <EditOutlined style={{ fontSize: "18px" }} />,
        label: "จัดการเพลง",
        onClick: () => {
          setCurrentPage("creator-sounds");
          navigate("/creator/sounds");
        },
      });
    }

    return items;
  }, [isCreator, navigate]);

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {contextHolder}
      <Sider
        ref={siderRef}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          height: "100vh",
          overflow: "hidden",
        }}
        trigger={
          <div
            style={{
              textAlign: "center",
              padding: "8px",
              color: "white",
              fontSize: "16px",
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        }
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "16px 0",
          }}
        >
          <div>
            {/* Logo Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "32px",
                padding: "0 16px",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: collapsed ? "60%" : "70%",
                  marginBottom: "16px",
                  filter: "brightness(0) invert(1)",
                }}
              />
              {!collapsed && (
                <Title
                  level={4}
                  style={{
                    margin: 0,
                    color: "white",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  Music System
                </Title>
              )}
            </div>

            {/* User Info Section */}
            {!collapsed && (
              <div
                style={{
                  padding: "16px",
                  margin: "0 8px 24px 8px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Avatar
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                    }}
                  />
                  <div>
                    <Text
                      style={{
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {username}
                    </Text>
                    <br />
                    <Text
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "12px",
                      }}
                    >
                      {isCreator ? "ผู้สร้าง" : "สมาชิก"}
                    </Text>
                  </div>
                </Space>
              </div>
            )}

            {/* Menu */}
            <Menu
              theme="dark"
              defaultSelectedKeys={[page ? page : "dashboard"]}
              mode="inline"
              items={menuItems}
              style={{
                background: "transparent",
                border: "none",
              }}
              className="modern-sidebar-menu"
            />
          </div>

          {/* Logout Button */}
          <div style={{ padding: "0 16px" }}>
            <Button
              onClick={Logout}
              icon={<LogoutOutlined />}
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
                borderRadius: "8px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="logout-button"
            >
              {!collapsed && "ออกจากระบบ"}
            </Button>
          </div>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
            {page === "dashboard" && "แดชบอร์ด"}
            {page === "sounds" && "เพลงทั้งหมด"}
            {page === "playlists" && "เพลย์ลิสต์"}
            {page === "history" && "ประวัติการฟัง"}

            {page === "creator-sounds" && "จัดการเพลง"}
          </Title>
          <Space>
            <Text type="secondary">ยินดีต้อนรับ, {username}</Text>
          </Space>
        </Header>
        <Content
          style={{ margin: "16px", background: "#f5f5f5", overflow: "auto" }}
        >
          <div
            style={{
              padding: 24,
              minHeight: "calc(100vh - 200px)",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: "white",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Text type="secondary">System Analysis and Design 1/68</Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default FullLayout;
