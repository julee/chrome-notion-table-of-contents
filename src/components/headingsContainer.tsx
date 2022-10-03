import React, { useEffect, useState } from 'react';
import Headings from './headings';

export default () => {
  const [isVisible, setVisible] = useState(true);
  const [isFolding, setFolding] = useState(false);

  const handleClose = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setVisible(false);
    return event.preventDefault();
  };
  const toggleFolding = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setFolding(prev => !prev);
    return event.preventDefault();
  };

  useEffect(() => {
    const eventReceiver = document.getElementById('toc-event-receiver');
    if (!eventReceiver) { return; }

    eventReceiver.addEventListener('actionClicked', () => {
      setVisible(visible => !visible);
    });
  }, []);

  return (
    <div id="toc-container" style={isVisible ? {} : { display: 'none' }}>
      {
        isFolding
          ? (<p><a href="#" onClick={toggleFolding}>[Expand]</a></p>)
          : (<>
            <p>
              <a href="#" onClick={toggleFolding}>[Fold]</a>
              <a href="#" onClick={handleClose}>[Close]</a>
            </p>
          </>
          )
      }
      <div style={isFolding ? { display: 'none' } : {}}>
        <Headings />
      </div>
      <div id="toc-event-receiver"></div>
    </div>
  );
};