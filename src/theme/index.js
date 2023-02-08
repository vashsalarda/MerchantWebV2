import { createTheme } from '@material-ui/core';

import palette from './palette';
import typography from './typography';
import overrides from './overrides';

const theme = createTheme({
  fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
  palette,
  typography,
  overrides,
  zIndex: {
    appBar: 1200,
    drawer: 1100
  }
});

export default theme;
