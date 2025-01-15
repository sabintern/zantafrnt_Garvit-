import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Layout,
  Menu,
  Card,
  Button,
  Table,
  Tabs,
  Typography,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  InboxOutlined,
  TeamOutlined,
  SettingOutlined,
  CalendarOutlined,
  BellOutlined,
  CreditCardOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const BillingDashboard = () => {
  const {
    invoices,
    billingSummary,
    planDetails,
    invoiceDetails,
    paymentDetails,
    transactions,
  } = useSelector((state) => state.billing);
  const [activeTab, setActiveTab] = useState("invoices");

  const invoiceColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Invoice number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
    },
    {
      title: "Total Due",
      dataIndex: "totalDue",
      key: "totalDue",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: "Receipt",
      key: "receipt",
      render: () => <Button type="link">View</Button>,
    },
  ];

  const transactionColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <Layout>
      <Content style={{ padding: "24px", backgroundColor: "#fff" }}>
        <Tabs defaultActiveKey="billing">
          <TabPane tab="Billing" key="billing">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={16}>
                <Card title="Billing Summary">
                  <Row gutter={[16, 16]}>
                    <Col xs={12} sm={12} md={12}>
                      <Statistic
                        title="Total Due"
                        value={billingSummary.totalDue}
                        prefix="$"
                        precision={2}
                      />
                      <Statistic
                        title="Past Due"
                        value={billingSummary.pastDue}
                        prefix="$"
                        precision={2}
                      />
                    </Col>
                    <Col xs={12} sm={12} md={12}>
                      <Statistic
                        title="Recent Charges"
                        value={billingSummary.recentCharges}
                        prefix="$"
                        precision={2}
                      />
                      <Statistic
                        title="Recent Transactions"
                        value={billingSummary.recentTransactions}
                        prefix="$"
                        precision={2}
                      />
                    </Col>
                  </Row>
                  <Button type="primary" style={{ marginTop: "20px" }}>
                    Pay
                  </Button>
                </Card>

                <Card
                  title="Invoice Details"
                  extra={<Button type="link">Edit</Button>}
                  style={{ marginTop: "24px" }}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={12}>
                      <Text strong>Business name</Text>
                      <p>{invoiceDetails.businessName}</p>
                      <Text strong>Address</Text>
                      <p>{invoiceDetails.address}</p>
                    </Col>
                    <Col xs={24} sm={12} md={12}>
                      <Text strong>Attn To / PO Number</Text>
                      <p>{invoiceDetails.attnTo}</p>
                      <Text strong>Billing Cycle</Text>
                      <p>{invoiceDetails.billingCycle}</p>
                      <Text strong>Subscribers</Text>
                      <p>{invoiceDetails.subscribers}</p>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  title="Plan Details"
                  extra={<Button type="link">Change Plan</Button>}
                >
                  <Title level={5}>{planDetails.name}</Title>
                  <Text strong>${planDetails.price.toFixed(2)}</Text>
                  <div style={{ marginTop: "16px" }}>
                    <Text strong>Addons</Text>
                    <p>{planDetails.addons}</p>
                  </div>
                </Card>

                <Card
                  title="Payment details"
                  extra={<Button type="link">Edit</Button>}
                  style={{ marginTop: "24px" }}
                >
                  <p>
                    {paymentDetails.cardType} **** **** ****{" "}
                    {paymentDetails.lastFourDigits}
                  </p>
                  <Text type="secondary">
                    Expires {paymentDetails.expiryDate}
                  </Text>
                  <p style={{ marginTop: "16px" }}>
                    Billed on 30th of every month. Next billing on{" "}
                    {paymentDetails.nextBillingDate}
                  </p>
                </Card>
              </Col>
            </Row>

            <Card style={{ marginTop: "24px" }}>
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Invoices" key="invoices">
                  <Table
                    columns={invoiceColumns}
                    dataSource={invoices}
                    pagination={false}
                    rowKey="id"
                  />
                </TabPane>
                <TabPane tab="Transactions" key="transactions">
                  <Table
                    columns={transactionColumns}
                    dataSource={transactions}
                    pagination={false}
                    rowKey="id"
                  />
                </TabPane>
              </Tabs>
            </Card>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default BillingDashboard;
