import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { ChevronIcon, SearchIcon } from '../../icons';
import styles from './sidebar.module.scss';

const Sidebar = ({ videos, setSelectVideo }) => {
    const [videosFilter, setVideosFilter] = useState('');
    return (
        <div className={`${styles.wrapper} ${isMobile && styles.mobile}`}>
            <div className={styles.search}>
                <SearchIcon />
                <input
                    type="text"
                    placeholder="جستجو ..."
                    onChange={e => setVideosFilter(e.target.value)}
                />
            </div>
            {videos.map(
                video =>
                    video.name.toLowerCase().includes(videosFilter) && (
                        <div
                            className={styles.item}
                            key={video.id}
                            onClick={() => setSelectVideo(video.id)}
                            aria-hidden
                        >
                            <div className={styles.itemHeader}>
                                <span className={styles.title}>{video.name}</span>
                                <ChevronIcon dir="left" color="#27bda0" />
                            </div>
                            <span className={styles.duration}>{video.length}</span>
                        </div>
                    )
            )}
        </div>
    );
};

export default Sidebar;
