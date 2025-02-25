"use client";

import { Card, Col, Row, theme, Space, Statistic, Tag } from "antd";

export default function AntdCustomerSummaryHeader() {
  const { token } = theme.useToken();

  const formatValue = (value) => <span className="text-xl">{value}</span>;

  return (
    <Row gutter={[16, 16]} align="center" justify="center">
      {/* Financial Summary */}
      <Col xs={24} md={12} xl={8}>
        <Card variant="borderless" size="small" className="text-center">
          <Space size="large">
            <Statistic
              title="Total Amount"
              valueRender={() => formatValue("RM 1000.00")}
            />
            <Statistic
              title="Total Paid"
              valueRender={() => formatValue("RM 200.00")}
            />
            <Statistic
              title="Balance"
              valueStyle={{ color: token.colorSuccess, fontWeight: "semibold" }}
              valueRender={() => formatValue("RM 800.00")}
            />
          </Space>
        </Card>
      </Col>

      {/* Last Payment & Next Call Date */}
      <Col xs={24} md={12} xl={8}>
        <Card variant="borderless" size="small" className="text-center">
          <Space size="large">
            <Statistic
              title="Last Paid"
              valueRender={() => formatValue("RM 200.00")}
            />
            <Statistic
              title="Last Paid At"
              valueRender={() => formatValue("1 Jan 2025")}
            />
            <Statistic
              title="Next Call At"
              valueRender={() => formatValue("1 Jan 2025")}
            />
          </Space>
        </Card>
      </Col>

      {/* Collector Info */}
      <Col xs={24} md={12} xl={8}>
        <Card variant="borderless" size="small" className="text-center">
          <Space size="large">
            <Statistic
              title="Status"
              valueRender={() => (
                <Tag color="red" className="text-xl">
                  ABORT
                </Tag>
              )}
            />
            <Statistic
              title="Collector"
              valueRender={() => formatValue("Xinyin")}
            />
            <Statistic title="Branch" valueRender={() => formatValue("SP")} />
          </Space>
        </Card>
      </Col>
    </Row>
  );
}
