import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Video, Mic, UserCheck, Radio, ArrowRight } from "lucide-react";
import { IJoinVideoCallProps } from "@/interfaces/joinVideoCall.interface";
import { FloatingInput } from "./FloatingInput";
import { StatusIndicator } from "./StatusIndicator";
import { KeyboardShortcut } from "./KeyboardShortcut";

const areFieldsFilled = (roomID: string, userId: string, userName: string) => {
  return roomID.trim() !== "" && userId.trim() !== "" && userName.trim() !== "";
};

const JoinVideoCallForm: React.FC<IJoinVideoCallProps> = ({ userId, userName, role }) => {
  const [roomID, setRoomID] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "ready">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "j" && areFieldsFilled(roomID, userId, userName)) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [roomID, userId, userName]);

  const testConnection = () => {
    if (connectionStatus === "idle") {
      setConnectionStatus("testing");
      setTimeout(() => {
        setConnectionStatus("ready");
      }, 1500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomID || !userId || !userName) {
      toast.error("All fields are required to join the call");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      navigate(`/${role}/dashboard/tickets/video-call?ticketID=${roomID}&userID=${userId}&userName=${userName}`);
    }, 600);
  };

  return (
    <div className="min-h-[calc(95vh-4rem)] flex mt-4 rounded-2xl items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-900 via-slate-900 to-gray-900 bg-animate">
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"></div>

        <div className="relative p-4 sm:p-6 md:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center">
              <Video className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
              Join Video Call
            </h2>
            <StatusIndicator status={connectionStatus} />
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <FloatingInput
                ref={inputRef}
                id="roomID"
                value={roomID}
                onChange={(e) => setRoomID(e.target.value)}
                label="Room ID (Ticket ID)"
                icon={<Radio size={18} />}
                onBlur={testConnection}
              />

              <div className="relative">
                <label className="text-sm text-blue-200 block mb-1">Connected as</label>
                <div className="flex items-center border border-white/20 bg-white/5 rounded-lg p-3 pl-4">
                  <UserCheck className="h-5 w-5 text-blue-300 mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-white truncate">{userName}</div>
                    <div className="text-xs text-blue-200 opacity-80">
                      Joined as {role.charAt(0).toUpperCase() + role.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="p-2 rounded-full bg-blue-800/50 hover:bg-blue-700/50 transition-colors duration-200"
                    aria-label="Test microphone">
                    <Mic size={18} />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-full bg-blue-800/50 hover:bg-blue-700/50 transition-colors duration-200"
                    aria-label="Test camera">
                    <Video size={18} />
                  </button>
                </div>
                <KeyboardShortcut shortcut="Alt+J" label="to join" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !roomID}
                className={`w-full relative group flex items-center justify-center rounded-lg py-3 px-4 font-medium transition-all duration-300 overflow-hidden ${
                  isSubmitting || !roomID
                    ? "bg-blue-800/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700"
                }`}>
                <span className="relative flex items-center">
                  {isSubmitting ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                  {isSubmitting ? "Connecting..." : "Join Call"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinVideoCallForm;
