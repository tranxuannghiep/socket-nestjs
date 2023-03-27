import { Col, Row } from "antd";
import styled from "styled-components";
import RoomList from "./RoomList";

const SideBarStyled = styled.div`
  background: #3f0e40;
  color: white;
  height: 100vh;
`;

interface SideBarProps {
  listNotifyMessage: any;
}

export default function SideBar({ listNotifyMessage }: SideBarProps) {
  return (
    <SideBarStyled>
      <Row>
        <Col span={24}>
          <RoomList listNotifyMessage={listNotifyMessage} />
        </Col>
      </Row>
    </SideBarStyled>
  );
}
