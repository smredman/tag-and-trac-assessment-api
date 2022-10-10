import { RequestHandler } from "express"
import multer from 'multer';
import multerS3 from 'multer-s3';
import { Config } from "../../constants/config";
import { v4 as fileName } from 'uuid';
import path from "path";
import S3 from 'aws-sdk/clients/s3';
import { v4 } from 'uuid';

export enum StorageType {
    Disk = "disk",
    S3 = "s3"
}

const createDiskStorage = () => {
    const dest = Config.files.Disk.TempDir;
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            console.log(file);
            cb(null, dest);
        },
        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname);
            const fn = fileName();
            cb(null, `${fn}.${extension}`);
        }
    });
    return storage;
};

const createS3Storage = () => {
    const s3 = new S3({
        credentials: {
            accessKeyId: Config.files.S3.AccessKeyId,
            secretAccessKey: Config.files.S3.SecretAccessKey
        }
    });

    const storage = multerS3({
        s3: s3,
        bucket: Config.files.S3.Bucket,
        acl: Config.files.S3.ACL,
        key: (req, file, cb) => {
            const ext = path.parse(file.originalname).ext;
            cb(null, `${v4()}${ext}`);
        }
    });

    return storage;
};

export const fileUpload = (mimes: string[] = [], maxCount: number = 1, storageType: StorageType = StorageType.Disk, fieldName?: string): RequestHandler => {
    const field = fieldName || Config.files.Disk.FieldName;
    const storage = storageType === StorageType.Disk ? createDiskStorage() : createS3Storage();
    const fileFilter = (req, file, cb) => {
        if (mimes.length > 0 && !mimes.includes(file.mimetype)) {
            cb(null, false);
        }
        cb(null, true);
    };
    const uploadHandler = multer({
        storage: storage,
        fileFilter: fileFilter
    });
    
    return uploadHandler.array(field, maxCount);
};