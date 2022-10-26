const multer = require('multer');
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;

const s3 = (process.env.NODE_ENV == "development") ?
  new AWS.S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })
  :
  new AWS.S3();

const storage = multer.memoryStorage();

export const upload = multer({ storage });

export const uploadFile = (file: any, fileType: any, fileName: any) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${fileName}.${fileType}`,
    ContentType: 'image/png',
    ACL: "public-read",
    Body: file.buffer
  };
  s3.upload(params, (error: any, data: any) => {
    if (error) {
      console.log(error);
    }
    console.log({ data });
  });
};
