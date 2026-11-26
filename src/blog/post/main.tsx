import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Revealed } from '../../components/Revealed';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import '@fontsource-variable/instrument-sans/wdth.css';
import '../blog.css';
import { Post } from './Post';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Revealed>
      <Post />
    </Revealed>
  </StrictMode>,
);
