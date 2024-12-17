import PropTypes from 'prop-types';
import '../styles/NewChatButton.scss';

function NewChatButton({ onClick }){
    return(
        <button onClick={onClick} className="new-button">
            New <br />chat 
        </button>
    )
}

NewChatButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default NewChatButton;

