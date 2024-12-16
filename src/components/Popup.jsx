import { useState } from 'react';
import PropTypes from 'prop-types';
import useMessageService from '../services/MessageService';
import '../styles/Popup.scss';

function Popup({ onClose, action}) {
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState({ firstName: false, lastName: false });

  const {createChat} = useMessageService();
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
      createChat({firstName, lastName})
        .then((res) => {
        console.log(res);
      }).catch((err) => {
        console.error(err);
    });
      setFirstName("");
      setLastName("");
      onClose();
    }
  };

  if (!action) return null;
  
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {(action === 'create' || action === 'update') ? 
          <>
            <h3>{action === 'create' ? 'New Chat' : 'Update chat'}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                First Name:
                <input type="text" value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={(e) => validateField("firstName", e.target.value)}
                  className={errors.firstName ? "error-border" : ""} required />
              </label>
              <br />
              <label>
                Last Name:
                <input type="text" value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={(e) => validateField("lastName", e.target.value)}
                  className={errors.lastName ? "error-border" : ""} required />
              </label>
              <button type="submit">Create</button>
            </form>
          </> :
          <div>You sure?</div>
        }
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
  
}

Popup.propTypes = {
  onClose: PropTypes.func.isRequired,
  action: PropTypes.string,
};

export default Popup;
