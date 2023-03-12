import { Col, Row } from "antd";
import { ReactElement } from "react";
import SideBar from "../components/SideBar";

export interface LayoutChatProps {
  children?: ReactElement;
}

export default function LayoutChat({ children }: LayoutChatProps) {
  return (
    <Row>
      <Col span={6}>
        <SideBar />
      </Col>
      <Col span={18}>{children}</Col>
    </Row>
  );
}
