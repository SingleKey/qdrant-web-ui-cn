export const muiMenuTheme = {
  styleOverrides: {
    paper: ({ theme }) => {
      const styles = {
        backgroundColor: theme.palette.background.default,
        backgroundImage: "none",
      };
      return styles;
    },
  },
};
export const muiMenuItemTheme = {
  styleOverrides: {
    root: ({ theme }) => {
      const styles = {
        color: theme.palette.text.primary,
      };
      return styles;
    },
  },
};

export const dropdownTheme = {
  MuiMenu: muiMenuTheme,
  MuiAutocomplete: muiMenuTheme,
  MuiMenuItem: muiMenuItemTheme,
};
