import React, { useState } from "react";
import { Form, Input, Button, Divider, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  AppleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import { useDispatch } from "react-redux";
import { login } from "../../features/auth/authSlice";
import {
  showSocialLogin,
  CompanyName,
  CompanyNumber,
  CurrentYear,
  showHeaderAtLoginPage,
} from "../../constant";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(login(values)).then((result) => {
      console.log("result",result);
      if (result.type === "auth/login/fulfilled") {
        navigate("/dashboard");
      }else if (result.type === "auth/login/rejected") {
        alert(result?.payload)
      }
    }).catch((error) => {
      console.log("error",error);
    });
  };
  return (
    <div className="login-page">
      {/* Header */}

      <header className="header">
        <div className="logo">{CompanyName}</div>
        {showHeaderAtLoginPage ? (
          <Button icon={<PhoneOutlined />} className="phone-button">
            Call 24/7 at {CompanyNumber}
          </Button>
        ) : null}
      </header>

      {/* Login Container */}
      <div className="login-container">
        <h1 className="login-heading">Log Into Your Account</h1>

        {showSocialLogin ? (
          <>
            <Button
              icon={<GoogleOutlined />}
              block
              className="social-button"
              onClick={() => message.info("Google login not implemented")}
            >
              Login with Google
            </Button>
            <Button
              icon={<AppleOutlined />}
              block
              className="social-button"
              onClick={() => message.info("Apple login not implemented")}
            >
              Login with Apple
            </Button>

            <Divider plain>Or</Divider>
          </>
        ) : null}

        {/* Login Form */}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
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
              size="large"
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
              Login
            </Button>
          </Form.Item>
        </Form>

        <a
          className="forgot-password"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            message.info("Forgot password feature coming soon");
          }}
        >
          Forgot password?
        </a>
      </div>

      {/* Footer */}
      <footer className="footer">
        ©{CurrentYear} {CompanyName}. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Login;
