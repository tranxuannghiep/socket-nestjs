import { Col, Row } from "antd";
import { ReactElement, useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { useSockets } from "./SocketProvider";

export interface LayoutChatProps {
  children?: ReactElement;
}

export default function LayoutChat({ children }: LayoutChatProps) {
  const { socket } = useSockets();
  const [listNotifyMessage, setListNotifyMessage] = useState<any>({});
  useEffect(() => {
    if (socket) {
      socket.on("notifyMessage", (data) => {
        console.log(data);

        const { roomId, ...dataNotify } = data;
        setListNotifyMessage({
          ...listNotifyMessage,
          [roomId]: {
            ...dataNotify,
          },
        });
      });

      const userId = localStorage.getItem("userId") || "";

      socket.on("clearNotify", (roomId) => {
        if (!listNotifyMessage[roomId]) return;

        setListNotifyMessage({
          ...listNotifyMessage,
          [roomId]: {
            ...listNotifyMessage[roomId],
            unreadCountList: listNotifyMessage[roomId].unreadCountList.map(
              (data: any) => {
                if (data.id === Number(userId))
                  return { ...data, unreadCount: 0 };
                return data;
              }
            ),
          },
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("notifyMessage");
        socket.off("clearNotify");
      }
    };
  }, [listNotifyMessage, socket]);
  return (
    <Row>
      <Col span={6}>
        <SideBar listNotifyMessage={listNotifyMessage} />
      </Col>
      <Col span={18}>{children}</Col>
    </Row>
  );
}
