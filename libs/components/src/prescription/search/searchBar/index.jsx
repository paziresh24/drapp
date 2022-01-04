import styles from './searchBar.module.scss';

import SearchIcon from '../../../icons/public/search';

const SearchBar = props => {
    const changeHandlre = e => {
        props.value && props.value(e.target.value);
    };

    return (
        <div className={styles['wrapper']}>
            <SearchIcon className={styles['icon']} />
            <input
                className={styles['input']}
                type="text"
                placeholder={props.label}
                onChange={changeHandlre}
            />
        </div>
    );
};

export default SearchBar;
