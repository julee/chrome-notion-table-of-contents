import React, { useState } from "react";
import { Headings as HeadingsType } from '../types';
import Headings from './headings';

export default ({ headings }: { headings: HeadingsType }) => {
  const [visible, setVisible] = useState(true);
  const [isFolding, setFolding] = useState(false);
  const handleClose = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setVisible(false);
    return event.preventDefault();
  };
  const toggleFolding = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setFolding(prev => !prev);
    return event.preventDefault();
  };

  if (!visible) {
    return null
  }

  if (isFolding) {
    return (
      <p><a href="#" onClick={toggleFolding}>[Expand]</a></p>

    );
  }

  // TODO: p はもう少しまともなマークアップにした方が ...
  return (
    <>
      <p>
        <a href="#" onClick={toggleFolding}>[Fold]</a>
        <a href="#" onClick={handleClose}>[Close]</a>
      </p>
      <Headings headings={headings} />
    </>
  );
};