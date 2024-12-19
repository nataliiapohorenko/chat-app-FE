import { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';

import LoginButton from '../components/LoginButton';
import SearchBar from '../components/SearchBar';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import NewChatButton from '../components/NewChatButton';
import Popup from '../components/Popup';
import RandomButton from '../components/RandomButton';

import config from '../config';
import "react-toastify/dist/ReactToastify.css";
import '../styles/MainPage.scss';

function MainPage({user, setIsAuthenticated}) {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState({});
    const [updatedMessages, setUpdatedMessages] = useState({});
    const [action, setAction] = useState('');
    const [updateChatValue, setUpdateChatValue] = useState({});
    const [updateChatResult, setUpdateChatResult] = useState({});
    const [newChat, setNewChat] = useState({});
    const [deletedChatId, setDeletedChatId] = useState('');
    const [deletedAt, setDeletedAt] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [messageToEdit, setMessageToEdit] = useState({});
    const [editedMessage, setEditedMessage] = useState({});
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(config.apiUrl);
        setSocket(newSocket);
        const storedItem = localStorage.getItem('authToken');
        let token = null;
        if(storedItem){
            const { token: storedToken } = JSON.parse(storedItem);
            token = storedToken;
        }
        newSocket.emit('authorization', token);
    
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!updatedMessages?.response) return;
        const latestMessage = updatedMessages.response.content;
        const sender = chats.filter(chat => {
            return chat.id === updatedMessages.response.chatId
        });
        const {name, surname} = sender[0];
        showNotification(latestMessage, name, surname);
        
      }, [updatedMessages?.updateNotification]);

    useEffect(() => {
        if (deletedAt !== '' && selectedChat?.id === deletedChatId) {
            setSelectedChat({})
        }
      }, [deletedAt]);

    const showNotification = (message, name, surname) => {
        toast.success(`${name} ${surname}: ${message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      };

    return(
        <div className="app">
            <div className="sidebar">
                <div className="header">
                    <div className='header-content'>
                        <h2>{user}</h2>
                        <LoginButton setIsAuthenticated={setIsAuthenticated}/>
                    </div>
                    <div className="actions">
                        <SearchBar onSearch={(value) => setSearchQuery(value)}/>
                        <NewChatButton onClick={() => setAction('create')} />
                    </div>
                </div>
                <RandomButton socket={socket} setUpdatedMessages={setUpdatedMessages}/>
                <ChatList 
                    setSelectedChat={setSelectedChat} 
                    updatedMessages={updatedMessages} 
                    newChat={newChat} 
                    setAction={setAction}
                    setUpdateChatValue={setUpdateChatValue}
                    updateChatResult={updateChatResult}
                    setDeletedChatId={setDeletedChatId}
                    deletedChatId={deletedChatId}
                    deletedAt={deletedAt}
                    searchQuery={searchQuery}
                    chats={chats}
                    setChats={setChats}/>
            </div>
            <div className="main">
                <ChatWindow 
                    selectedChat={selectedChat} 
                    updatedMessages={updatedMessages} 
                    updateChatResult={updateChatResult}
                    setMessageToEdit={setMessageToEdit}
                    editedMessage={editedMessage}/>
                <MessageInput 
                    selectedChat={selectedChat} 
                    setUpdatedMessages={setUpdatedMessages}
                    messageToEdit={messageToEdit}
                    setMessageToEdit={setMessageToEdit}
                    setEditedMessage={setEditedMessage}/>
            </div>
            <Popup action={action} 
                onClose={() => setAction(null)} 
                setNewChat={setNewChat} 
                updateChatValue={updateChatValue} 
                setUpdateChatResult={setUpdateChatResult}
                deletedChatId={deletedChatId}
                setDeletedAt={setDeletedAt}/>
            <ToastContainer />
        </div>
    )
}

MainPage.propTypes = {
    user: PropTypes.string.isRequired,
    setIsAuthenticated: PropTypes.func
};

export default MainPage;
