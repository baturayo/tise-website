import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import '@fontsource-variable/instrument-sans/wdth.css';
import '../blog.css';
import { Post } from './Post';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Post />
  </StrictMode>,
);
