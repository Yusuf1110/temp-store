import { Button, Image, Progress, Upload, message, Slider } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import "./App.css";

const { Dragger } = Upload;

function App() {
  const timer = useRef(null);
  const timer2 = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState("empty");
  const [imageUrl, setImageUrl] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const handleChange = ({ file, fileList }) => {
    const { status } = file;
    if (status === "uploading") {
      handleUploadProcess(file);
    }
  };

  const handleUploadProcess = (file) => {
    let percent = 0;
    if (timer.current) {
      return;
    }
    timer.current = setInterval(() => {
      setFileList([
        {
          name: file.name,
          status: percent >= 100 ? "done" : "uploading",
          percent: percent,
          uid: file.uid,
          url: window.URL.createObjectURL(file.originFileObj),
        },
      ]);
      if (percent >= 100) {
        message.success("上传成功");
        clearInterval(timer.current);
        timer.current = null;
      }
      percent += 10;
    }, 100);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined style={{ fontSize: 32 }} />
      <div style={{ marginTop: 8, fontSize: 16 }}>上传图片</div>
    </button>
  );

  const imageHandler = (file) => {
    setStatus("uploading");
    if (timer2.current) {
      clearInterval(timer2.current);
    }
    let cur = 0;
    timer2.current = setInterval(() => {
      setPercent(++cur);
      if (cur >= 100) {
        setStatus("done");
        setImageUrl(require("../public/images/" + "r-" + file.name));
        clearInterval(timer2.current);
        timer2.current = null;
      }
    }, 40);
  };

  return (
    <div className="App">
      <div className="header">
        <div className="title">DehazeCDM</div>
      </div>
      <div className="content">
        <div className="container">
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: !!previewImage,
                onVisibleChange: (visible) => !visible && setPreviewImage(""),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
          <div className={"upload-container"}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={() => {
                setPreviewImage(fileList[0].url);
              }}
              onChange={handleChange}
              onRemove={() => {
                setFileList([]);
                setImageUrl("");
                setPercent(0);
                setStatus("empty");
                setPreviewImage("");
              }}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <div className="action-title">输入有雾图像</div>
            <div className="action">
              <div className="slider-container">
                <span>保真度</span>
                <Slider defaultValue={50} style={{ width: 282, margin: "6px 12px" }} />
                <span>真实感</span>
              </div>
              <Button
                type="primary"
                onClick={() => {
                  if (fileList.length > 0) {
                    imageHandler(fileList[0]);
                  } else {
                    message.error("请先上传图片");
                  }
                }}
                style={{ width: 100 }}
              >
                提交
              </Button>
            </div>
          </div>
          <div className="record-container">
            <div className="image-container">
              {status === "done" && <Image style={{ width: "382px", height: "382px", objectFit: "contain" }} src={imageUrl} />}
              {status === "uploading" && <LoadingOutlined />}
              {status === "empty" && "请先上传图片"}
            </div>
            <div className="action-title">去雾结果</div>
            <div className="action">
              <div className="slider-container">
                <Progress percent={percent} style={{ width: 400 }} />
              </div>
              <Button type="primary" style={{ width: 100 }}>
                保存
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
