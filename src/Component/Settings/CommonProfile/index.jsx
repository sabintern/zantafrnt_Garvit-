import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Button, Tabs, Typography, Space, Spin, Layout } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  LockOutlined,
  EditOutlined,
} from "@ant-design/icons";
import WorkingHoursModal from "./WorkingHoursModal";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const CommonProfile = ({
  pageData,
  updateWorkingHours,
  status,
  timeZone,
  title,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const convertTo24HourFormat = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convert to 24-hour format
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const isCurrentTimeInRange = (start, end) => {
    const currentTime = new Date();
    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();

    const startMinutes = convertTo24HourFormat(start);
    const endMinutes = convertTo24HourFormat(end);

    // If the end time is earlier than the start time, it means the time range crosses midnight
    if (startMinutes > endMinutes) {
      // Current time is either after the start time or before the end time (midnight cross)
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }

    // Otherwise, the time range doesn't cross midnight
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  };

  // Get the current day of the week (e.g., Monday, Tuesday)
  const getCurrentDay = () => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDayIndex = new Date().getDay();
    return daysOfWeek[currentDayIndex];
  };

  const currentDay = getCurrentDay();
  console.log(pageData, pageData.workingHours, "pageData.workingHours");
  // Get working hours for the current day or set to empty array if not available
  const currentDayWorkingHours =
    Array.isArray(pageData.workingHours) && pageData.workingHours.length > 0
      ? pageData.workingHours.find((day) => day.day === currentDay)
      : { times: [] };

  if (status === "loading") {
    return <Spin size="large" />;
  }

  if (!pageData) {
    return <Text type="danger">Failed to load pageData data.</Text>;
  }

  return (
    <Layout style={{ background: "white", padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <Space size={16}>
          <Avatar size={64}>{pageData.name[0]}</Avatar>
          <div>
            <Title level={2} style={{ marginBottom: 0 }}>
              {pageData.name}
            </Title>
            <Text type="secondary">
              {pageData.role} · {pageData.location} · {pageData.time}
            </Text>
          </div>
        </Space>
        <Button icon={<EditOutlined />} onClick={showModal} />
      </div>

      <Tabs defaultActiveKey="about">
        <TabPane tab="About" key="about">
          <Space direction="vertical" size={16}>
            <Space>
              <PhoneOutlined />
              <Text>{pageData.phone}</Text>
            </Space>
            <Space>
              <MailOutlined />
              {pageData?.emails?.map((email, index) => <Text>{email};</Text>) ||
                pageData.email ||
                ""}
            </Space>
            <Space>
              <ClockCircleOutlined />
              <Text>
                Today: {currentDay}
                {currentDayWorkingHours?.times?.length > 0 ? (
                  <ul style={{ paddingLeft: "20px" }}>
                    {currentDayWorkingHours?.times?.map((time, index) => {
                      const isOpen = isCurrentTimeInRange(time.start, time.end);
                      return (
                        <li key={index} style={{ margin: "5px 0" }}>
                          {time.start} - {time.end}:{" "}
                          <span
                            style={{
                              color: isOpen ? "green" : "red",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            {isOpen ? "Open Now" : "Closed"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <Text type="danger" style={{ marginLeft: "5px" }}>
                    Closed today (No working hours specified).
                  </Text>
                )}
              </Text>
            </Space>
            <Space>
              <LockOutlined />
              <Text>{pageData.ownership}</Text>
            </Space>
          </Space>
        </TabPane>

        <TabPane tab="Working hours" key="working-hours">
          <ul style={{ paddingLeft: "20px" }}>
            {pageData?.workingHours?.map((day, index) => {
              return (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <strong>{day.day}</strong>
                  <ul>
                    {day.times.length > 0 ? (
                      day.times.map((time, timeIndex) => {
                        const isOpen = isCurrentTimeInRange(
                          time.start,
                          time.end
                        );
                        return (
                          <li key={timeIndex} style={{ margin: "5px 0" }}>
                            {time.start} - {time.end}:{" "}
                            <span
                              style={{
                                color: isOpen ? "green" : "red",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              {isOpen ? "Open Now" : "Closed"}
                            </span>
                          </li>
                        );
                      })
                    ) : (
                      <Text type="danger" style={{ fontSize: "14px" }}>
                        Closed (No working hours specified)
                      </Text>
                    )}
                  </ul>
                </li>
              );
            })}
          </ul>
        </TabPane>

        <TabPane tab="Updates" key="updates">
          Updates content
        </TabPane>
      </Tabs>

      <WorkingHoursModal
        pageData={pageData}
        visible={isModalVisible}
        onCancel={handleCancel}
        workingHours={pageData.workingHours}
        updateWorkingHours={updateWorkingHours}
        timeZone={timeZone}
        title={title}
      />
    </Layout>
  );
};

export default CommonProfile;
