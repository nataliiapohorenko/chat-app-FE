import PropTypes from 'prop-types';

import '../styles/SearchBar.scss';


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
            <button className="search-panel__button">S</button>
    </div>
    )
}

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default SearchBar;