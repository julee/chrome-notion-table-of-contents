import React from 'react';
import { createRoot } from 'react-dom/client';
import '../postcss/style.pcss';
import Container from './components/Container';

const root = document.createElement('div');
document.body.appendChild(root);

createRoot(root).render(<Container />);

const div = document.createElement('div');
div.classList.add('toc-has-mounted');
document.body.appendChild(div);
