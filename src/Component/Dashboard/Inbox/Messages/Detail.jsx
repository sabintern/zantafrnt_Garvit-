import React, { useState, useEffect } from "react";
import { Layout, Avatar, Card, Button, Typography, Space, Divider, Row, Col, Collapse } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined, DownloadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Header, Content } = Layout;
const { Text, Title } = Typography;
const { Panel } = Collapse;

const MessageDetails = () => {
  const { currentMessage } = useSelector((state) => state.inbox);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0); // Store the audio duration
  const [audioCurrentTime, setAudioCurrentTime] = useState(0); // Track current time of audio

  useEffect(() => {
    if (audio) {
      const interval = setInterval(() => {
        setAudioCurrentTime(audio.currentTime);
      }, 1000);

      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, [audio]);

  const handlePlayPause = (audioPath) => {
    if (audio) {
      // Stop the current audio if it's playing
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      // Create a new audio element and play the selected song
      const newAudio = new Audio(audioPath);
      newAudio.onloadedmetadata = () => {
        setAudioDuration(newAudio.duration); // Set the duration when the metadata is loaded
      };
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);
    }
  };

  const handleDownload = (audioPath) => {
    const link = document.createElement("a");
    link.href = audioPath;
    link.download = audioPath.split("/").pop() || "audio.mp3"; // Use the filename from the URL
    link.click(); // Trigger the download
  };

  const audioProgress = (audioCurrentTime / audioDuration) * 100 || 0; // Calculate progress percentage

  return (
    <Layout>
      <Header
        style={{
          background: "#fff",
          padding: "16px 24px",
          height: "auto",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Space size={16}>
            <Avatar size={48} style={{ backgroundColor: "#1890ff" }}>
              FR
            </Avatar>
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {currentMessage?.from}
              </Title>
              <Text type="secondary">Manhattan, NY</Text>
            </div>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: 24, overflowY: "auto" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {currentMessage && (
              <>
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

                <Card>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                  >
                    <Text strong>Call Recording</Text>
                    <Text type="secondary">
                      Available for {currentMessage?.callRecording?.availability}
                    </Text>
                  </div>
                  <Space>
                    <Button
                      icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                      onClick={() =>
                        handlePlayPause(currentMessage.callRecording.audioPath)
                      }
                    />
                    <div
                      style={{
                        flex: 1,
                        height: 4,
                        backgroundColor: "#f0f0f0",
                        borderRadius: 2,
                      }}
                    >
                      <div
                        style={{
                          width: `${audioProgress}%`, // Dynamically adjust the width
                          height: "100%",
                          backgroundColor: "#1890ff",
                          borderRadius: 2,
                        }}
                      />
                    </div>
                    <Text type="secondary">
                      {audioDuration
                        ? `${Math.round(audioCurrentTime)}s / ${Math.round(audioDuration)}s`
                        : currentMessage.callRecording.duration}
                    </Text>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() =>
                        handleDownload(currentMessage.callRecording.audioPath)
                      }
                    />
                  </Space>
                </Card>

                <Collapse accordion>
                  
                <Panel header={<span><PlayCircleOutlined /> Caller Information</span>} key="1">
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
                      <Row key={"summary"} style={{ marginBottom: 8 }}>
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

                {/* Collapse for Transcript */}
                <Collapse accordion>
                  <Panel header={<span><PlayCircleOutlined /> Transcript</span>} key="1">
                    <Text>{currentMessage?.transcript}</Text>
                  </Panel>
                </Collapse>

                <div>
                  <Text type="secondary">Delivered To</Text>
                  <div>
                    {currentMessage.deliveredTo.map((email, index) => (
                      <span key={email}>
                        <a href={`mailto:${email}`}>{email}</a>
                        {index < currentMessage.deliveredTo.length - 1 && (
                          <Divider type="vertical" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default MessageDetails;
