import * as React from "react";
import { DefaultExtensionType, defaultStyles, FileIcon } from "react-file-icon";
import path from "path-browserify";
import { Image, Typography } from "antd";

export interface FileRenderProps {
  type?: string;
  text: string;
  file_name?: string;
}

function downloadFile(e: any, url: string, filename: string) {
  e.preventDefault();
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(objectUrl);
    });
}

export function FileRender({ type, text, file_name }: FileRenderProps) {
  if (type) {
    if (type.includes("image")) {
      return <Image width={200} src={text} />;
    } else if (type.includes("audio")) {
      return <audio src={text} controls />;
    } else if (type.includes("video")) {
      return <video width={400} src={text} controls />;
    } else {
      const extension = path.extname(text).slice(1);
      return (
        <a
          className="file-icon"
          onClick={(e) => downloadFile(e, text, file_name || "")}
          href={text}
        >
          <FileIcon
            extension={extension}
            {...defaultStyles[extension as DefaultExtensionType]}
          />
          <Typography.Text className="file-name">{file_name}</Typography.Text>
        </a>
      );
    }
  }
  return <Typography.Text className="content">{text}</Typography.Text>;
}
