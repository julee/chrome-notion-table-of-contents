import React from 'react';

export default (
  { isFolded, setFolded, setHidden }: {
    isFolded: boolean;
    setFolded: React.Dispatch<React.SetStateAction<boolean>>;
    setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
  const toggleFolded = () => { setFolded(prev => !prev); };

  return isFolded
    ? (
      <div id="toc-toolbar">
        <span className="clickable" onClick={toggleFolded}>＋</span>
      </div>
    )
    : (
      <div id="toc-toolbar">
        <span className="clickable" onClick={toggleFolded}>ー</span>&nbsp;
        <span className="clickable" onClick={() => setHidden(true)}>✕</span>
      </div>
    );
};