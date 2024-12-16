import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import useMessageService from "../services/MessageService";

import '../styles/ChatWindow.scss';
import avatarimg from '../assets/avatar.svg';

function ChatWindow({ selectedChat, updatedMessages }){

    const divRef = useRef(null);
    
    const [messages, setMessages] = useState([]);

    const { getChat} = useMessageService();

    const id = selectedChat?.[0] || null; 
    const name = selectedChat?.[1] || null; 

    useEffect(() => {
        if (!id && !name) return; 

        getChat(id)
            .then((res) => {
                setMessages(res); 
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id, name]);

    useEffect(() => {
        if (!updatedMessages?.response) return;
        setMessages([...messages, updatedMessages.message, updatedMessages.response]);
        updateChat()
    }, [updatedMessages?.updateNotification]);

    useEffect(() => {
        if (divRef.current) {
            const scrollableDiv = divRef.current;
            scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
        }
      }, [messages]); 

    function updateChat() {
        const elements = messages.map(({_id, content, sender, timestamp}) => {
            return (
                <div key={_id}  className={`chat-window__message ${sender === 'bot' ? "left" : "right"}`}>
                    {sender === 'bot' ? (<img src={avatarimg} alt={name} />) : null}
                    <div className="message-content">
                        <div className="message__text">{content}</div>
                        <div className="message__date">{timestamp}</div>
                    </div>
                </div>
            )
        })
        return elements
    }

    return(
        <div className="chat-window">
            <div className="chat-window__header">
                {id ? (<>
                    <img className="chat-window__avatar" src={avatarimg} alt="User avatar" />
                    <h2>{name}</h2>
                </>) : null}
            </div>
            <div className="chat-window__body" ref={divRef}>
                {id ? (<>
                    {updateChat()}
                </>) : (<p>Select chat</p>)}
            </div>
        </div>
    )
}

ChatWindow.propTypes = {
    selectedChat: PropTypes.arrayOf(PropTypes.string).isRequired,
    updatedMessages: PropTypes.object.isRequired
};

export default ChatWindow;