import { Routes } from "@/interfaces/routes";
import { Router } from "express";

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

const upload = multer({ storage }).single('image');

export class AwsRoute implements Routes {
  public path = "/v1/aws";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.post(
      "/upload", upload, (req: any, res) => {

        let myFile = req.file.originalname.split(".");
        const fileType = myFile[myFile.length - 1];
        const fileName = uuid();

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${fileName}.${fileType}`,
          ContentType: 'image/png',
          ACL: "public-read",
          Body: req.file.buffer
        };

        s3.upload(params, (error: any, data: any) => {
          if (error) {
            res.status(500).send(error);
          }
          res.status(200).send({ url: data?.Location });
        });
      });

    this.router.post(
      "/upload-video", upload, (req: any, res) => {

        let myFile = req.file.originalname.split(".");
        const fileType = myFile[myFile.length - 1];
        const fileName = uuid();

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${fileName}.${fileType}`,
          ContentType: 'video/mp4',
          ACL: "public-read",
          Body: req.file.buffer
        };

        s3.upload(params, (error: any, data: any) => {
          if (error) {
            res.status(500).send(error);
          }
          res.status(200).send({ url: data?.Location });
        });
      });
  }
}
