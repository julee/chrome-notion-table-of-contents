import { createContext, useContext } from 'react';

export const ThemeContext = createContext<Theme | undefined>(undefined);
export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('Wrap this component with Provider.');
  return theme;
};
