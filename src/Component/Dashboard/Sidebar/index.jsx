import React, { useState } from "react";
import { Layout, Menu, Typography, Button, Drawer } from "antd";
import {
  InboxOutlined,
  CalendarOutlined,
  SettingOutlined,
  MenuOutlined,
  LogoutOutlined,
  DollarOutlined,
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

    // {
    //   key: "calendar",
    //   icon: <CalendarOutlined />,
    //   label: "Calendar",
    //   position: "up",
    // },
    // {
    //   key: "pricingDetails",
    //   icon: <DollarOutlined />,
    //   label: "Pricing Details",
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
      icon: <LogoutOutlined style={{ color: "red" }} />,
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
    />
  );

  return (
    <>
      {collapsed && (
        <>
          <Button
            icon={<MenuOutlined />}
            style={{
              position: "fixed",
              top: 16,
              left: 25,
              zIndex: 1000,
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
          }}
        >
          <div style={{ width: 24, height: 24 }} />
          {!collapsed && <Text strong>well received</Text>}
        </div>

        {/* Main Menu */}
        <div style={{ flex: 1, height: "85%" }}>
          {renderMenu(
            menuItems.filter((item) => item.position === "up"),
            handleMenuClick
          )}{" "}
          {/* Show main menu items */}
        </div>

        {/* Settings and Logout Menu */}
        <div>
          {renderMenu(
            menuItems.filter((item) => item.position === "down"),
            handleMenuClick
          )}{" "}
          {/* Show settings and logout */}
        </div>
      </Sider>
    </>
  );
};

export default Sidebar;
