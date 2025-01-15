// src/components/HelpAndSupportPopover.jsx
import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Space,
  Typography,
  message,
  Popover,
  FloatButton,
} from "antd";
import { MailOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const HelpAndSupportPopover = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false); // For controlling the visibility of the popover

  // State to store form data
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");

  // Handle form submission
  const handleSubmit = (values) => {
    setLoading(true);

    // Simulate API call or form submission (replace with actual logic)
    setTimeout(() => {
      message.success(
        "Your question has been submitted! We will get back to you soon."
      );
      form.resetFields(); // Reset the form fields
      setLoading(false);
      setVisible(false); // Close the popover after submission
    }, 2000);
  };

  // Content for the Popover (Help and Support form)
  const content = (
    <div style={{ width: 400 }}>
      <Title level={4}>Help & Support</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          email,
          question,
        }}
      >
        <Form.Item
          label="Your Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email!",
            },
            {
              type: "email",
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter your email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)} // Set email value on change
          />
        </Form.Item>

        <Form.Item
          label="Your Question"
          name="question"
          rules={[
            {
              required: true,
              message: "Please enter your question!",
            },
          ]}
        >
          <Input.TextArea
            prefix={<QuestionCircleOutlined />}
            placeholder="Enter your question"
            rows={4}
            onChange={(e) => setQuestion(e.target.value)} // Set question value on change
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
            <Button htmlType="button" onClick={() => form.resetFields()}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );

  return (
    <Popover
      content={content}
      title="Help & Support"
      visible={visible}
      onVisibleChange={setVisible} // Handle visibility toggle
      trigger="click" // Popover shows on click
      placement="bottom"
    >
      <FloatButton
        icon={<QuestionCircleOutlined />}
        type="default"
        style={{ insetInlineEnd: 94 }}
      />
    </Popover>
  );
};

export default HelpAndSupportPopover;
