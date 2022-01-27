import "./App.css";
import { Box } from "@mui/system";

function App() {
  const countryList = require("./assets/countries.json");

  return (
    <div className="App">
      {countryList.map((country) => (
        <Box
          key={country.id}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box>{country.name}</Box>
          <img
            className="m-4"
            src={"data:image/png;base64," + country.flag}
            alt={country.name}
          />
        </Box>
      ))}
    </div>
  );
}

export default App;
