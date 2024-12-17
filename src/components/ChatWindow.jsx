import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import useMessageService from "../services/MessageService";

import '../styles/ChatWindow.scss';
import avatarimg from '../assets/avatar.svg';
import editimg from '../assets/edit.svg';

function ChatWindow({ selectedChat, updatedMessages, updateChatResult, setMessageToEdit, editedMessage }){

    const divRef = useRef(null);
    
    const [messages, setMessages] = useState([]);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const { getChat} = useMessageService();

    const id = selectedChat?.id || null; 
    const selectedChatName = selectedChat?.name || null; 
    const selectedChatSurname = selectedChat?.surname || null; 

    useEffect(() => {
        if (!id) return; 
        setName(selectedChatName);
        setSurname(selectedChatSurname);
        getChat(id)
            .then((res) => {
                setMessages(res); 
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

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

    useEffect(() => {
        if(!updateChatResult?._id) return;
        if(updateChatResult._id === id){
            setName(updateChatResult.botName);
            setSurname(updateChatResult.botSurname);
        }
    }, [updateChatResult?.botName, updateChatResult?.botSurname]);

    useEffect(() => {
        if (editedMessage?.chatId && editedMessage.chatId === selectedChat?.id) {
            setMessages((prevMessages) =>
                prevMessages.map((message) =>
                    message._id === editedMessage._id
                        ? { ...message, content: editedMessage.content }
                        : message
                )
            );
        }
    }, [JSON.stringify(editedMessage)]);

    function formatLocalDateTime(isoString) {
        const date = new Date(isoString);
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return date.toLocaleString('en-US', options);
    }

    function updateChat() {
        const elements = messages.map(({_id, content, sender, timestamp}) => {
            return (
                <div key={_id}  className={`chat-window__message ${sender === 'bot' ? "left" : "right"}`}>
                    {sender === 'bot' ? (<img src={avatarimg} alt={name+ ' ' + surname} />) : null}
                    <div className="message-content">
                        <div className="message__text">
                            {content}
                            {sender === 'user' &&
                            <button className="icon-btn message__button" onClick={() => setMessageToEdit({ _id, content })}>
                                <img className="icon-img" src={editimg} alt="Edit message" />
                            </button>}
                        </div>
                        <div className="message__date">{formatLocalDateTime(timestamp)}</div>
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
                    <h2>{name + ' ' + surname}</h2>
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
    selectedChat: PropTypes.object.isRequired,
    updatedMessages: PropTypes.object.isRequired,
    updateChatResult: PropTypes.object.isRequired,
    setMessageToEdit: PropTypes.func.isRequired,
    editedMessage: PropTypes.object.isRequired,
};

export default ChatWindow;