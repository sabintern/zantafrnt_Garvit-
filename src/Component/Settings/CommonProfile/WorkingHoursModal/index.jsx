import React, { useState, useEffect } from "react";
import {
  Modal,
  Avatar,
  Typography,
  Space,
  Select,
  Button,
  Row,
  Col,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
const { Title, Text } = Typography;
const { Option } = Select;

const labelStyle = "original";
const timezones = {
  ...allTimezones,
};
// Function to generate time slots where each slot is 15 minutes apart
const generateTimeSlots = () => {
  const times = [];

  const amPm = ["AM", "PM"];

  for (let periodIndex = 0; periodIndex < 2; periodIndex++) {
    let hour = periodIndex === 0 ? 9 : 1; // Start with 9 AM, then 1 PM
    for (let i = 0; i < 12; i++) {
      const displayHour = hour === 12 ? 12 : hour; // 12 o'clock should stay 12
      const startTime = `${displayHour}:00 ${amPm[periodIndex]}`;
      const endTime = `${displayHour}:15 ${amPm[periodIndex]}`;

      times.push({ start: startTime, end: endTime });

      times.push({
        start: endTime,
        end: `${displayHour}:30 ${amPm[periodIndex]}`,
      });
      times.push({
        start: `${displayHour}:30 ${amPm[periodIndex]}`,
        end: `${displayHour}:45 ${amPm[periodIndex]}`,
      });

      // Increment the hour and ensure it wraps around after 12
      hour = (hour % 12) + 1;
    }
  }

  return times;
};

// Generate the time slots
const timeSlots = generateTimeSlots();

const WorkingHoursModal = ({
  visible,
  onCancel,
  workingHours,
  updateWorkingHours,
  timeZone,
  title,
  pageData,
}) => {
  const { options } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const dispatch = useDispatch();

  const [selectedTimeZone, setSelectedTimeZone] = useState("");

  const [localWorkingHours, setLocalWorkingHours] = useState(workingHours);

  // Deep copy of working hours to avoid mutation errors
  const deepCopyWorkingHours = (workingHours) => {
    return workingHours.map((day) => ({
      ...day,
      times: [...day.times], // Ensure times is a new array, deep copy
    }));
  };

  // Handle adding new hours (not updating Redux directly)
  const handleAddHours = (dayIndex) => {
    setLocalWorkingHours((prevWorkingHours) => {
      const updatedWorkingHours = deepCopyWorkingHours(prevWorkingHours);
      updatedWorkingHours[dayIndex].times.push({
        start: "9:00 AM",
        end: "9:15 AM",
      });
      return updatedWorkingHours;
    });
  };

  // Handle removing hours (not updating Redux directly)
  const handleRemoveHours = (dayIndex, timeIndex) => {
    setLocalWorkingHours((prevWorkingHours) => {
      const updatedWorkingHours = deepCopyWorkingHours(prevWorkingHours);
      updatedWorkingHours[dayIndex].times = updatedWorkingHours[
        dayIndex
      ].times.filter((_, index) => index !== timeIndex);
      return updatedWorkingHours;
    });
  };

  // Handle individual time changes (update only local state)
  const handleTimeChange = (dayIndex, timeIndex, newStart, newEnd) => {
    setLocalWorkingHours((prevWorkingHours) => {
      const updatedWorkingHours = deepCopyWorkingHours(prevWorkingHours);
      updatedWorkingHours[dayIndex].times[timeIndex] = {
        start: newStart,
        end: newEnd,
      };
      return updatedWorkingHours;
    });
  };

  // Step 3: Save the changes when the "Save" button is clicked
  const handleSave = () => {
    dispatch(
      updateWorkingHours({
        ...pageData,
        workingHours: localWorkingHours,
        timeZone: selectedTimeZone,
      })
    ); // Save updated working hours to Redux
    onCancel(); // Close the modal
  };

  useEffect(() => {
    setLocalWorkingHours(workingHours); // Reset local state if workingHours in Redux store change
  }, [workingHours]);

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
      width={800}
    >
      <Space size={16} style={{ marginBottom: "24px" }}>
        <Avatar size={64}> {pageData.name[0]}</Avatar>
        <div>
          <Title level={4} style={{ marginBottom: 0 }}>
            {pageData.name}
          </Title>
          {pageData?.role && <Text type="secondary">{pageData.role}</Text>}
        </div>
      </Space>

      <Title level={4}>Manage working hours</Title>

      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {localWorkingHours?.map((day, dayIndex) => (
          <Space key={day.day} align="start">
            <div style={{ width: "100px" }}>{day.day}</div>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              {day?.times?.map((time, timeIndex) => (
                <Space key={timeIndex}>
                  <Select
                    value={time.start}
                    style={{ width: 120 }}
                    onChange={(newStart) =>
                      handleTimeChange(dayIndex, timeIndex, newStart, time.end)
                    }
                  >
                    {timeSlots?.map((slot) => (
                      <Option key={slot.start} value={slot.start}>
                        {slot.start}
                      </Option>
                    ))}
                  </Select>
                  <span>—</span>
                  <Select
                    value={time.end}
                    style={{ width: 120 }}
                    onChange={(newEnd) =>
                      handleTimeChange(dayIndex, timeIndex, time.start, newEnd)
                    }
                  >
                    {timeSlots?.map((slot) => (
                      <Option key={slot.start} value={slot.end}>
                        {slot.end}
                      </Option>
                    ))}
                  </Select>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => handleAddHours(dayIndex)}
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveHours(dayIndex, timeIndex)}
                  />
                </Space>
              ))}
              {day.times.length === 0 && (
                <Button type="link" onClick={() => handleAddHours(dayIndex)}>
                  Add hours
                </Button>
              )}
            </Space>
          </Space>
        ))}
      </Space>

      <Title level={5} style={{ marginTop: "24px", marginBottom: "16px" }}>
        Time zone
      </Title>
      <Row>
        <Col span={24}>
          <Select
            style={{ width: 400 }}
            placeholder="Select Time Zone"
            optionLabelProp="label"
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            defaultValue={timeZone}
            onChange={(value) => setSelectedTimeZone(value)}
          >
            {options?.map((timeZone) => (
              <Select.Option
                key={timeZone.value}
                value={timeZone.value}
                label={timeZone.label}
              >
                {timeZone.label}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Modal>
  );
};

export default WorkingHoursModal;
