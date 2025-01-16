import React, { useState } from "react";
import { Layout, Menu, Typography, Button, Drawer, theme } from "antd";
import {
  InboxOutlined,
  MenuOutlined,
  LogoutOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateActiveTab } from "../../../features/menu/menuSlice";
import { logout } from "../../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const { Sider } = Layout;
const { Text } = Typography;
const { useToken } = theme;

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeTab } = useSelector((state) => state.menu);
  const { token } = useToken();

  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Enhanced menu items with more options and better organization
  const menuItems = [
    // {
    //   key: "dashboard",
    //   icon: <DashboardOutlined />,
    //   label: "Dashboard",
    //   position: "up",
    // },
    {
      key: "inbox",
      icon: <InboxOutlined />,
      label: "Inbox",
      position: "up",
      // Example badge count
    },
    // {
    //   key: "notifications",
    //   icon: <BellOutlined />,
    //   label: "Notifications",
    //   position: "up",
    //   badge: 3,
    // },
    // {
    //   key: "profile",
    //   icon: <UserOutlined />,
    //   label: "Profile",
    //   position: "up",
    // },
    // {
    //   key: "settings",
    //   icon: <SettingOutlined />,
    //   label: "Settings",
    //   position: "down",
    // },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ color: token.colorError }} />,
      label: "Logout",
      position: "down",
      danger: true,
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key !== "logout") {
      dispatch(updateActiveTab(e.key));
    } else {
      dispatch(logout());
      navigate("/login");
    }
  };

  const toggleCollapsed = () => setCollapsed((prev) => !prev);
  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  // Enhanced menu component with badges and hover effects
  const renderMenu = (items, onClickHandler) => (
    <Menu
      mode="inline"
      selectedKeys={[activeTab]}
      onClick={onClickHandler}
      items={items.map((item) => ({
        ...item,
        className: `menu-item ${item.danger ? "menu-item-danger" : ""}`,
        label: (
          <div className="menu-item-content">
            <span>{item.label}</span>
            {item.badge && (
              <span
                className="menu-item-badge"
                style={{
                  backgroundColor: token.colorPrimary,
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              >
                {item.badge}
              </span>
            )}
          </div>
        ),
      }))}
      style={{
        border: "none",
      }}
    />
  );

  return (
    <>
      {/* Enhanced Mobile Menu Button */}
      {collapsed && (
        <Button
          icon={<MenuOutlined />}
          className="mobile-menu-button"
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1000,
            width: 40,
            height: 40,
            backgroundColor: token.colorBgContainer,
            borderRadius: "50%",
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: token.boxShadowSecondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={openDrawer}
        />
      )}

      {/* Enhanced Mobile Drawer */}
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 0",
            }}
          >
            <img
              src="/logo.jpeg"
              alt="Zanta Health Logo"
              style={{
                width: 32,
                height: 32,
                borderRadius: "8px",
              }}
            />
            <Text strong style={{ fontSize: 18, color: token.colorPrimary }}>
              Zanta Health
            </Text>
          </div>
        }
        placement="left"
        onClose={closeDrawer}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
        width={280}
        styles={{
          header: {
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            padding: "16px 24px",
          },
          body: {
            backgroundColor: token.colorBgContainer,
          },
        }}
      >
        {renderMenu(menuItems, (e) => {
          handleMenuClick(e);
          closeDrawer();
        })}
      </Drawer>

      {/* Enhanced Desktop Sidebar */}
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        breakpoint="lg"
        style={{
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0,
          backgroundColor: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          transition: "all 0.2s ease-in-out",
        }}
        className="sidebar"
      >
        {/* Enhanced Header Section */}
        <div
          style={{
            padding: "24px 16px",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: "12px",
            transition: "all 0.2s ease-in-out",
            backgroundColor: token.colorBgContainer,
          }}
        >
          <img
            src="/logo.jpeg"
            alt="Zanta Health Logo"
            style={{
              width: collapsed ? 32 : 40,
              height: collapsed ? 32 : 40,
              borderRadius: "8px",
              transition: "all 0.2s ease-in-out",
            }}
          />
          {!collapsed && (
            <Text
              strong
              style={{
                fontSize: 18,
                color: token.colorPrimary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Zanta Health
            </Text>
          )}
        </div>

        {/* Main Menu Section */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {renderMenu(
              menuItems.filter((item) => item.position === "up"),
              handleMenuClick
            )}
          </div>

          {/* Footer Menu Section */}
          <div
            style={{
              borderTop: `1px solid ${token.colorBorderSecondary}`,
              backgroundColor: token.colorBgLayout,
            }}
          >
            {renderMenu(
              menuItems.filter((item) => item.position === "down"),
              handleMenuClick
            )}
          </div>
        </div>
      </Sider>
    </>
  );
};

export default Sidebar;
