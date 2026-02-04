import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const TabNav = ({ onChange, value }) => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "rgba(255, 255, 255, 0.2)",
        marginTop: "10px",
      }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        variant="scrollable"
        scrollButtons={false}
        aria-label="scrollable prevent tabs example"
      >
        <Tab label="Today" />
        <Tab label="Tomorrow" />
        <Tab label="Next 7 days" />
      </Tabs>
    </Box>
  );
};

export default TabNav;
