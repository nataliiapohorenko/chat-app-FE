import { useState,  } from 'react';
import PropTypes from 'prop-types';

import '../styles/RandomButton.scss'

function RandomButton({socket, setUpdatedMessages}){
    const [isAutoMessaging, setIsAutoMessaging] = useState(false);

    const toggleAutoMessaging = () => {
        socket.emit('autoMessaging', !isAutoMessaging); 
        socket.on('autoMessaging', (result) => {setUpdatedMessages(result)});
        setIsAutoMessaging((prev) => !prev);
    };

    return(
        <button className='random-button' onClick={toggleAutoMessaging}>
            {isAutoMessaging ? 'Stop Auto Messaging' : 'Start Auto Messaging'}
        </button>
    )
}

RandomButton.propTypes = {
    socket: PropTypes.object,
    setUpdatedMessages: PropTypes.func.isRequired
};

export default RandomButton;