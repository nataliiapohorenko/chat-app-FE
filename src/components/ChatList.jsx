import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useMessageService from "../services/MessageService";
import '../styles/ChatList.scss'
import avatarimg from '../assets/avatar.svg';

function ChatList({ setSelectedChat, updatedMessages }){
    const [chats, setChats] = useState([]);
    const { getAllChats} = useMessageService();

    useEffect(() =>{
        getAllChats().then(res => {
            setChats(res); 
        })
        .catch(err => {
            console.error(err);
        })
    }, []);  
    
    useEffect(() => {
        if (!updatedMessages?.response) return;
        const {response} = updatedMessages
        const {chatId, content, timestamp} = response;
        const updatedChats = chats.map((chat) =>
            chat.id === chatId? {...chat, lastMessage: content, date: timestamp} : chat
        );
        setChats(updatedChats);
        updateChats()
    }, [updatedMessages?.updateNotification]);

    function updateChats () {
        const elements = chats.map(({id, name, lastMessage, date}) => {
            return (
                <div key={id} className="chat-list__item" onClick={() => setSelectedChat([id, name])}>
                    <img src={avatarimg} alt={name} className="chat-list__avatar" />
                    <div className="chat-list__content">
                        <h3>{name}</h3>
                        <p>{lastMessage}</p>
                    </div>    
                    <span>{date}</span>
                </div>
            )
        })
        return elements
    }
    

    return(
        <div className="chat-list">
            <h2>Chats</h2>
            {updateChats()}
        </div>        
    )
}

ChatList.propTypes = {
    setSelectedChat: PropTypes.func.isRequired,
    updatedMessages: PropTypes.object.isRequired
};

export default ChatList;