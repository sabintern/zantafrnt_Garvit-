import React, { useState, useEffect } from "react";
import { Layout, Input, List, Avatar, Typography, Drawer, Menu, Spin, Button } from "antd";
import { SearchOutlined, InboxOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../../../features/inbox/inboxSlice";

const { Sider } = Layout;
const { Text, Title } = Typography;

const MessageList = () => {
  const dispatch = useDispatch();
  const { messages, status } = useSelector((state) => state.inbox);

  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [selectedMessageId, setSelectedMessageId] = useState(null); // Track selected message
  const pageSize = 5; // Number of messages per page

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Sort and paginate messages
  const sortedMessages = [...messages].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.time) - new Date(b.time); // Ascending
    }
    return new Date(b.time) - new Date(a.time); // Descending
  });

  const paginatedMessages = sortedMessages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSelectMessage = (id) => {
    setSelectedMessageId(id);
    dispatch(fetchMessages(id)); // Fetch message details
  };

  const SidebarContent = (
    <div style={{ height: "100%" }}>
      <div style={{ padding: 16, borderBottom: "1px solid #f0f0f0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            marginBottom: 16,
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            Inbox
          </Title>
          <Input
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Search"
            style={{ width: "100%", marginTop: 8 }}
          />
          <Button
            icon={sortOrder === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
            onClick={toggleSortOrder}
            style={{ marginTop: 16 }}
          >
            Sort by Time
          </Button>
        </div>
      </div>
      <List
        dataSource={paginatedMessages}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: 16,
              cursor: "pointer",
              backgroundColor: item.id === selectedMessageId ? "#e6f7ff" : "white", // Highlight selected
            }}
            onClick={() => handleSelectMessage(item.id)}
          >
            <List.Item.Meta
              avatar={
                <Avatar style={{ backgroundColor: "#1890ff" }}>
                  {item.name[0].toUpperCase()}
                </Avatar>
              }
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
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
        pagination={{
          pageSize,
          current: currentPage,
          total: messages.length,
          onChange: handlePageChange,
        }}
      />
    </div>
  );

  return  (
    <>
      {isMobile ? (
        <>
          <Menu
            mode="horizontal"
            style={{ borderBottom: "1px solid #f0f0f0" }}
            onClick={toggleDrawer}
          >
            <Menu.Item key="inbox" icon={<InboxOutlined />}>
              Call List
            </Menu.Item>
          </Menu>
          <Drawer
            title="Inbox"
            placement="left"
            closable
            onClose={toggleDrawer}
            visible={drawerVisible}
            bodyStyle={{ padding: 0 }}
          >
            {SidebarContent}
          </Drawer>
        </>
      ) : (
        <Sider
          theme="light"
          width={300}
          style={{ borderRight: "1px solid #f0f0f0", height: "100vh" }}
        >
          {SidebarContent}
        </Sider>
      )}
    </>
  );
};

export default MessageList;
