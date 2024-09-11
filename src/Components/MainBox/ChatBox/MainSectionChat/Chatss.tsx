import React, { useState, useEffect, useRef } from 'react';
import "./ChatRoom.css";
import EmojiPicker from "emoji-picker-react";
import RiciverChat from "./Reciver-chat/Riciver-chat";
import ChatsList from "../../../../../ChatsList";

interface ChatRoomProps {
    show: boolean;
    contact: {
        username: string;
        name: string;
        color: string;
    } | null;
    sender: string;
}

interface Message {
   receiver: string;
   text: string;
   date: string;
   sender: string;
   id: number;
}

export default function ChatRoom({ show, contact, sender }: ChatRoomProps) {
    if (show && contact) {
        const [openEmoji, setOpenEmoji] = useState(false);
        const [textEmoji, setTextEmoji] = useState<string>("");
        const [messages, setMessages] = useState<Message[]>([]);
        const [blockUser, setBlockUser] = useState(false);

        const chatEndRef = useRef<HTMLDivElement | null>(null);
        useEffect(() => {
            if (chatEndRef.current) {
                chatEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, [messages])

        const EmojiHandler = (e: any) => {
            setTextEmoji((prev: string) => prev + e.emoji);
        };



        const sendMessage = () => {
            const lastMessageId = ChatsList.chatList.length > 0 ? ChatsList.chatList[ChatsList.chatList.length - 1].id : 0;
            const newMessage: Message = {
                receiver: contact.username,
                text: textEmoji,
                date: new Date().toISOString(),
                sender: sender,
                id: lastMessageId + 1,
            };
            if (textEmoji.trim()) {
                setMessages((prev) => [...prev, newMessage]);
                ChatsList.chatList.push(newMessage);
                setTextEmoji("");
            }
        };
        const Message = ChatsList.chatList
        console.log(Message)
        const MSG = messages.map((msg) => {
            const isSender = msg.sender === sender;
            console.log(msg)
            return (
                <div className={`MSG ${isSender ? 'sand' : 'receive'}`} key={msg.id}>
                    <div className="msg-container">
                        <p className={`text ${isSender ? 'Sender' : 'Receiver'}`}>{msg.text}</p>
                        <span className="time-text">{`${new Date(msg.date).getHours()}:${new Date(msg.date).getMinutes()}`}</span>
                    </div>
                </div>
            ); 
        });

        const blockHandle = () => {
            setBlockUser(!blockUser);
        };

        return (
            <div className="Chat-section">
                <div className="chat-info">
                    <div className="user-chat">
                        <div className="user-avatar" style={{ backgroundColor: contact.color }}>{contact.name.charAt(0)}</div>
                        <div className="information">
                            <div className="user-name">{contact.name}</div>
                            <div className="user-number">{contact.username}</div>
                        </div>
                    </div>
                    <button className="block-user" onClick={blockHandle}><i className="fa-solid fa-user-lock"></i> مسدود</button>
                </div>
                <div className="chat-persons">
                    <RiciverChat charName={contact.name} RelatedChats={contact.username} color={contact.color} />
                    {MSG}
                    <div ref={chatEndRef} />
                </div>
                {!blockUser ? (
                    <div className="sand-message">
                        <i className="fa-solid fa-paper-plane" onClick={sendMessage}></i>
                        <div className="emoji">
                            <i className="fa-regular fa-face-laugh-beam" onClick={() => setOpenEmoji(!openEmoji)}></i>
                            <div className="picker">
                                <EmojiPicker open={openEmoji} onEmojiClick={EmojiHandler} />
                            </div>
                        </div>
                        <input type="text" placeholder="پیام خود را ارسال کنید" className="text-input" onChange={(e) => { setTextEmoji(e.target.value) }} value={textEmoji} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }} />
                        <span className="material-symbols-outlined icon-attach">attach_file</span>
                    </div>
                ) : (<div className="sand-message blocked" onClick={blockHandle}>رفع مسدودیت</div>)}
            </div>
        );
    } else {
        return (
            <div className="Chat-section"></div>
        );
    }
}
