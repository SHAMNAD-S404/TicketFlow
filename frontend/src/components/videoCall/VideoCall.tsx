import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSearchParams } from "react-router-dom";
import secrets from "@/config/secrets";

const APP_ID = Number(secrets.ZEGO_APPID);
const SERVER_SECRET = secrets.ZEGO_SERVER_SECRET;

function generateKitToken(appId: number, serverSecret: string, roomID: string, userID: string, userName: string) {
  return ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serverSecret, roomID, userID, userName);
}

const VideoCall: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  const roomID = searchParams.get("ticketID") || "";
  const userID = searchParams.get("userID") || "";
  const userName = searchParams.get("userName") || "";

  useEffect(() => {
    if (!roomID || !userID || !userName) return;

    const token = generateKitToken(APP_ID, SERVER_SECRET, roomID, userID, userName);
    const zp = ZegoUIKitPrebuilt.create(token);

    zp.joinRoom({
      container: containerRef.current!,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `${window.location.origin}/video-call?ticketID=${roomID}&userID=${userID}&userName=${userName}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
      showPreJoinView: false,
    });

    return () => {
      zp.destroy(); //cleanup on unmount
    };
  }, [roomID, userID, userName]);

  return <div ref={containerRef} style={{ width: "100%", height: "90vh" }} />;
};

export default VideoCall;
