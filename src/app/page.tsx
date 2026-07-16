import { Editor, Viewer } from '@/components';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.editorPanel}>
        <Editor />
      </div>
      <div className={styles.viewerPanel}>
        <Viewer />
      </div>
    </div>
  );
}
