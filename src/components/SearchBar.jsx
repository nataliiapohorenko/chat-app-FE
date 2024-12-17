import PropTypes from 'prop-types';

import '../styles/SearchBar.scss';
import findimd from '../assets/find.svg';


function SearchBar({ onSearch }){

    const handleInputChange = (e) => {
        onSearch(e.target.value); 
    };

    return(
        <div className="search-panel">
            <input
                type="text"
                placeholder="Search"
                onChange={handleInputChange}
                className="search-panel__input"
            />
            <img src={findimd} alt="find" className='search-panel__img'/>
    </div>
    )
}

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default SearchBar;