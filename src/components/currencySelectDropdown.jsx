import { useState } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const countryList = require("../assets/countries.json");

export default function CurrencyDropdown(props) {
  const [currency, setCurrency] = useState(props.initial);

  const filteredCountries = props.countryCodes
    .map((code) =>
      countryList.find((country) => country.currency.code === code)
    )
    .filter((valid) => valid !== undefined);

  const handleChange = function (event) {
    setCurrency(event.target.value);
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
      },
    },
  };

  return {
    currency,
    render: (
      <div>
        <Box>
          <FormControl>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              displayEmpty
              value={currency}
              onChange={handleChange}
              MenuProps={MenuProps}
              sx={{ borderRadius: "10px", width: "240px" }}
            >
              {filteredCountries.map((country) => (
                <MenuItem value={country.currency.code} key={country.name}>
                  <div className="flex items-center">
                    <img
                      className="mr-2 rounded-md border-solid border-2 border-gray-200"
                      src={"data:image/png;base64," + country.flag}
                      alt={country.name}
                    />
                    <div className="mr-4">
                      {country.currency.code} - {country.currency.name}
                    </div>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
    ),
  };
}
