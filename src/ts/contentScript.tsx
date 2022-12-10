import React from 'react';
import { createRoot } from 'react-dom/client';
import '../postcss/style.pcss';
import Container from './components/Container';
import { waitFor } from './utils';

const root = document.createElement('div');
root.className = 'toc-react-root';
document.body.appendChild(root);

const sidebar = await waitFor('.notion-sidebar .notion-scroller');
sidebar.insertBefore(root, sidebar.firstElementChild);

createRoot(root).render(<Container />);
