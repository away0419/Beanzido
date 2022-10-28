import React, {
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useCallback,
  useEffect,
  ChangeEvent,
} from "react";
import { useRecoilState } from "recoil";
import { beanColorState } from "store/atom";
import useColor from "components/hooks/useColor";
import Webcam from "react-webcam";
import useRandomName from "components/hooks/useRandomName";
import BeanStyle from "components/BeanStyle/BeanStyle";

import "./CreateBean.scss";
import x from "../../assets/img/x.svg";
import Camera from "../../assets/img/Camera.svg";
import Img_box from "../../assets/img/Img_box.svg";
import 새로고침 from "../../assets/img/새로고침.svg";
import { SendMessage } from "react-use-websocket";

type createBeanProps = {
  setIsCreateBean: Dispatch<SetStateAction<boolean>>;
  sendMessage: SendMessage;
  latitude: number;
  longitude: number;
};

export default function CreateBean({
  setIsCreateBean,
  sendMessage,
  latitude,
  longitude,
}: createBeanProps) {
  const [isBeanStyle, setIsBeanStyle] = useState(false);
  const { name, setRandomName } = useRandomName(); // nickname
  const [contentValue, setContentValue] = useState(""); // content
  function onContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContentValue(e.currentTarget.value);
  }

  const [beanColor, setBeanColor] = useRecoilState(beanColorState);
  const [indexToColor] = useColor(); // color

  const [camera, setCamera] = useState(false);
  function OnCamera() {
    setCamera(true);
  }
  function cancelCamera() {
    setCamera(false);
  }
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState("");
  const WebcamCapture = () => {
    const capture = useCallback(() => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc ? imageSrc : "null");
      }
      cancelCamera();
    }, [webcamRef, setImgSrc]);
    return (
      <div className="camera">
        <Webcam
          className="webcam"
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
        <button onClick={capture}>촬영</button>
        <button onClick={cancelCamera}>취소</button>
      </div>
    );
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileUrl = e.target.files
      ? URL.createObjectURL(e.target.files[0])
      : "";
    setImgSrc(fileUrl);
  };

  // let today = new Date();

  // let year = today.getFullYear(); // 년도
  // let month = today.getMonth() + 1; // 월
  // let date = today.getDate(); // 날짜
  // let day = today.getDay(); // 요일
  // let hours = today.getHours(); // 시
  // let minutes = today.getMinutes(); // 분
  // let seconds = today.getSeconds(); // 초
  // let milliseconds = today.getMilliseconds(); // 밀리초
  // let time = `${year}/${month}/${date} - ${hours}:${minutes}:${seconds}:${milliseconds}`;

  function SaveBaen() {
    const beanInfo = {
      nickname: name,
      content: contentValue ? contentValue : "내용이 없습니다.",
      color: beanColor,
      img: imgSrc,
      // createdAt: time,
      latitude: latitude,
      longitude: longitude,
    };
    // console.log(beanInfo);
    sendMessage(JSON.stringify(beanInfo));
    setIsCreateBean(false);
  }

  return (
    <>
      <div
        className="create-bean-back"
        onClick={() => setIsCreateBean(false)}
      ></div>
      <div className="create-bean">
        <div className="header">
          <h2>글 작성</h2>
        </div>
        <img
          className="x"
          src={x}
          alt=""
          onClick={() => setIsCreateBean(false)}
        />
        <div className="content">
          <div className="name-style">
            <div className="name-refresh">
              <h4>{name}</h4>
              <p>님,</p>
              <img
                className="refresh"
                src={새로고침}
                alt=""
                onClick={setRandomName}
              />
            </div>
            <div className="style-button" onClick={() => setIsBeanStyle(true)}>
              <p>스타일 변경</p>
            </div>
          </div>
          {isBeanStyle && <BeanStyle setIsBeanStyle={setIsBeanStyle} />}
          <div className="message">
            <textarea
              onChange={onContentChange}
              value={contentValue}
              placeholder="전하고 싶은 메시지를 입력해주세요."
            />
          </div>
          {imgSrc ? (
            <div className="capture-box">
              <img
                className="capture"
                src={imgSrc}
                onClick={OnCamera}
                alt="캡쳐"
              />
            </div>
          ) : (
            <div className="camera-picture">
              <div className="camera-btn" onClick={OnCamera}>
                <img className="camera-img" src={Camera} alt="" />
                <div>
                  <h4>카메라(선택)</h4>
                  <p>사진 첨부 시 사진 촬영</p>
                </div>
              </div>
              <div>
                <input
                  id="picture"
                  type="file"
                  style={{ display: "none" }}
                  accept="image/jpg,image/png,image/jpeg,image/gif"
                  onChange={onFileChange}
                />
                <label htmlFor="picture" className="picture">
                  <img className="picture-img" src={Img_box} alt="" />
                  <div>
                    <h4>사진(선택)</h4>
                    <p>사진을 첨부할 수 있어요.</p>
                  </div>
                </label>
              </div>
            </div>
          )}
          <div className="finish-button" onClick={SaveBaen}>
            <h3>글 작성 완료</h3>
          </div>
        </div>
      </div>
      {camera && <WebcamCapture />}
    </>
  );
}
