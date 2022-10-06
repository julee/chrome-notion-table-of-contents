import React, { useEffect, useState } from 'react';
import Headings from './headings';
import Toolbar from './toolbar';

export default () => {
  const [isVisible, setVisible] = useState(true);
  const [isFolding, setFolding] = useState(false);

  useEffect(() => {
    const eventReceiver = document.getElementById('toc-event-receiver');
    if (!eventReceiver) { return; }

    eventReceiver.addEventListener('toggleVisibility', () => setVisible(visible => !visible));
  }, []);

  return (
    <div id="toc-container" style={isVisible ? {} : { display: 'none' }}>
      <Toolbar isFolding={isFolding} setFolding={setFolding} setVisible={setVisible} />
      <div style={isFolding ? { display: 'none' } : {}}>
        <Headings />
      </div>
      <div id="toc-event-receiver"></div>
    </div>
  );
};