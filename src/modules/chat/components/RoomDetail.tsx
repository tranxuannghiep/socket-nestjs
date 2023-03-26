import { Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import io from "socket.io-client";

export interface RoomDetailProps {
  room: any;
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
const SOCKET_URL = "http://localhost:5000";
export function RoomDetail({ room }: RoomDetailProps) {
  const navigate = useNavigate();
  const [lastMessage, setLastMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [sender, setSender] = useState("You");

  useEffect(() => {
    setUnreadCount(room.joinedRooms?.[0]?.unreadCount || 0);
    setLastMessage(room.messages[0]?.text || "");
    if (room.messages?.[0]?.user?.id === Number(userId)) {
      setSender("You");
    } else {
      setSender(room.messages?.[0]?.user?.lastname);
    }
  }, [room]);

  const socket = useMemo(() => {
    return io(SOCKET_URL, {
      transports: ["websocket"],
      query: {
        roomId: room.id,
      },
      withCredentials: true,
    });
  }, [room.id]);

  useEffect(() => {
    if (socket) {
      // server gửi sự kiện newMessage
      socket.on("notifyMessage", (data) => {
        setUnreadCount(
          data.unreadCountList.find(
            (list: any) => list.user?.id === Number(userId)
          ).unreadCount
        );
        setLastMessage(data.lastMessage.text);
        if (data.lastMessage?.user?.id === Number(userId)) {
          setSender("You");
        } else setSender(data.lastMessage?.user?.lastname);
      });

      socket.on("clearNotify", () => {
        setUnreadCount(0);
      });
    }

    return () => {
      if (socket) {
        socket.off("notifyMessage");
        socket.off("clearNotify");
        socket.disconnect();
      }
    };
  }, [socket]);

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
