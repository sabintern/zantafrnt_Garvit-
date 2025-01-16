import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Avatar,
  Typography,
  Slider,
  Button,
  Tooltip,
  Space,
} from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  SoundOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Text } = Typography;

const MusicPlayer = ({ currentMessage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const updateTime = () => setAudioCurrentTime(audio.currentTime);

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", () => setAudioDuration(audio.duration));
      audio.addEventListener("ended", () => setIsPlaying(false));

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
      };
    }
  }, [currentMessage?.callRecording?.audioPath]);

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setAudioCurrentTime(value);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value) => {
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
      setVolume(value);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Content style={{ padding: "24px", background: "#f5f5f5", borderRadius: "12px" }}>
      <audio ref={audioRef} src={currentMessage?.callRecording?.audioPath || ""}></audio>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Playback Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Tooltip title={isPlaying ? "Pause" : "Play"}>
            <Button
              type="primary"
              shape="circle"
              icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              size="large"
              onClick={handlePlayPause}
            />
          </Tooltip>
        </div>

        {/* Progress Bar */}
        <div style={{ flex: 1, margin: "0 16px" }}>
          <Slider
            min={0}
            max={audioDuration}
            value={audioCurrentTime}
            onChange={handleSeek}
            tooltip={{ formatter: formatTime }}
            style={{ marginBottom: 8 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>{formatTime(audioCurrentTime)}</Text>
            <Text>{formatTime(audioDuration)}</Text>
          </div>
        </div>

        {/* Volume Control */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SoundOutlined />
          <Slider
            min={0}
            max={100}
            value={volume}
            onChange={handleVolumeChange}
            style={{ width: "120px" }}
          />
        </div>
      </div>
    </Content>
  );
};

export default MusicPlayer;
