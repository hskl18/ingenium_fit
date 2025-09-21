import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
// import { v4 as uuid } from 'uuid'

const options = {
  bucket: 'jzkangfu',
  region: 'us-west-1',
  successActionStatus: 201,
};

const client = new S3Client({
  credentials: {
    accessKeyId: 'AKIA3AJPPJXXVMBJHGMB',
    secretAccessKey: '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',
  },
  region: options.region,
});
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

const AWSHelper = {
  uploadFile: async function (file) {
    console.log(file);
    try {
      const fileKey = `uploads/${Date.now()}-${file.name}`;
      console.log('fileContent ====>', file);
      const res = await client.send(
        new PutObjectCommand({
          Body: await file.arrayBuffer(),
          Bucket: options.bucket,
          Key: fileKey,
        }),
      );
      console.log('Upload Complete', res);
      return {
        data: `https://${options.bucket}.s3.${options.region}.amazonaws.com/${fileKey}`,
      };
    } catch (error) {
      console.log('uploadFile error', error);
    }
  },
};

export default AWSHelper;
