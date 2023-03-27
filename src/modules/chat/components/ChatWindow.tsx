import { PictureOutlined, UserAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, Tooltip } from "antd";
import axios from "axios";
import { differenceInMinutes, parseISO } from "date-fns";
import path from "path-browserify";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { useSockets } from "../pages/SocketProvider";
import Message, { MessageProps } from "./Message";
import { PreviewFile } from "./PreviewFile";
import YourMessage from "./YourMessage";

const userId = localStorage.getItem("userId") || "";

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
  padding: 12px;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;
  margin-top: 10px;
  border-radius: 15px;

  &.send-file-list {
    flex-direction: column;
    align-items: flex-start;
    .wrapped-file-list {
      display: flex;
      align-items: center;
      margin: 0 0 12px 12px;
      overflow: hidden;
      width: 100%;
      label {
        margin-top: 15px;
        margin-right: 10px;
        border: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        .icon-file {
          font-size: 40px;
          border-right: none;
          padding: 12px;
        }
      }
    }
  }

  .send-message {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const SendData = styled(PictureOutlined)`
  cursor: pointer;
  font-size: 24px;
  padding-right: 12px;
  border-right: 1px solid #ccc;
`;

export interface FileInterface {
  id: string;
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
  const { socket } = useSockets();

  useEffect(() => {
    if (refListMessage.current) {
      refListMessage.current.scrollTop = refListMessage.current.scrollHeight;
    }
  }, [allMessages]);

  useEffect(() => {
    if (socket) {
      if (roomId) socket.emit("connectToRoom", roomId);

      socket.on("allMessages", (data) => {
        setAllMessages(data);
      });

      socket.on("newMessage", (message) => {
        setAllMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off("allMessages");
        socket.off("newMessage");
        // socket.emit("leaveToRoom", roomId);
      }
    };
  }, [socket, roomId]);

  const handleSend = async () => {
    if (!socket) return;
    if (message) {
      socket.emit("message", { text: message, roomId });
    }
    if (listFile.length) {
      for (const data of listFile) {
        const res = await axios.post("http://localhost:5000/upload", {
          bucket: process.env.REACT_APP_AWS_PUBLIC_BUCKET_NAME,
          key:
            path.parse(data.file_name).name +
            Date.now() +
            path.extname(data.file_name),
          contentType: data.type,
        });
        const { url, fields } = res.data;
        const formData = new FormData();
        for (const [name, value] of Object.entries(fields)) {
          formData.append(name, value as any);
        }
        formData.append("file", data.file);
        try {
          await axios.post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          socket.emit("message", {
            text: `https://learn-nestjs.s3.ap-northeast-1.amazonaws.com/${fields.key}`,
            type: data.type,
            file_name: data.file_name,
            roomId,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    setMessage("");
    setListFile([]);
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
        <FormStyled className={listFile.length ? "send-file-list" : ""}>
          <div className="wrapped-file-list">
            <label htmlFor="icon-button-file">
              <input
                id="icon-button-file"
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={async (e) => {
                  const files = e.target.files;
                  if (files) {
                    const newFiles = Array.from(files).map((file) => ({
                      id: uuidv4(),
                      file: file,
                      type: file.type,
                      file_name: file.name,
                    }));
                    setListFile([...listFile, ...newFiles]);
                  }
                }}
                onClick={(event) => {
                  (event.target as HTMLInputElement).value = "";
                }}
              />
              <SendData className="icon-file" />
            </label>
            {listFile.length > 0 && (
              <PreviewFile listFile={listFile} setListFile={setListFile} />
            )}
          </div>
          <div className="send-message">
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
          </div>
        </FormStyled>
      </ContentStyled>
    </WrapperStyled>
  );
}
