import { PictureOutlined, UserAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, Tooltip } from "antd";
import axios from "axios";
import { differenceInMinutes, parseISO } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import styled from "styled-components";
import Message, { MessageProps } from "./Message";
import YourMessage from "./YourMessage";
import path from "path-browserify";
import { PreviewFile } from "./PreviewFile";

const userId = localStorage.getItem("userId") || "";

const SOCKET_URL = "http://localhost:5000";

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
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 10px; /* độ rộng của thanh cuộn */
    height: 10px; /* chiều cao của thanh cuộn */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px; /* bo tròn viền của thanh cuộn */
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 10px; /* bo tròn viền của vùng bị chiếm bởi thanh cuộn */
  }
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

const SendData = styled(PictureOutlined)`
  cursor: pointer;
  font-size: 24px;
  padding: 0 12px;
  border-right: 1px solid #ccc;
`;

export interface FileInterface {
  file: File;
  type: string;
  file_name: string;
}

export default function ChatWindow() {
  const [message, setMessage] = useState("");
  const refListMessage = useRef<HTMLDivElement>(null);
  const [allMessages, setAllMessages] = useState<MessageProps[]>([]);

  const [listFile, setListFile] = useState<FileInterface[]>([]);

  const { roomId } = useParams();

  const socket = useMemo(() => {
    return io(SOCKET_URL, {
      transports: ["websocket"],
      query: {
        roomId: roomId,
      },
      withCredentials: true,
    });
  }, [roomId]);

  useEffect(() => {
    if (refListMessage.current) {
      refListMessage.current.scrollTop = refListMessage.current.scrollHeight;
    }
  }, [allMessages]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to server");
      });

      // server gủi sự kiện getAll message => thường là lúc bắt đầu vào
      socket.on("allMessages", (data) => {
        setAllMessages(data);
      });

      // server gửi sự kiện newMessage
      socket.on("newMessage", (message) => {
        setAllMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("allMessages");
        socket.off("newMessage");
        socket.disconnect();
      }
    };
  }, [socket]);

  const handleSend = () => {
    socket.emit("message", { text: message });
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
        <MessageListStyled ref={refListMessage}>
          {allMessages.map((data, idx) =>
            data.user.id.toString() !== userId ? (
              <Message
                key={data.id}
                id={data.id}
                text={data.text}
                user={data.user}
                createdAt={data.createdAt}
                type={data.type}
                file_name={data.file_name}
                hiddenInfo={
                  idx > 0 && data.user.id === allMessages[idx - 1].user.id
                }
                hiddenDate={
                  idx > 0 &&
                  differenceInMinutes(
                    parseISO(allMessages[idx].createdAt),
                    parseISO(allMessages[idx - 1].createdAt)
                  ) < 5
                }
              />
            ) : (
              <YourMessage
                key={data.id}
                text={data.text}
                createdAt={data.createdAt}
                type={data.type}
                file_name={data.file_name}
                hiddenDate={
                  idx > 0 &&
                  differenceInMinutes(
                    parseISO(allMessages[idx].createdAt),
                    parseISO(allMessages[idx - 1].createdAt)
                  ) < 5
                }
              />
            )
          )}
        </MessageListStyled>
        <PreviewFile listFile={listFile} />
        <FormStyled>
          <label htmlFor="icon-button-file">
            <input
              id="icon-button-file"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={async (e) => {
                // const file = e.target.files?.[0];
                console.log(e.target.files);
                const files = e.target.files;
                if (files) {
                  const newFiles = Array.from(files).map((file) => ({
                    file: file,
                    type: file.type,
                    file_name: file.name,
                  }));
                  setListFile(newFiles);
                }
                // if (file) {
                //   const res = await axios.post("http://localhost:5000/upload", {
                //     bucket: process.env.REACT_APP_AWS_PUBLIC_BUCKET_NAME,
                //     key:
                //       path.parse(file.name).name +
                //       Date.now() +
                //       path.extname(file.name),
                //     contentType: file.type,
                //   });
                //   const { url, fields } = res.data;
                //   const formData = new FormData();
                //   for (const [name, value] of Object.entries(fields)) {
                //     formData.append(name, value as any);
                //   }
                //   formData.append("file", file);
                //   try {
                //     await axios.post(url, formData, {
                //       headers: {
                //         "Content-Type": "multipart/form-data",
                //       },
                //     });
                //     socket.emit("message", {
                //       text: `https://learn-nestjs.s3.ap-northeast-1.amazonaws.com/${fields.key}`,
                //       type: file.type,
                //       file_name: file.name,
                //     });
                //   } catch (error) {
                //     console.log(error);
                //   }
                // }
              }}
            />
            <SendData />
          </label>
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
