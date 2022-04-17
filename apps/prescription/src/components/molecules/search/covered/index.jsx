import styles from './covered.module.scss';
import classNames from 'classnames';

const Covered = props => {
  return (
    <div className={styles['wrapper']}>
      <div className={classNames(styles['line'], styles[props.type])} />
      <span className={styles['title']}>{props.title}</span>
    </div>
  );
};

export default Covered;
