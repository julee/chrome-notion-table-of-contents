import React from 'react';

export default (
  { isFolding, setFolding, setVisible }: {
    isFolding: boolean;
    setFolding: React.Dispatch<React.SetStateAction<boolean>>;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
  const toggleFolding = () => { setFolding(prev => !prev); };

  return isFolding
    ? (
      <div id="toc-toolbar">
        <span className="clickable" onClick={toggleFolding}>＋</span>
      </div>
    )
    : (
      <div id="toc-toolbar">
        <span className="clickable" onClick={toggleFolding}>ー</span>&nbsp;
        <span className="clickable" onClick={() => setVisible(false)}>✕</span>
      </div>
    );
};