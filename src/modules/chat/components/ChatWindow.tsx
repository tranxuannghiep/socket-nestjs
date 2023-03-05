import { UserAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, Tooltip } from "antd";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import Message, { MessageProps } from "./Message";
import YourMessage from "./YourMessage";

const access_token = localStorage.getItem("access_token") || "";
const userId = localStorage.getItem("userId") || "";

const SOCKET_URL = "http://localhost:5000";
const socket = io(SOCKET_URL, {
  query: {
    displayName: "Nguyen Van An",
    photoUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOElPZMl3h8mw0lNb6REcmFn_eMfv5BAfv9Q&usqp=CAU",
  },
  extraHeaders: {
    token: access_token,
  },
});

const WrapperStyled = styled.div`
  height: 100vh;
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__desc {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;
const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

export default function ChatWindow() {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      socket.disconnect();
    });

    // server gủi sự kiện getAll message => thường là lúc bắt đầu vào
    socket.on("allMessages", (data) => {
      setAllMessages(data);
    });

    // server gửi sự kiện newMessage
    socket.on("newMessage", (message) => {
      setAllMessages((prevMessages) => [...prevMessages, message]);
    });

    // server reply riêng
    socket.on("reply", (message) => {
      console.log(message);
    });
  }, []);

  const handleSend = () => {
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <WrapperStyled>
      <HeaderStyled>
        <div className="header__info">
          <p className="header__title">Room 1</p>
          <span className="header__desc">Day la room 1</span>
        </div>
        <ButtonGroupStyled>
          <Button icon={<UserAddOutlined />} type="text">
            Mời
          </Button>
          <Avatar.Group maxCount={2} size="small">
            <Tooltip title={"A"}>
              <Avatar>A</Avatar>
            </Tooltip>
            <Tooltip title={"B"}>
              <Avatar>B</Avatar>
            </Tooltip>
            <Tooltip title={"C"}>
              <Avatar>C</Avatar>
            </Tooltip>
            <Tooltip title={"D"}>
              <Avatar>D</Avatar>
            </Tooltip>
          </Avatar.Group>
        </ButtonGroupStyled>
      </HeaderStyled>
      <ContentStyled>
        <MessageListStyled>
          {allMessages.map((data, idx) =>
            data.userId?.toString() !== userId ? (
              <Message
                key={idx}
                text={data.text}
                photoUrl={data.photoUrl || null}
                displayName={data.displayName}
                createAt={data.createAt}
              />
            ) : (
              <YourMessage text={data.text} />
            )
          )}
        </MessageListStyled>
        <FormStyled>
          <Form.Item>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn ..."
              bordered={false}
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
          </Form.Item>
          <Button type="primary" onClick={handleSend}>
            Gửi
          </Button>
        </FormStyled>
      </ContentStyled>
    </WrapperStyled>
  );
}
