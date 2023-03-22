import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Collapse } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { RoomDetail } from "./RoomDetail";

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }
    .ant-collapse-content-box {
      padding: 0 20px;
    }

    .add-room {
      padding: 0;
      color: white;
    }
  }
`;

export default function RoomList() {
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
          <RoomDetail key={room.id} room={room} />
        ))}
        <Button type="text" icon={<PlusSquareOutlined />} className="add-room">
          Thêm phòng
        </Button>
      </PanelStyled>
    </Collapse>
  );
}
