import { useRef } from 'react';
import PropTypes from 'prop-types';

import useMessageService from '../services/MessageService';
import '../styles/MessageInput.scss'

function MessageInput({selectedChat, setUpdatedMessages}){

    const inputRef = useRef();

    const id = selectedChat?.id || null;

    const { sendMessage} = useMessageService();

    const handleSendMessage = () => {
        const message = inputRef.current.value.trim();
        if (!message) return;

        sendMessage({id, message})
            .then((res) => {
                console.log(res);
    
            setUpdatedMessages(res);
        })
        .catch((err) => {
            console.error(err);
        });
        inputRef.current.value = "";
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage(); 
        }
    };

    return(
        <div className="message-input">
            {id ? (<>
                    <input
                        type="text"
                        placeholder="Type your message"
                        className="message-input__input"
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="message-input__button" onClick={handleSendMessage}>
                        send
                    </button>
                </>) : null}
    </div>
    )
}

MessageInput.propTypes = {
    selectedChat: PropTypes.object.isRequired,
    setUpdatedMessages: PropTypes.func.isRequired
};

export default MessageInput;
