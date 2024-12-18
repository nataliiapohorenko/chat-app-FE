import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useMessageService from '../services/MessageService';
import '../styles/Popup.scss';

function Popup({ 
      onClose, 
      action, 
      setNewChat, 
      updateChatValue, 
      setUpdateChatResult, 
      deletedChatId, 
      setDeletedAt}) {
        
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState({ firstName: false, lastName: false });

  const {createChat, updateChat, deleteChat} = useMessageService();

  useEffect(() => {
    setErrors({ firstName: false, lastName: false });
    setFirstName('');
    setLastName('');
    if (action === 'update') {
      setFirstName(updateChatValue.name);
      setLastName(updateChatValue.surname);
    }
  },[action, updateChatValue?.name, updateChatValue?.surname])

  const validateField = (name, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "",
    }));
  };

  const validateFields = () => {
    const newErrors = {
      firstName: firstName.trim() === "",
      lastName: lastName.trim() === "",
    };
    setErrors(newErrors);

    return !newErrors.firstName && !newErrors.lastName; 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateFields()) {
      if(action === "create") {
        createChat({firstName, lastName})
        .then((res) => {
          setNewChat(res.chat);
        }).catch((err) => {
          console.error(err);
        });
      } else if(action === "update"){
        const id = updateChatValue.id;
        updateChat({id, firstName, lastName})
        .then((res) => {
          setUpdateChatResult(res.chat)
        }).catch((err) => {
          console.error(err);
        });
      }
      setFirstName("");
      setLastName("");
      onClose();
    }
  };

  const handleDelete = () => {
    deleteChat({id: deletedChatId})
      .then(() => {
        setDeletedAt(new Date().toISOString());
      })
      onClose();
  }

  const isUpdateDisabled =
    action === "update" &&
    firstName === updateChatValue.name &&
    lastName === updateChatValue.surname;

  if (!action) return null;
  
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={`popup-content ${action === 'delete' ? '' : "big"}`}onClick={(e) => e.stopPropagation()}>
        {(action === 'create' || action === 'update') 
          ? 
          <>
            <h3>{action === 'create' ? 'New Chat' : 'Update chat'}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                First Name:
                <input type="text" value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={(e) => validateField("firstName", e.target.value)}
                  className={`popup-input ${errors.firstName ? "error-border" : ""}`} required />
              </label>
              <br />
              <label>
                Last Name:
                <input type="text" value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={(e) => validateField("lastName", e.target.value)}
                  className={`popup-input ${errors.lastName ? "error-border" : ""}`} required />
              </label>
              <button type="submit" disabled={isUpdateDisabled} className='btn'>{action === 'create' ? 'Create' : 'Update'}</button>
            </form>
          </> 
          :
          <div className='popup-delete'>
            <h3>You sure?</h3>
            <button onClick={handleDelete} className='btn'>Delete</button>
          </div>
        }
        <button className="close-btn btn cancel-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
  
}

Popup.propTypes = {
  onClose: PropTypes.func.isRequired,
  action: PropTypes.string,
  setNewChat: PropTypes.func.isRequired,
  updateChatValue: PropTypes.object.isRequired,
  setUpdateChatResult: PropTypes.func.isRequired,
  deletedChatId: PropTypes.string.isRequired,
  setDeletedAt: PropTypes.func.isRequired,
};

export default Popup;
