import { Col, Row } from "antd";
import ChatWindow from "../components/ChatWindow";
import SideBar from "../components/SideBar";

export default function ChatPage() {
  return (
    <Row>
      <Col span={6}>
        <SideBar />
      </Col>
      <Col span={18}>
        <ChatWindow />
      </Col>
    </Row>
  );
}
