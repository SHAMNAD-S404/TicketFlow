import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import secrets from "@/config/secrets";

interface VideoCallProps {
  roomID: string;
  userID: string;
  userName: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomID, userID, userName }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const appID =Number(secrets.ZEGO_APPID); // e.g., 123456789
    const serverSecret =secrets.ZEGO_SERVER_SECRET; // Your AppSign from ZegoCloud

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: containerRef.current!,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // Or GroupCall, VideoConference
      },
      showScreenSharingButton: true,
      showPreJoinView: true,
    });
  }, [roomID, userID, userName]);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default VideoCall;
