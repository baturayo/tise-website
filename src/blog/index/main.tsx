import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Revealed } from '../../components/Revealed';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import '@fontsource-variable/instrument-sans/wdth.css';
import '../blog.css';
import { BlogIndex } from './BlogIndex';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Revealed>
      <BlogIndex />
    </Revealed>
  </StrictMode>,
);
