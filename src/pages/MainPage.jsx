import { useState } from 'react';
import LoginButton from '../components/LoginButton';
import SearchBar from '../components/SearchBar';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import NewChatButton from '../components/NewChatButton';
import Popup from '../components/Popup';

import '../styles/MainPage.scss';

function MainPage() {
    const [selectedChat, setSelectedChat] = useState([]);
    const [updatedMessages, setUpdatedMessages] = useState({});
    const [action, setAction] = useState('');

    return(
        <div className="app">
            <div className="sidebar">
                <div className="header">
                    <LoginButton/>
                    <div className="actions">
                        <SearchBar/>
                        <NewChatButton onClick={() => setAction('create')} />
                    </div>
                </div>
                <ChatList setSelectedChat={setSelectedChat} updatedMessages={updatedMessages}/>
            </div>
            <div className="main">
                <ChatWindow selectedChat={selectedChat} updatedMessages={updatedMessages}/>
                <MessageInput selectedChat={selectedChat} setUpdatedMessages={setUpdatedMessages}/>
            </div>
            <Popup action={action} onClose={() => setAction(null)}/>
        </div>
    )
}

export default MainPage;
