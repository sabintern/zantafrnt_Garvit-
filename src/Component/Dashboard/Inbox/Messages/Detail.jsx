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
  Tag,
  theme
} from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  DownloadOutlined,
  SoundOutlined,
  UserOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
  MailOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import MusicPlayer from './Audio';
import "./MessageDetails.css";

const { Header, Content } = Layout;
const { Text, Title, Paragraph } = Typography;
const { Panel } = Collapse;
const { useToken } = theme;

const MessageDetails = () => {
  const { token } = useToken();
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
    <Layout className="message-details-layout">
      <Header className="message-header-1">
        <div className="header-content">
          <Space size={16} align="center">
            <Avatar 
              size={56} 
              icon={<UserOutlined />}
              className="caller-avatar"
              style={{
                backgroundColor: token.colorPrimary,
                color: token.colorWhite
              }}
            >
              {currentMessage.name?.[0].toUpperCase()}
            </Avatar>
            <div className="caller-info">
              <Title level={4} className="caller-name">
                {currentMessage.name || "Unknown Caller"}
              </Title>
              {/* <Space split={<Divider type="vertical" />} className="call-metadata">
                <Text type="secondary">
                  <PhoneOutlined /> {currentMessage.from}
                </Text>
              </Space> */}
            </div>
          </Space>
          <Tag color="success" className="call-status">
            Answered by {currentMessage.answeredBy}
          </Tag>
        </div>
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



            <Card className="audio-player-card">
            <MusicPlayer currentMessage={currentMessage} />
          </Card>

            <Collapse 
            className="custom-collapse"
            expandIconPosition="end"
          >
            <Panel 
              header={
                <Space>
                  <InfoCircleOutlined />
                  <span>Caller Information</span>
                </Space>
              } 
              key="1"
              className="custom-panel"
            >
              <div className="structured-data">
                {currentMessage.analysis?.structuredData &&
                  Object.entries(currentMessage.analysis.structuredData).map(
                    ([key, value]) => (
                      <Row key={key} className="data-row">
                        <Col xs={24} sm={8}>
                          <Text className="data-label">{key}:</Text>
                        </Col>
                        <Col xs={24} sm={16}>
                          <Text className="data-value">{value}</Text>
                        </Col>
                      </Row>
                    )
                  )}
                {currentMessage.analysis?.summary && (
                  <div className="summary-section">
                    <Title level={5}>Summary</Title>
                    <Paragraph className="summary-text">
                      {currentMessage.analysis.summary}
                    </Paragraph>
                  </div>
                )}
              </div>
            </Panel>

            <Panel
              header={
                <Space>
                  <SoundOutlined />
                  <span>Conversation Transcript</span>
                </Space>
              }
              key="2"
              className="custom-panel"
            >
              <div className="transcript-container">
                {currentMessage?.transcript.split("\n").map((line, index) => {
                  const [speaker, ...textParts] = line.split(":");
                  const text = textParts.join(":").trim();
                  const isAI = speaker === "AI";
                  
                  return (
                    <div 
                      key={index} 
                      className={`message-bubble ${isAI ? 'ai-message' : 'user-message'}`}
                    >
                      <div className="message-header">
                        <Text strong className="speaker-name">
                          {isAI ? 'AI Assistant' : currentMessage?.name || 'Caller'}
                        </Text>
                      </div>
                      <div className="message-text">
                        {text}
                      </div>
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
