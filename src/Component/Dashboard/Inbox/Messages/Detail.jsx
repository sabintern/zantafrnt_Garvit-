import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Avatar,
  Card,
  Button,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  Collapse,
  Spin,
  Tooltip,
  Progress,
} from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  DownloadOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import MusicPlayer from './Audio'
import "./MessageDetails.css";

const { Header, Content } = Layout;
const { Text, Title } = Typography;
const { Panel } = Collapse;

const MessageDetails = () => {
  const { currentMessage } = useSelector((state) => state.inbox);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentMessage) {
      setIsLoading(false);
    }
  }, [currentMessage]);

  useEffect(() => {
    if (audioRef.current) {
      const updateTime = () => setAudioCurrentTime(audioRef.current.currentTime);
      const audio = audioRef.current;

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("ended", () => setIsPlaying(false));

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
      };
    }
  }, [currentMessage?.callRecording?.audioPath]);

  // Stop current audio if the audio path changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      setAudioCurrentTime(0);
      setAudioDuration(0);
    }
  
    if (currentMessage?.callRecording?.audioPath) {
      const newAudio = new Audio(currentMessage.callRecording.audioPath);
      audioRef.current = newAudio;
  
      newAudio.onloadedmetadata = () => {
        setAudioDuration(newAudio.duration);
      };
  
      newAudio.addEventListener("timeupdate", () => {
        setAudioCurrentTime(newAudio.currentTime);
      });
  
      newAudio.addEventListener("ended", () => {
        setIsPlaying(false);
      });
  
      return () => {
        newAudio.pause();
        newAudio.removeEventListener("timeupdate", () => {});
        newAudio.removeEventListener("ended", () => {});
      };
    }
  }, [currentMessage?.callRecording?.audioPath]);
  

  const handlePlayPause = (audioPath) => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      const newAudio = new Audio(audioPath);
      newAudio.onloadedmetadata = () => {
        setAudioDuration(newAudio.duration);
      };
      newAudio.play();
      audioRef.current = newAudio;
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progress = clickPosition / progressBar.offsetWidth;
    if (audioRef.current) {
      audioRef.current.currentTime = progress * audioRef.current.duration;
      setAudioCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDownload = (audioPath) => {
    const link = document.createElement("a");
    link.href = audioPath;
    link.download = audioPath.split("/").pop() || "audio.mp3";
    link.click();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };
  const progressPercent = (audioCurrentTime / audioDuration) * 100 || 0;

  if (isLoading) {
    return (
      <Spin
        tip="Loading..."
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      />
    );
  }

  return (
    <Layout>
      <Header
        style={{
          background: "linear-gradient(90deg, #1890ff 0%, #1d39c4 100%)",
          color: "#fff",
          padding: "16px 24px",
          height: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space size={16} align="center">
          <Avatar size={48} style={{ backgroundColor: "#fff", color: "#1890ff" }}>
            {currentMessage.name?.slice(0, 1).toUpperCase() || "?"}
          </Avatar>
          <div>
            <Title level={5} style={{ margin: 0, color: "#fff" }}>
              {currentMessage.name || "Unknown Sender"}
            </Title>
          </div>
        </Space>
      </Header>

      <Content style={{ padding: 24, overflowY: "auto" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Text type="secondary">From</Text>
                <div>{currentMessage.from}</div>
              </Col>
              <Col xs={24} sm={12}>
                <Text type="secondary">To</Text>
                <div>{currentMessage.to}</div>
              </Col>
            </Row>

            <div>
              <Text type="secondary">Answered By</Text>
              <div>{currentMessage.answeredBy}</div>
            </div>

            <Card className="audio-player-card">
            <MusicPlayer currentMessage={currentMessage} />
          </Card>
            <Collapse accordion>
              <Panel header="Caller Information" key="1">
                {currentMessage.analysis?.structuredData &&
                  Object.entries(currentMessage.analysis?.structuredData).map(
                    ([key, value]) => (
                      <Row key={key} style={{ marginBottom: 8 }}>
                        <Col span={12}>
                          <Text strong>{key.trim()}:</Text>
                        </Col>
                        <Col span={12}>
                          <Text>{value}</Text>
                        </Col>
                      </Row>
                    )
                  )}
                {currentMessage.analysis && (
                  <Row style={{ marginBottom: 8 }}>
                    <Col span={12}>
                      <Text strong>Summary:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{currentMessage.analysis.summary}</Text>
                    </Col>
                  </Row>
                )}
              </Panel>
            </Collapse>

            <Collapse accordion>
              <Panel header={<span><SoundOutlined /> Transcript</span>} key="2">
                <div style={{ maxHeight: 300, overflowY: "auto", padding: "8px" }}>
                  {currentMessage?.transcript.split("\n").map((line, index) => {
                    const [speaker, ...textParts] = line.split(":");
                    const text = textParts.join(":").trim();
                    return (
                      <div key={index} style={{ marginBottom: 8 }}>
                        <Text
                          strong
                          style={{
                            color: speaker === "AI" ? "#1890ff" : "#52c41a",
                            marginRight: 8,
                          }}
                        >
                          {speaker === "User" ? currentMessage?.name || speaker : speaker}:
                        </Text>
                        <Text>{text}</Text>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </Collapse>

            <div>
              <Text type="secondary">Delivered To</Text>
              <div>
                {currentMessage.deliveredTo.map((email, index) => (
                  <span key={email}>
                    <a href={`mailto:${email}`}>{email}</a>
                    {index < currentMessage.deliveredTo.length - 1 && <Divider type="vertical" />}
                  </span>
                ))}
              </div>
            </div>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default MessageDetails;
