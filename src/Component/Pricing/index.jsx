import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button, Typography, Spin } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { pricingPlans } from "../../api/mockData"; // Importing mock data

const { Title, Text } = Typography;

const Pricing = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);

  // Mock API call to fetch pricing plans
  const fetchPricingPlans = () => {
    setTimeout(() => {
      try {
        setPlans(pricingPlans); // Use mock data from the imported file
        setLoading(false);
      } catch (error) {
        setError("Error fetching pricing plans");
        setLoading(false);
      }
    }, 1500); // Simulate network delay of 1.5 seconds
  };

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <Text type="danger">{error}</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <Title level={2}>Pricing Plans</Title>
      <Row gutter={[16, 16]}>
        {plans.map((plan) => (
          <Col span={8} key={plan.id}>
            <Card
              title={plan.name}
              bordered
              style={{
                border: plan.available
                  ? "1px solid #1890ff"
                  : "1px solid #d9d9d9",
                boxShadow: plan.available
                  ? "0 4px 6px rgba(0, 0, 0, 0.1)"
                  : "none",
              }}
              actions={[
                <Button
                  type={plan.available ? "primary" : "default"}
                  disabled={!plan.available}
                >
                  {plan.available ? "Select Plan" : "Unavailable"}
                </Button>,
              ]}
            >
              <Title level={4}>{plan.price}</Title>
              <div>
                {plan.features.map((feature, index) => (
                  <div key={index} style={{ marginBottom: "8px" }}>
                    <Text>
                      {plan.available ? (
                        <CheckOutlined style={{ color: "green" }} />
                      ) : (
                        <CloseOutlined style={{ color: "red" }} />
                      )}
                      {feature}
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Pricing;
