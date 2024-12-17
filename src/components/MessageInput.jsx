import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import useMessageService from '../services/MessageService';
import '../styles/MessageInput.scss'
import sendimg from '../assets/send.svg';

function MessageInput({selectedChat, setUpdatedMessages, messageToEdit, setMessageToEdit, setEditedMessage}){

    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef();
    const { sendMessage, updateMessage} = useMessageService();

    useEffect(() => {
        if (messageToEdit?.content) {
            setInputValue(messageToEdit.content);
        } else {
            setInputValue('');
        }
    }, [messageToEdit?.content]);

    const handleSendMessage = () => {
        const message = inputValue.trim();
        if (!message || !selectedChat?.id) return;

        if (messageToEdit?.content) {
            updateMessage({ id: messageToEdit._id, message })
                .then((res) => {
                    setMessageToEdit({});
                    setEditedMessage(res.message);
                })
                .catch((err) => console.error(err));
        } else {
            sendMessage({ id: selectedChat.id, message })
                .then((res) => setUpdatedMessages(res))
                .catch((err) => console.error(err));
        }

        setInputValue('');
        inputRef.current.focus();
    };

    const handleCancelUpdate = () => {
        setMessageToEdit({}); 
        setInputValue(''); 
        inputRef.current.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage(); 
        }
    };

    const isUpdateDisabled = messageToEdit?.content && inputValue.trim() === messageToEdit.content;

    if (!selectedChat?.id) return null;

    return(
        <div className="message-input">
            <input
                type="text"
                placeholder="Type your message"
                className="message-input__input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                aria-label="Message input"
            />
            <div className="message-input__buttons">
                {messageToEdit?.content ? (
                    <>
                        <button
                            className="btn"
                            onClick={handleSendMessage}
                            disabled={isUpdateDisabled}
                            aria-label="Update message"
                        >
                            Update
                        </button>
                        <button
                            className="btn cancel-btn"
                            onClick={handleCancelUpdate}
                            aria-label="Cancel updating message"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        className="icon-btn"
                        onClick={handleSendMessage}
                        aria-label="Send message"
                    >
                        <img className='icon-img' src={sendimg} alt="find" />
                    </button>
                )}
            </div>
        </div>
    )
}

MessageInput.propTypes = {
    selectedChat: PropTypes.object.isRequired,
    setUpdatedMessages: PropTypes.func.isRequired,
    messageToEdit: PropTypes.object.isRequired,
    setMessageToEdit: PropTypes.func.isRequired,
    setEditedMessage: PropTypes.func.isRequired,
};

export default MessageInput;
