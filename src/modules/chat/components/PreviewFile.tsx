import { CloseOutlined } from "@ant-design/icons";
import * as React from "react";
import styled from "styled-components";
import { FileInterface } from "./ChatWindow";
import { RenderPreviewFile } from "./RenderPreviewFile";

export interface PreviewFileProps {
  listFile: FileInterface[];
  setListFile: React.Dispatch<React.SetStateAction<FileInterface[]>>;
}

const PreviewStyled = styled.div`
  display: flex;
  overflow-x: auto;
  padding-top: 15px;
  .file {
    margin-right: 15px;
    position: relative;
    .close {
      position: absolute;
      top: -6px;
      right: -6px;
      cursor: pointer;
      background: #3e4042;
      border-radius: 50%;
      padding: 4px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export function PreviewFile({ listFile, setListFile }: PreviewFileProps) {
  const handleRemoveFile = (id: string) => {
    const idx = listFile.findIndex((val) => val.id === id);
    setListFile([...listFile.slice(0, idx), ...listFile.slice(idx + 1)]);
  };
  return (
    <PreviewStyled>
      {listFile.map((val) => (
        <div className="file" key={val.id}>
          <RenderPreviewFile
            file={val.file}
            type={val.type}
            file_name={val.file_name}
          />
          <div className="close" onClick={() => handleRemoveFile(val.id)}>
            <CloseOutlined style={{ fontSize: 12, color: "#fff" }} />
          </div>
        </div>
      ))}
    </PreviewStyled>
  );
}
