import React from 'react';
const AWS = require('aws-sdk');

const InputImage = ({ value, handleChange, label, name }: any) => {
  const handleUpload = (e: any) => {
    e.preventDefault();

    if (!e.target.files.length) {
      return alert('파일을 선택해주세요');
    }

    const today = new Date();
    const file = e.target.files[0];
    const fileName =
      today.getFullYear().toString() +
      (today.getMonth() + 1).toString() +
      today.getDate().toString() +
      today.getHours().toString() +
      today.getMinutes().toString() +
      today.getSeconds().toString() +
      file.name;

    const albumBucketName = process.env.AWS_S3_BUCKET_NAME;
    const bucketRegion = process.env.AWS_REGION;
    const IdentityPoolId = process.env.AWS_IDPOOL_ID;

    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId,
      }),
    });

    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: albumBucketName },
    });

    var albumPhotosKey =
      encodeURIComponent('images') + '/' + encodeURIComponent('products') + '/';

    var photoKey = albumPhotosKey + fileName;
    s3.upload(
      {
        Key: photoKey,
        Body: file,
        ACL: 'public-read',
      },
      function (err: any, data: any) {
        if (err) {
          return alert('업로드에 문제가 발생하였습니다: ' + err.message);
        }
        alert('업로드에 성공하였습니다.');
        handleChange(name, data.Location);
      }
    );
  };

  return (
    <>
      <div className="font-bold text-gray-600 text-sm">{label}</div>
      <input type="file" name={name} accept="image/*" onChange={handleUpload} />
      <div
        className="w-32 h-32 block rounded-md border border-gray-400 mt-4"
        style={{
          backgroundImage: `url('${value}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </>
  );
};

export default InputImage;
