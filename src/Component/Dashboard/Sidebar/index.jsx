import React, { useState } from "react";
import { Layout, Menu, Typography, Button, Drawer } from "antd";
import {
  InboxOutlined,
  MenuOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateActiveTab } from "../../../features/menu/menuSlice";
import { logout } from "../../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeTab } = useSelector((state) => state.menu);

  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Menu items for the sidebar and drawer
  const menuItems = [
    { key: "inbox", icon: <InboxOutlined />, label: "Inbox", position: "up" },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ color: "#ff4d4f" }} />,
      label: "Logout",
      position: "down",
    },
  ];

  // Handle menu item click
  const handleMenuClick = (e) => {
    if (e.key !== "logout") {
      dispatch(updateActiveTab(e.key));
    } else {
      dispatch(logout());
      navigate("/login");
    }
  };

  // Toggle sidebar collapse
  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  // Open and close drawer
  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  // Render menu component
  const renderMenu = (items, onClickHandler) => (
    <Menu
      mode="inline"
      selectedKeys={[activeTab]}
      onClick={onClickHandler}
      items={items}
      style={{
        borderRight: "1px solid #e8e8e8", // subtle border between items
      }}
    />
  );

  return (
    <>
      {/* Mobile Drawer */}
      {collapsed && (
        <>
          <Button
            icon={<MenuOutlined />}
            style={{
              position: "fixed",
              top: 16,
              left: 25,
              zIndex: 1000,
              backgroundColor: "#fff",
              borderRadius: "50%",
              border: "none",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              transition: "all 0.3s ease",
            }}
            onClick={openDrawer}
          />
          <Drawer
            title="Menu"
            placement="left"
            onClose={closeDrawer}
            visible={drawerVisible}
            bodyStyle={{ padding: 0 }}
            closable={false}
            width={250}
            style={{
              backgroundColor: "#1f1f1f",
              color: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            {renderMenu(menuItems, (e) => {
              handleMenuClick(e);
              closeDrawer();
            })}
          </Drawer>
        </>
      )}

      {/* Desktop Sidebar */}
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        breakpoint="md" // Breakpoint for responsiveness
        style={{
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #f0f0f0",
          height: "100vh",
          backgroundColor: "#ffffff",
          transition: "width 0.3s ease", // smooth transition on collapse
          boxShadow: "2px 0px 15px rgba(0, 0, 0, 0.1)", // Adding shadow for depth
        }}
      >
        {/* Header Section */}
        <div
          style={{
            padding: "20px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: collapsed ? "center" : "flex-start",
            transition: "all 0.3s ease", // smooth transition for collapse
            color: "#1890ff",
          }}
        >
          <div style={{ width: 24, height: 24 }} />
          {!collapsed && (
            <Text
              strong
              style={{
                fontSize: 20,
                color: "#1890ff", // Brand color for the header
                transition: "font-size 0.3s ease",
              }}
            >
              Zanta Health
            </Text>
          )}
        </div>

        {/* Main Menu */}
        <div style={{ flex: 1, height: "88%" }}>
          {renderMenu(
            menuItems.filter((item) => item.position === "up"),
            handleMenuClick
          )}
        </div>

        {/* Settings and Logout Menu */}
        <div
          style={{
            borderTop: "1px solid #f0f0f0",

            backgroundColor: "#fafafa",
          }}
        >
          {renderMenu(
            menuItems.filter((item) => item.position === "down"),
            handleMenuClick
          )}
        </div>
      </Sider>
    </>
  );
};

export default Sidebar;
