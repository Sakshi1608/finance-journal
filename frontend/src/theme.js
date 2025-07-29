import { createTheme } from '@mui/material/styles';

const commonPalette = {
  secondary: {
    main: '#2C666E',
  },
  info: {
    main: '#90DDF0',
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#07393C',
    },
    background: {
      default: '#F0EDEE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0A090C',
    },
    ...commonPalette,
  },
  typography: {
    fontFamily: `'Segoe UI', Roboto, sans-serif`,
  },
  shape: {
    borderRadius: 8,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90DDF0',
    },
    background: {
      default: '#0A090C',
      paper: '#1c1b1f',
    },
    text: {
      primary: '#F0EDEE',
    },
    ...commonPalette,
  },
  typography: {
    fontFamily: `'Segoe UI', Roboto, sans-serif`,
  },
  shape: {
    borderRadius: 8,
  },
});