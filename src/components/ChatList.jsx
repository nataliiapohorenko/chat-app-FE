import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useMessageService from "../services/MessageService";
import '../styles/ChatList.scss'
import avatarimg from '../assets/avatar.svg';
import editimg from '../assets/edit.svg';
import deleteimg from '../assets/delete.svg';

function ChatList({ setSelectedChat, 
                    updatedMessages, 
                    newChat, 
                    setAction, 
                    setUpdateChatValue, 
                    updateChatResult, 
                    setDeletedChatId, 
                    deletedChatId, 
                    deletedAt,
                    searchQuery }) {

    const [chats, setChats] = useState([]);
    const { getAllChats} = useMessageService();

    useEffect(() =>{
        getAllChats().then((res) => {
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

    useEffect(() => {
        if (!newChat._id) return
        const newChatId = newChat._id;
        const newChatName = newChat.botName;
        const newChatSurname = newChat.botSurname;
        setChats([...chats, {id: newChatId, name: newChatName, surname: newChatSurname, lastMessage: '', date: '', createdAt: newChat.createdAt}]);
        setSelectedChat({id: newChatId, name: newChatName, surname: newChatSurname});
        updateChats();
    }, [newChat._id]);

    useEffect(() => {
        if(!updateChatResult?._id) return;
        const {_id, botName, botSurname} = updateChatResult;
        const updatedChats = chats.map((chat) =>
            chat.id === _id? {...chat, name: botName, surname: botSurname} : chat
        );
        setChats(updatedChats);
        updateChats()
    },[updateChatResult?._id, updateChatResult?.botName, updateChatResult?.botSurname]);

    useEffect(() => {
        if (deletedAt === '') return;
        const updatedChats = chats.filter((chat) => chat.id!== deletedChatId);
        setChats(updatedChats);
        updateChats();
    },[deletedAt]);

    const filteredChats = chats.filter((chat) => {
        const chatName = chat.name + ' ' + chat.surname
        return chatName.toLowerCase().includes(searchQuery.toLowerCase().trim())
    });

    const updateChat =([id, name, surname]) => {
        setAction('update');
        setUpdateChatValue({id, name, surname});
    }

    const deleteChat =(id) => {
        setAction('delete');
        setDeletedChatId(id);
    }

    function formatLocalDate(isoString) {
        const date = new Date(isoString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function updateChats () {
        const elements = [...filteredChats].sort((a,b) => {
                const dateA = a.date ? new Date(a.date) : new Date(a.createdAt);
                const dateB = b.date ? new Date(b.date) : new Date(b.createdAt);
                return dateB - dateA;
            }).map(({id, name, surname, lastMessage, date}) => {
                return (
                    <div key={id} className="chat-list__item" onClick={() => setSelectedChat({id, name, surname})}>
                        <img src={avatarimg} alt={name + ' ' + surname} className="chat-list__avatar" />
                        <div className="chat-list__content">
                            <div className="chat-list__content-header">
                                <h3>{name + ' ' + surname}</h3>
                                <span>{date && formatLocalDate(date)}</span>
                            </div>
                            <p>{lastMessage}</p>
                        </div>    
                        <div className="chat-list__buttons">
                            <button className="icon-btn" onClick={(e) => {e.stopPropagation(); updateChat([id, name, surname]);}}>
                                <img className="icon-img" src={editimg} alt="edit"></img>
                            </button>
                            <button className="icon-btn" onClick={(e) => {e.stopPropagation(); deleteChat(id);}}>
                                <img className="icon-img delete-img" src={deleteimg} alt="delete"></img>
                            </button>
                        </div>
                    </div>
                )
            })
        return elements
    }
    

    return(
        <div className="chat-list">
            <h2>Chats</h2>
            {updateChats()}
            {filteredChats.length === 0 && <p>No chats found</p>}
        </div>        
    )
}

ChatList.propTypes = {
    setSelectedChat: PropTypes.func.isRequired,
    updatedMessages: PropTypes.object.isRequired,
    newChat: PropTypes.object.isRequired,
    setAction: PropTypes.func.isRequired,
    setUpdateChatValue: PropTypes.func.isRequired,
    updateChatResult: PropTypes.object.isRequired,
    setDeletedChatId: PropTypes.func.isRequired,
    deletedChatId: PropTypes.string.isRequired,
    deletedAt: PropTypes.string.isRequired,
    searchQuery: PropTypes.string.isRequired
};

export default ChatList;