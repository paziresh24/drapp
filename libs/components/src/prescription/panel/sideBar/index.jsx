import styles from './sidebar.module.css';
import PlusIcon from '../../../icons/public/plus';

const SideBar = () => {
   return (
      <div className={styles['wrapper']}>
         <div className={styles['titleBar']}>
            <span>نسخه های من</span>
            <PlusIcon />
         </div>
      </div>
   );
};

export default SideBar;
