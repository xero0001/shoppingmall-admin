import React, { useRef } from 'react';
const AWS = require('aws-sdk');

const InputImage = ({
  value,
  handleChange = () => {},
  onChange = null,
  label,
  name,
  size = 'medium',
}: any) => {
  const imageRef: any = useRef();

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
    const bucketRegion = process.env.AWS_REGION_STRING;
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

        if (onChange === null) {
          handleChange(name, data.Location);
        } else {
          onChange(data.Location);
        }
      }
    );
  };

  return (
    <>
      {label !== '' && (
        <div className="font-bold text-gray-600 text-sm">{label}</div>
      )}
      <input
        className="hidden"
        type="file"
        name={name}
        accept="image/*"
        value=""
        onChange={handleUpload}
        ref={imageRef}
      />
      <div
        className={`group ${size === 'medium' && 'w-32 h-32'} ${
          size === 'small' && 'w-10 h-10'
        } block rounded-md border border-gray-400 cursor-pointer text-gray-400 hover:text-gray-600 flex justify-center items-center`}
        style={{
          backgroundImage: `url('${value}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={() => imageRef.current.click()}
      >
        <svg
          width={size === 'medium' ? '24' : size === 'small' ? '16' : '32'}
          height={size === 'medium' ? '24' : size === 'small' ? '16' : '32'}
          viewBox="0 0 24 24"
          className={`fill-current cursor-pointer transition duration-100 ease-in-out ${
            value !== '' && 'opacity-50'
          }`}
        >
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"></path>
        </svg>
      </div>
    </>
  );
};

export default InputImage;
