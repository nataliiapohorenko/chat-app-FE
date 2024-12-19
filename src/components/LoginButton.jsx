import PropTypes from 'prop-types';
import '../styles/LoginButton.scss';

function LoginButton({setIsAuthenticated}) {
  return (
    <button onClick={()=> {localStorage.clear(); setIsAuthenticated(false)}} className="login-button" >
        Log out
    </button>
  );
}

LoginButton.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired
};


export default LoginButton;
