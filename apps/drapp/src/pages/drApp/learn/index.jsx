import styles from '@assets/styles/pages/drApp/learn.module.scss';

import { useState, useEffect } from 'react';
import Sidebar from '@components/molecules/learn/sidebar';
import Video from '@components/molecules/learn/video';

import { isMobile } from 'react-device-detect';
import videos from '@paziresh24/constants/learnVideos.json';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const Learn = () => {
    const { search } = useLocation();
    const urlParams = queryString.parse(search);
    const [selectVideo, setSelectVideo] = useState(isMobile ? null : 1);

    useEffect(() => {
        if (urlParams.section) {
            setSelectVideo(+urlParams.section);
        }
    }, []);

    return (
        <div className={styles.wrapper}>
            <Sidebar videos={videos} setSelectVideo={setSelectVideo} />
            <Video
                video={videos.find(video => video.id === selectVideo)}
                selectVideo={selectVideo}
                setSelectVideo={setSelectVideo}
            />
        </div>
    );
};

export default Learn;
