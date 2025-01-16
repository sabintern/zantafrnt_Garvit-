import React from "react";
import {
  Form,
  Input,
  Button,
  Divider,
  message,
  Typography,
  Layout,
  Space,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  AppleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/auth/authSlice";
import {
  showSocialLogin,
  CompanyName,
  CompanyNumber,
  CurrentYear,
  showHeaderAtLoginPage,
} from "../../constant";
import "./Login.css";

const { Title, Text } = Typography;
const { Header, Content, Footer } = Layout;

const Login = () => {
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(login(values))
      .then((result) => {
        if (result.type === "auth/login/fulfilled") {
          navigate("/dashboard");
        } else if (result.type === "auth/login/rejected") {
          message.error(result?.payload);
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        message.error("An unexpected error occurred. Please try again.");
      });
  };

  return (
    <Layout className="login-layout">
      <Header className="login-header">
        <Space align="center" size={16}>
          <img src="/logo.jpeg" alt="Company Logo" className="logo-image" />
          <Title level={4} style={{ color: "white", margin: 0 }}>
            {CompanyName}
          </Title>
        </Space>
        {showHeaderAtLoginPage && (
          <Button icon={<PhoneOutlined />} type="primary" ghost>
            Call 24/7 at {CompanyNumber}
          </Button>
        )}
      </Header>
      <Content className="login-content">
        <div className="login-card">
          <Title level={2} className="login-title">
            Welcome Back
          </Title>
          <Text type="secondary" className="login-subtitle">
            Please enter your details to sign in
          </Text>

          {showSocialLogin && (
            <>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%", marginTop: 24 }}
              >
                <Button
                  icon={<GoogleOutlined />}
                  block
                  className="social-button"
                  onClick={() => message.info("Google login not implemented")}
                >
                  Continue with Google
                </Button>
                <Button
                  icon={<AppleOutlined />}
                  block
                  className="social-button"
                  onClick={() => message.info("Apple login not implemented")}
                >
                  Continue with Apple
                </Button>
              </Space>
              <Divider plain>Or</Divider>
            </>
          )}

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your Email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
          {/* 
          <Text className="forgot-password">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                message.info("Forgot password feature coming soon");
              }}
            >
              Forgot password?
            </a>
          </Text> */}
        </div>
      </Content>
      <Footer className="login-footer">
        <Text type="secondary">
          ©{CurrentYear} {CompanyName}. All Rights Reserved.
        </Text>
      </Footer>
    </Layout>
  );
};

export default Login;
