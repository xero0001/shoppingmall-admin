import React, { useRef } from 'react';
const AWS = require('aws-sdk');

import { RemirrorProvider, useRemirror } from 'remirror/react';

const Menu = () => {
  const { commands, active } = useRemirror({ autoUpdate: true });

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
        commands.insertImage({
          src: data.Location,
          width: '100%',
          align: 'center',
        });
      }
    );
  };

  return (
    <div className="menu border-b-2 border-gray-400 px-4 py-2 rounded-t-md">
      <button
        onClick={() => commands.toggleBold()}
        className={`${
          active.bold() ? 'text-black' : 'text-gray-600'
        } hover:text-black`}
        style={{ color: active.bold() ? 'bold' : undefined }}
        type="button"
      >
        <svg
          fill="currentColor"
          preserveAspectRatio="xMidYMid meet"
          height="1rem"
          width="1rem"
          aria-hidden="true"
          viewBox="0 0 384 512"
        >
          <path d="M333.49 238a122 122 0 0027-65.21C367.87 96.49 308 32 233.42 32H34a16 16 0 00-16 16v48a16 16 0 0016 16h31.87v288H34a16 16 0 00-16 16v48a16 16 0 0016 16h209.32c70.8 0 134.14-51.75 141-122.4 4.74-48.45-16.39-92.06-50.83-119.6zM145.66 112h87.76a48 48 0 010 96h-87.76zm87.76 288h-87.76V288h87.76a56 56 0 010 112z"></path>
        </svg>
      </button>
      <button
        onClick={() => commands.toggleItalic()}
        className={`${
          active.italic() ? 'text-black' : 'text-gray-600'
        } ml-3 hover:text-black`}
        type="button"
      >
        <svg
          fill="currentColor"
          preserveAspectRatio="xMidYMid meet"
          height="1em"
          width="1em"
          aria-hidden="true"
          viewBox="0 0 320 512"
        >
          <path d="M320 48v32a16 16 0 01-16 16h-62.76l-80 320H208a16 16 0 0116 16v32a16 16 0 01-16 16H16a16 16 0 01-16-16v-32a16 16 0 0116-16h62.76l80-320H112a16 16 0 01-16-16V48a16 16 0 0116-16h192a16 16 0 0116 16z"></path>
        </svg>
      </button>
      <button
        onClick={() => commands.toggleUnderline()}
        className={`${
          active.underline() ? 'text-black' : 'text-gray-600'
        } ml-3 hover:text-black`}
        type="button"
      >
        <svg
          fill="currentColor"
          preserveAspectRatio="xMidYMid meet"
          height="1em"
          width="1em"
          aria-hidden="true"
          viewBox="0 0 448 512"
        >
          <path d="M32 64h32v160c0 88.22 71.78 160 160 160s160-71.78 160-160V64h32a16 16 0 0016-16V16a16 16 0 00-16-16H272a16 16 0 00-16 16v32a16 16 0 0016 16h32v160a80 80 0 01-160 0V64h32a16 16 0 0016-16V16a16 16 0 00-16-16H32a16 16 0 00-16 16v32a16 16 0 0016 16zm400 384H16a16 16 0 00-16 16v32a16 16 0 0016 16h416a16 16 0 0016-16v-32a16 16 0 00-16-16z"></path>
        </svg>
      </button>
      <div className="inline-block ml-6">
        <input
          type="file"
          name="insertImage"
          accept="image/*"
          value=""
          onChange={handleUpload}
          className="hidden"
          ref={imageRef}
        />
        <svg
          fill="currentColor"
          preserveAspectRatio="xMidYMid meet"
          height="1em"
          width="1.5em"
          aria-hidden="true"
          viewBox="0 0 448 512"
          className="text-gray-600 cursor-pointer hover:text-black"
          onClick={() => imageRef.current.click()}
        >
          <path d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80V80c0-26.51-21.49-48-48-48H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h384c26.51 0 48-21.49 48-48zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515c4.686-4.686 12.284-4.686 16.971 0L512 208v112H160v-48z" />
        </svg>
      </div>
    </div>
  );
};

