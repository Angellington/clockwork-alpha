import { createTheme, type ThemeOptions } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light", 
    primary: {
      main: "#2A2829", 
      light: "#4A4548", 
      dark: "#1A1819", 
      contrastText: "#F5F3F4",
    },
    secondary: {
      main: "#4A4548", 
      light: "#6B676A", 
      dark: "#3F3B3D", 
      contrastText: "#F5F3F4",
    },
    background: {
      default: "#E7E4E6",
      paper: "#F5F3F4",
    },
    text: {
      primary: "#2A2829", 
      secondary: "#4A4548", 
      disabled: "#C9C5C8",
    },
    divider: "#D8D4D6",
    action: {
      active: "#4A4548",
      hover: "rgba(42, 40, 41, 0.06)", 
      selected: "rgba(42, 40, 41, 0.12)",
      disabled: "#C9C5C8",
      disabledBackground: "#D8D4D6",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#2A2829",
    },
    h2: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: "#2A2829",
    },
    h3: {
      fontWeight: 600,
      color: "#2A2829",
    },
    h4: {
      fontWeight: 500,
      color: "#2A2829",
    },
    h5: {
      fontWeight: 500,
      color: "#4A4548",
    },
    h6: {
      fontWeight: 500,
      color: "#4A4548",
    },
    button: {
      textTransform: "none", 
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
    body1: {
      color: "#3F3B3D", 
    },
    body2: {
      color: "#4A4548", 
    },
  },
  shape: {
    borderRadius: 4, 
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#F5F3F4", // Destaque suave
          color: "#2A2829",
          boxShadow: "0 1px 3px rgba(42, 40, 41, 0.08)",
          borderBottom: "1px solid #D8D4D6",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 600,
          padding: "8px 20px",
          transition: "all 0.15s ease",
        },
        containedPrimary: {
          backgroundColor: "#2A2829",
          color: "#F5F3F4",
          "&:hover": {
            backgroundColor: "#3F3B3D", 
            boxShadow: "0 2px 8px rgba(42, 40, 41, 0.15)",
          },
        },
        outlinedPrimary: {
          borderColor: "#2A2829",
          color: "#2A2829",
          "&:hover": {
            backgroundColor: "rgba(42, 40, 41, 0.04)",
            borderColor: "#4A4548",
          },
        },
        outlinedSecondary: {
          borderColor: "#D8D4D6",
          color: "#4A4548",
          "&:hover": {
            backgroundColor: "rgba(74, 69, 72, 0.04)",
            borderColor: "#4A4548",
          },
        },
        textPrimary: {
          color: "#4A4548",
          "&:hover": {
            backgroundColor: "rgba(42, 40, 41, 0.04)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#F5F3F4", // Destaque suave
          border: "1px solid #D8D4D6",
          borderRadius: 6,
          boxShadow: "0 2px 8px rgba(42, 40, 41, 0.06)",
          transition: "box-shadow 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(42, 40, 41, 0.10)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#F5F3F4",
          border: "1px solid #D8D4D6",
        },
        elevation1: {
          boxShadow: "0 2px 8px rgba(42, 40, 41, 0.06)",
        },
        elevation2: {
          boxShadow: "0 4px 16px rgba(42, 40, 41, 0.08)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#F5F3F4",
          borderRight: "1px solid #D8D4D6",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#D8D4D6",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: "#E7E4E6",
          color: "#2A2829",
          border: "1px solid #D8D4D6",
        },
        colorSecondary: {
          backgroundColor: "#D8D4D6",
          color: "#3F3B3D",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#4A4548",
          textDecoration: "none",
          "&:hover": {
            color: "#2A2829",
            textDecoration: "underline",
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#E7E4E6",
          "& .MuiTableCell-head": {
            color: "#2A2829",
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #D8D4D6",
          color: "#3F3B3D",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D8D4D6",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4A4548",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2A2829",
            borderWidth: 1,
          },
        },
        input: {
          color: "#3F3B3D",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#4A4548",
          "&.Mui-focused": {
            color: "#2A2829",
          },
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
