import '../styles/SearchBar.scss';


function SearchBar(){
    return(
        <div className="search-panel">
            <input
                type="text"
                placeholder="Search"
                className="search-panel__input"
            />
            <button className="search-panel__button">S</button>
    </div>
    )
}

export default SearchBar;