const RemirrorWrapper = ({
  label,
  name,
  value,
  manager,
  handleChange,
}: any) => {
  return (
    <>
      <div className="font-bold text-gray-600 text-sm">{label as string}</div>
      <style global jsx>{`
        .ProseMirror {
          position: relative;
        }

        .ProseMirror {
          word-wrap: break-word;
          white-space: pre-wrap;
          white-space: break-spaces;
          -webkit-font-variant-ligatures: none;
          font-variant-ligatures: none;
          font-feature-settings: 'liga' 0; /* the above doesn't seem to work in Edge */
        }

        .ProseMirror pre {
          white-space: pre-wrap;
        }

        .ProseMirror li {
          position: relative;
        }

        .ProseMirror-hideselection *::selection {
          background: transparent;
        }
        .ProseMirror-hideselection *::-moz-selection {
          background: transparent;
        }
        .ProseMirror-hideselection {
          caret-color: transparent;
        }

        .ProseMirror-selectednode {
          outline: 2px solid #8cf;
        }

        /* Make sure li selections wrap around markers */

        li.ProseMirror-selectednode {
          outline: none;
        }

        li.ProseMirror-selectednode:after {
          content: '';
          position: absolute;
          left: -32px;
          right: -2px;
          top: -2px;
          bottom: -2px;
          border: 2px solid #8cf;
          pointer-events: none;
        }
        .ProseMirror-textblock-dropdown {
          min-width: 3em;
        }

        .ProseMirror-menu {
          margin: 0 -4px;
          line-height: 1;
        }

        .ProseMirror-tooltip .ProseMirror-menu {
          width: -webkit-fit-content;
          width: fit-content;
          white-space: pre;
        }

        .ProseMirror-menuitem {
          margin-right: 3px;
          display: inline-block;
        }

        .ProseMirror-menuseparator {
          border-right: 1px solid #ddd;
          margin-right: 3px;
        }

        .ProseMirror-menu-dropdown,
        .ProseMirror-menu-dropdown-menu {
          font-size: 90%;
          white-space: nowrap;
        }

        .ProseMirror-menu-dropdown {
          vertical-align: 1px;
          cursor: pointer;
          position: relative;
          padding-right: 15px;
        }

        .ProseMirror-menu-dropdown-wrap {
          padding: 1px 0 1px 4px;
          display: inline-block;
          position: relative;
        }

        .ProseMirror-menu-dropdown:after {
          content: '';
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid currentColor;
          opacity: 0.6;
          position: absolute;
          right: 4px;
          top: calc(50% - 2px);
        }

        .ProseMirror-menu-dropdown-menu,
        .ProseMirror-menu-submenu {
          position: absolute;
          background: white;
          color: #666;
          border: 1px solid #aaa;
          padding: 2px;
        }

        .ProseMirror-menu-dropdown-menu {
          z-index: 15;
          min-width: 6em;
        }

        .ProseMirror-menu-dropdown-item {
          cursor: pointer;
          padding: 2px 8px 2px 4px;
        }

        .ProseMirror-menu-dropdown-item:hover {
          background: #f2f2f2;
        }

        .ProseMirror-menu-submenu-wrap {
          position: relative;
          margin-right: -4px;
        }

        .ProseMirror-menu-submenu-label:after {
          content: '';
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-left: 4px solid currentColor;
          opacity: 0.6;
          position: absolute;
          right: 4px;
          top: calc(50% - 4px);
        }

        .ProseMirror-menu-submenu {
          display: none;
          min-width: 4em;
          left: 100%;
          top: -3px;
        }

        .ProseMirror-menu-active {
          background: #a0aec0;
          color: white;
          border-radius: 4px;
        }

        .ProseMirror-menu-disabled {
          opacity: 0.3;
        }

        .ProseMirror-menu-submenu-wrap:hover .ProseMirror-menu-submenu,
        .ProseMirror-menu-submenu-wrap-active .ProseMirror-menu-submenu {
          display: block;
        }

        .ProseMirror-menubar {
          border-top-left-radius: inherit;
          border-top-right-radius: inherit;
          position: relative;
          min-height: 1em;
          color: #718096;
          padding: 1px 6px;
          top: 0;
          left: 0;
          right: 0;
          border-bottom: 1px solid #cbd5e0;
          background: white;
          z-index: 10;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          overflow: visible;
        }

        .ProseMirror-icon {
          display: inline-block;
          line-height: 0.8;
          vertical-align: -2px; /* Compensate for padding */
          padding: 2px 8px;
          cursor: pointer;
        }

        .ProseMirror-menu-disabled.ProseMirror-icon {
          cursor: default;
        }

        .ProseMirror-icon svg {
          fill: currentColor;
          height: 1em;
        }

        .ProseMirror-icon span {
          vertical-align: text-top;
        }
        .ProseMirror-gapcursor {
          display: none;
          pointer-events: none;
          position: absolute;
        }

        .ProseMirror-gapcursor:after {
          content: '';
          display: block;
          position: absolute;
          top: -2px;
          width: 20px;
          border-top: 1px solid black;
          animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
        }

        @keyframes ProseMirror-cursor-blink {
          to {
            visibility: hidden;
          }
        }

        .ProseMirror-focused .ProseMirror-gapcursor {
          display: block;
        }
        /* Add space around the hr to make clicking it easier */

        .ProseMirror-example-setup-style hr {
          padding: 2px 10px;
          border: none;
          margin: 1em 0;
        }

        .ProseMirror-example-setup-style hr:after {
          content: '';
          display: block;
          height: 1px;
          background-color: silver;
          line-height: 2px;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 30px;
        }

        .ProseMirror blockquote {
          padding-left: 1em;
          border-left: 3px solid #eee;
          margin-left: 0;
          margin-right: 0;
        }

        .ProseMirror-example-setup-style img {
          cursor: default;
        }

        .ProseMirror-prompt {
          background: white;
          padding: 5px 10px 5px 15px;
          border: 1px solid silver;
          position: fixed;
          border-radius: 3px;
          z-index: 11;
          box-shadow: -0.5px 2px 5px rgba(0, 0, 0, 0.2);
        }

        .ProseMirror-prompt h5 {
          margin: 0;
          font-weight: normal;
          font-size: 100%;
          color: #444;
        }

        .ProseMirror-prompt input[type='text'],
        .ProseMirror-prompt textarea {
          background: #eee;
          border: none;
          outline: none;
        }

        .ProseMirror-prompt input[type='text'] {
          padding: 0 4px;
        }

        .ProseMirror-prompt-close {
          position: absolute;
          left: 2px;
          top: 1px;
          color: #666;
          border: none;
          background: transparent;
          padding: 0;
        }

        .ProseMirror-prompt-close:after {
          content: '✕';
          font-size: 12px;
        }

        .ProseMirror-invalid {
          background: #ffc;
          border: 1px solid #cc7;
          border-radius: 4px;
          padding: 5px 10px;
          position: absolute;
          min-width: 10em;
        }

        .ProseMirror-prompt-buttons {
          margin-top: 5px;
          display: none;
        }
        #editor,
        .editor {
          background: white;
          color: black;
          background-clip: padding-box;
          border-radius: 4px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          padding: 5px 0;
          margin-bottom: 23px;
        }

        .ProseMirror p:first-child,
        .ProseMirror h1:first-child,
        .ProseMirror h2:first-child,
        .ProseMirror h3:first-child,
        .ProseMirror h4:first-child,
        .ProseMirror h5:first-child,
        .ProseMirror h6:first-child {
          margin-top: 10px;
        }

        .ProseMirror {
          padding: 8px 16px 8px 16px;
          line-height: 1.2;
          outline: none;
        }

        .menu {
          position: sticky;
          background-color: white;
          top: 0;
          z-index: 10;
        }

        .menu button:focus {
          outline: none;
        }

        .ProseMirror p {
          margin-bottom: 1em;
        }

        .ProseMirror h1 {
          font-size: 32px;
          margin-bottom: 0.8em;
        }

        .ProseMirror h2 {
          font-size: 24px;
          margin-bottom: 0.8em;
        }

        .ProseMirror a {
          color: rgb(245, 92, 137);
          text-decoration: underline;
        }
      `}</style>
      <RemirrorProvider
        manager={manager}
        value={value}
        onChange={(parameter: any) => {
          handleChange(name, parameter.state);
        }}
      >
        <div className="rounded-md border border-gray-400">
          <Menu />
          <Editor />
        </div>
      </RemirrorProvider>
    </>
  );
};

const Editor = (): JSX.Element => {
  const { getRootProps } = useRemirror();

  return <div {...getRootProps()} />;
};

export default RemirrorWrapper;
