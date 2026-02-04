import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const TabNav = ({ onChange, value }) => {
  return (
    <Box
      sx={{
        width: "auto",
        margin: { xs: "4px 0px", sm: "6px 0px", md: "8px 0px" },
        bgcolor: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "12px",
        padding: { xs: "3px", sm: "4px" },
        boxShadow: "rgba(0, 0, 0, 0.08) 0px 5px 15px",
        "& .MuiTabs-indicator": {
          backgroundColor: "#667eea",
          height: "2px",
          borderRadius: "2px",
        },
        "& .MuiTab-root": {
          color: "#2d2d44",
          fontWeight: 500,
          fontFamily: "'Poppins', sans-serif",
          textTransform: "none",
          fontSize: { xs: "11px", sm: "12px", md: "13px" },
          minHeight: { xs: "32px", sm: "36px" },
          minWidth: { xs: "auto", sm: "80px" },
          padding: { xs: "6px 10px", sm: "8px 12px" },
          "&.Mui-selected": {
            color: "#1a1a2e",
            fontWeight: 600,
          },
        },
      }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="weather forecast tabs"
        allowScrollButtonsMobile
      >
        <Tab label="Today" />
        <Tab label="Tomorrow" />
        <Tab label="Next 7 days" />
      </Tabs>
    </Box>
  );
};

export default TabNav;
