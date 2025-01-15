import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Form,
  Input,
  Select,
  Typography,
  Row,
  Col,
  Space,
  Modal,
  message,
} from "antd";
import { addTeamMembers } from "../../../features/team/teamSlice";
import "./AddTeamMembers.css";

const { Option } = Select;
const { Text } = Typography;

const AddTeamMembers = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const initialTeamMember = useCallback(
    () => ({
      key: Date.now(),
      name: "",
      emails: [""],
      permission: "No access",
      password: "",
    }),
    []
  );

  const [teamMembers, setTeamMembers] = useState([initialTeamMember()]);

  const showModal = () => setIsModalVisible(true);

  const handleCancel = () => {
    form.resetFields();
    setTeamMembers([initialTeamMember()]);
    setIsModalVisible(false);
  };

  const handleAddRow = () => {
    setTeamMembers((prev) => [...prev, initialTeamMember()]);
  };

  const handleRemoveRow = (key) => {
    setTeamMembers((prev) => prev.filter((member) => member.key !== key));
    form.setFieldsValue({
      teamMembers: teamMembers.filter((member) => member.key !== key),
    });
  };

  const validateTeamMembers = () => {
    const values = form.getFieldsValue();
    if (!values.teamMembers || values.teamMembers.length === 0) {
      return { isValid: false, index: -1 };
    }
    for (let i = 0; i < values.teamMembers.length; i++) {
      const { name, email, permission, password } = values.teamMembers[i] || {};
      if (!name || !email || !permission || !password) {
        return { isValid: false, index: i };
      }
    }
    return { isValid: true };
  };

  const handleFormSubmit = () => {
    const { isValid, index } = validateTeamMembers();
    if (!isValid) {
      message.error(
        index === -1
          ? "Please add at least one team member."
          : `Please fill all fields for member ${index + 1}.`
      );
      return;
    }

    form
      .validateFields()
      .then((values) => {
        dispatch(addTeamMembers(...values.teamMembers));
        handleCancel();
      })
      .catch((error) => console.log("Validation Failed:", error));
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        aria-label="Add Team Members Modal"
      >
        Add Team Members
      </Button>
      <Modal
        title="Add Team Members"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleFormSubmit}>
            Add
          </Button>,
        ]}
        centered
        width="90%"
      >
        <Form
          form={form}
          name="addTeamMembers"
          layout="vertical"
          initialValues={{ teamMembers }}
          onValuesChange={(_, allValues) =>
            setTeamMembers(allValues.teamMembers)
          }
        >
          {teamMembers.map((member, index) => (
            <Row key={member.key} gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name={["teamMembers", index, "name"]}
                  rules={[
                    { required: true, message: "Full name is required." },
                  ]}
                >
                  <Input placeholder="Full name" aria-label="Full name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name={["teamMembers", index, "email"]}
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Enter a valid email address.",
                    },
                  ]}
                >
                  <Input placeholder="Email" aria-label="Email" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={5}>
                <Form.Item
                  name={["teamMembers", index, "permission"]}
                  initialValue="No access"
                >
                  <Select aria-label="Permission Level">
                    <Option value="No access">No access</Option>
                    <Option value="Standard">Standard</Option>
                    <Option value="Admin">Admin</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={5}>
                <Form.Item
                  name={["teamMembers", index, "password"]}
                  rules={[
                    {
                      required: true,
                      message: "Enter a Password",
                    },
                  ]}
                >
                  <Input placeholder="Password" aria-label="Password" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={2}>
                {teamMembers.length > 1 && (
                  <Button
                    type="link"
                    danger
                    onClick={() => handleRemoveRow(member.key)}
                    aria-label={`Remove team member ${index + 1}`}
                  >
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
          ))}
          <Space style={{ marginTop: 16, flexWrap: "wrap" }}>
            <Button type="dashed" onClick={handleAddRow} aria-label="Add more">
              + Add more
            </Button>
            <Text type="secondary">
              "Access only" team members will receive an invitation email with a
              temporary password.
            </Text>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default AddTeamMembers;
