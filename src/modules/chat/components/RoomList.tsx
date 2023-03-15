import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Collapse, Typography } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }
    .ant-collapse-content-box {
      padding: 0 40px;
    }

    .add-room {
      padding: 0;
      color: white;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: #fff;
`;

export default function RoomList() {
  const navigate = useNavigate();
  const [listRoom, setListRoom] = useState<any[]>([]);

  const getListRoom = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/room/all", {
      withCredentials: true,
    });

    setListRoom(res.data);
  }, []);

  useEffect(() => {
    getListRoom();
  }, [getListRoom]);

  return (
    <Collapse ghost defaultActiveKey={["1"]}>
      <PanelStyled header="Danh sách các phòng" key="1">
        {listRoom.map((room) => (
          <LinkStyled
            key={room.id}
            onClick={() => navigate(`/chat/${room.id}`)}
          >
            {room.name}
          </LinkStyled>
        ))}
        <Button type="text" icon={<PlusSquareOutlined />} className="add-room">
          Thêm phòng
        </Button>
      </PanelStyled>
    </Collapse>
  );
}
