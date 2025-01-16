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

  const handleSelectMessage = (id) => {
    dispatch(getCurrentMessage(id));
  };

  const SidebarContent = (
    <div style={styles.sidebarContainer}>
      {/* Sticky Search and Sort Section */}
      <div style={styles.stickyHeader}>
        <Title level={5} style={{ margin: 0 }}>
          Inbox
        </Title>
        <Input
          prefix={<SearchOutlined />}
          onChange={onSearch}
          placeholder="Search"
          style={{ width: "100%", marginTop: 8 }}
        />
        <Button
          icon={
            sortOrder === "asc" ? (
              <SortAscendingOutlined />
            ) : (
              <SortDescendingOutlined />
            )
          }
          onClick={toggleSortOrder}
          style={{ marginTop: 16, width: "100%" }}
        >
          Sort by Time
        </Button>
      </div>

      {/* Messages List */}
      <List
        dataSource={sortedMessages}
        renderItem={(item) => (
          <List.Item
            style={styles.listItem(item.id === currentMessage?.id)}
            onClick={() => handleSelectMessage(item.id)}
          >
            <List.Item.Meta
              avatar={
                <Avatar style={{ backgroundColor: "#1890ff" }}>
                  {item.name?.[0] || ""}
                </Avatar>
              }
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text strong>{item.name}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.time}
                  </Text>
                </div>
              }
              description={<Text type="secondary">{item.preview}</Text>}
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
