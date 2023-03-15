import AWS from "aws-sdk";
import path from "path-browserify";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3Client = new AWS.S3();

export const uploadFile = async (file: File) => {
  const key = "image-" + Date.now() + path.extname(file.name);

  const res = await s3Client
    .upload({
      Bucket: process.env.REACT_APP_AWS_PUBLIC_BUCKET_NAME || "",
      Key: key,
      Body: file,
      ACL: "public-read",
      ContentType: file.type,
    })
    .promise();
  return res;
};
