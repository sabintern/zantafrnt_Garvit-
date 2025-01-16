import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  List,
  Avatar,
  Typography,
  Drawer,
  Menu,
  Button,
  Badge
} from "antd";
import {
  SearchOutlined,
  InboxOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  setPagination,
  getCurrentMessage,
} from "../../../../features/inbox/inboxSlice";
import "./MessageList.css";

const { Sider } = Layout;
const { Text, Title } = Typography;

// Reusable Styles
const styles = {
  sidebarContainer: {
    height: "100%",
    overflowY: "auto",
    position: "relative",
  },
  stickyHeader: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "white",
    padding: 16,
    borderBottom: "1px solid #f0f0f0",
  },
  listItem: (isActive) => ({
    padding: 16,
    cursor: "pointer",
    backgroundColor: isActive ? "#e6f7ff" : "white",
  }),
  sider: {
    borderRight: "1px solid #f0f0f0",
    height: "100vh",
  },
};

const MessageList = () => {
  const dispatch = useDispatch();
  const {
    messages,
    currentPage,
    pageSize,
    status,
    currentMessage,
    allMessages,
  } = useSelector((state) => state.inbox);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchedData, setSearchedData] = useState(messages);

  const onSearch = (e) => {
    const searchValue = e.target?.value?.toLowerCase();
    const filteredData = messages.filter((data) =>
      data?.name?.toLowerCase().includes(searchValue)
    );
    setSearchedData(filteredData);
  };
  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSearchedData(messages);
  }, [messages]);

  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const sortedMessages = [...searchedData].sort((a, b) => {
    return sortOrder === "asc"
      ? new Date(a.time) - new Date(b.time)
      : new Date(b.time) - new Date(a.time);
  });
  const formatMessageTime = (time) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleSelectMessage = (id) => {
    dispatch(getCurrentMessage(id));
  };

  const SidebarContent = (
    <div style={styles.sidebarContainer}>
      {/* Sticky Search and Sort Section */}
      <div className="message-list-header">
        <div className="header-title">
          <Title level={4} style={{ margin: 0 }}>
            Inbox
          </Title>
          <Badge count={messages.length} style={{ backgroundColor: 'rgb(22, 119, 255)' }} />
        </div>
        
        {/* Enhanced Search Input */}
        <div className="search-container">
          <Input
            prefix={<SearchOutlined style={{ color:'black' }} />}
            onChange={onSearch}
            // value={searchValue}
            placeholder="Search messages..."
            className="search-input"
            allowClear
          />
          <Button
            type="text"
            icon={sortOrder === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
            onClick={toggleSortOrder}
            className="sort-button"
            title={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
          />
        </div>
      </div>

      {/* Messages List */}
      <List
        className="message-list"
        dataSource={sortedMessages}
        renderItem={(item) => (
          <List.Item
            style={styles.listItem(item.id === currentMessage?.id)}
            onClick={() => handleSelectMessage(item)}
          >
            <List.Item.Meta
              avatar={
                <Avatar style={{ backgroundColor: "#1890ff" }}>
                  {item.name?.[0] || ""}
                </Avatar>
              }
              title={
                <div className="message-header">
                <Text strong className="message-name">
                  {item.name}
                </Text>
                <div className="message-time">
                  {item.read && <CheckCircleFilled className="read-indicator" />}
                  <Text type="secondary">
                    {formatMessageTime(item.time)}
                  </Text>
                </div>
              </div>
              }
              description={            <div className="message-preview">
                <Text type="secondary" ellipsis>
                  {item.preview}
                </Text>
              </div>}
            />
          </List.Item>
        )}
        pagination={false}
      />
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          <Menu
            mode="horizontal"
            style={{ borderBottom: "1px solid #f0f0f0" }}
            onClick={() => setDrawerVisible(true)}
          >
            <Menu.Item key="inbox" icon={<InboxOutlined />}>
              Call List
            </Menu.Item>
          </Menu>
          <Drawer
            title="Inbox"
            placement="left"
            closable
            onClose={() => setDrawerVisible(false)}
            visible={drawerVisible}
            bodyStyle={{ padding: 0 }}
          >
            {SidebarContent}
          </Drawer>
        </>
      ) : (
        <Sider theme="light" width={300} style={styles.sider}>
          {SidebarContent}
        </Sider>
      )}
    </>
  );
};

export default MessageList;
