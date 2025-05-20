"use client";

import React from "react";
import ChatIconImage from '../../assets/images/chatIcon.png'
import VCIcon from "../../assets/images/vc icon.png"
import ScreenShareImg from "../../assets/images/screenSharing.png"

import { Dock, DockIcon } from "./dock";

export type IconProps = React.HTMLAttributes<HTMLImageElement>;

interface IDockDemo {
  ticketId : string;
  handleChat : () => void;
  handleVideoCall: () => void;
}

export const  DockDemo : React.FC<IDockDemo> = ({ handleChat,handleVideoCall}) => {
  
  return (
    <div className="relative ">
      <Dock iconMagnification={90} iconDistance={140}>
        <DockIcon className="bg-black/10 dark:bg-white/10">
          <Icons.chat
           className="size-full"
           onClick={ handleChat }
           />
        </DockIcon>
        <DockIcon className="bg-black/10 dark:bg-white/10">
          <Icons.videoCall onClick={handleVideoCall}  className="size-full" />
        </DockIcon>
        <DockIcon className="bg-black/10 dark:bg-white/10">
          <Icons.screenShare onClick={handleVideoCall}  className="size-full" />
        </DockIcon>
      </Dock>
    </div>
  );
}

const Icons = {
  chat: (props: IconProps) => (
   <img src={ChatIconImage} alt="icon" {...props}  />
  ),
  videoCall: (props: IconProps) => (
   <img src={VCIcon} alt="vc icon" {...props} />
  ),
  screenShare: (props: IconProps) => (
    <img src={ScreenShareImg} alt="ss share img" {...props} />
  ),
};
