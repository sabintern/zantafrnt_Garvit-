import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  List,
  Avatar,
  Typography,
  Drawer,
  Menu,
  Select,
  Spin,
} from "antd";
import { SearchOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchTeams,
  updateWorkingHours,
} from "../../../features/team/teamSlice";
import AddTeamMembers from "./AddTeamMember";
import CommonProfile from "../CommonProfile";
import { defaultTimeZone } from "../../../api/mockData";

const { Sider } = Layout;
const { Text, Title } = Typography;

const Teams = () => {
  const dispatch = useDispatch();
  const { members, loading, error } = useSelector((state) => state.teams);

  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(members[0]);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    setSelectedUser(members[0]);
  }, [members]);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const filteredUsers = members.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (userId) => {
    const user = members.find((user) => user.id === userId);
    setSelectedUser(user);
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedUser((prevUser) => ({ ...prevUser, role }));
  };

  console.log(members, "members");

  const SidebarContent = (
    <div style={{ height: "100%" }}>
      <div style={{ padding: 16, borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ marginBottom: 16 }}>
          <Title level={5} style={{ margin: 0 }}>
            Team Members
            <AddTeamMembers />
          </Title>
          <Input
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Search staff"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", marginTop: 8 }}
          />
        </div>
      </div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
          <Spin size="large" />
        </div>
      ) : (
        <List
          dataSource={filteredUsers}
          renderItem={(user) => (
            <List.Item
              style={{
                padding: 16,
                cursor: "pointer",
                backgroundColor:
                  selectedUser?.id === user.id ? "#e6f7ff" : "inherit",
              }}
              onClick={() => handleSelectUser(user.id)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: "#1890ff" }}
                    icon={<UserOutlined />}
                  />
                }
                title={<Text strong>{user.name}</Text>}
                description={<Text type="secondary">{user.role}</Text>}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          <Menu
            mode="horizontal"
            style={{ borderBottom: "1px solid #f0f0f0" }}
            onClick={toggleDrawer}
          >
            <Menu.Item key="teams" icon={<TeamOutlined />}>
              Team Members
            </Menu.Item>
          </Menu>
          <Drawer
            title="Team Members"
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
        <Layout>
          <Sider
            theme="light"
            width={300}
            style={{ borderRight: "1px solid #f0f0f0", height: "100vh" }}
          >
            {SidebarContent}
          </Sider>
          <CommonProfile
            pageData={selectedUser}
            status={""}
            timeZone={defaultTimeZone}
            updateWorkingHours={updateWorkingHours}
            title=""
          />
        </Layout>
      )}
    </>
  );
};

export default Teams;
