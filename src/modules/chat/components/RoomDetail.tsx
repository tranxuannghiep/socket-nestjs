import { Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSockets } from "../pages/SocketProvider";

export interface RoomDetailProps {
  room: any;
  dataLastMessage: any;
}

const LinkStyled = styled(Typography.Link)`
  display: flex;
  align-items: center;
  padding: 10px;
  color: #fff;
  transition: all 0.3s;
  &:hover {
    background-color: rgba(204, 204, 204, 0.2);
    border-radius: 10px;
  }
  .name-room {
    color: #fff;
  }

  .last-message-wrapped {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .last-message {
      color: #fff;
      opacity: 0.7;
      display: block;
      &.unread-message {
        color: #3498db;
        font-weight: 500;
        opacity: 1;
      }
    }
    .notify {
      width: 20px;
      height: 20px;
      background-color: #1abc9c;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      .unread-count {
        color: #fff;
        font-size: 13px;
        font-weight: 500;
      }
    }
  }
`;
const userId = localStorage.getItem("userId") || "";

export function RoomDetail({ room, dataLastMessage }: RoomDetailProps) {
  const navigate = useNavigate();
  const [lastMessage, setLastMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [sender, setSender] = useState("You");
  const { socket } = useSockets();

  useEffect(() => {
    setUnreadCount(room.joinedRooms?.[0]?.unreadCount || 0);
    setLastMessage(room.messages[0]?.text || "");
    if (room.messages?.[0]?.user?.id === Number(userId)) {
      setSender("You");
    } else {
      setSender(room.messages?.[0]?.user?.lastname);
    }
  }, [room]);

  useEffect(() => {
    if (dataLastMessage) {
      setUnreadCount(
        dataLastMessage.unreadCountList.find(
          (list: any) => list.user?.id === Number(userId)
        ).unreadCount
      );
      setLastMessage(dataLastMessage.lastMessage.text);
      if (dataLastMessage.lastMessage?.user?.id === Number(userId)) {
        setSender("You");
      } else setSender(dataLastMessage.lastMessage?.user?.lastname);
    }
  }, [dataLastMessage]);

  useEffect(() => {
    if (socket) {
      socket.emit("getNotifyToRoom", room.id);
    }

    return () => {
      if (socket) {
        socket.emit("leaveToRoom", room.id);
      }
    };
  }, [socket, room]);

  return (
    <LinkStyled onClick={() => navigate(`/chat/${room.id}`)}>
      <div>
        <img
          width={50}
          style={{ borderRadius: "50%", marginRight: 10 }}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&usqp=CAU"
          alt=""
        />
      </div>
      <div style={{ flex: 1 }}>
        <Typography.Text className="name-room">{room.name}</Typography.Text>
        <div className="last-message-wrapped">
          <Typography.Text
            className={`last-message ${unreadCount > 0 && "unread-message"}`}
          >
            {`${sender}: ${lastMessage}`}
          </Typography.Text>

          {unreadCount > 0 && (
            <div className="notify">
              <span className="unread-count">{unreadCount}</span>
            </div>
          )}
        </div>
      </div>
    </LinkStyled>
  );
}
