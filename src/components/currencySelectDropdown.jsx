import axios from "axios";
import { useState } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const countryList = require("../assets/countries.json");

const getCurrencyData = function () {
  if (process.env.REACT_APP_ENV === "production") {
    axios
      .get(process.env.REACT_APP_CURRENCY_END_POINT, {
        params: {
          apikey: process.env.REACT_APP_CURRENCY_API_TOKEN,
        },
      })
      .then((response) => {
        return response.data;
      });
  } else return require("../assets/currencyResponse.json");
};

export default function CurrencyDropdown(props) {
  const [currency, setCurrency] = useState(props.initial);

  const countryCodes = [...Object.keys(getCurrencyData().data)].concat("USD");
  const filteredCountries = countryCodes
    .map(
      (code) =>
        countryList.filter((country) => country.currency.code === code)[0]
    )
    .filter((valid) => valid !== undefined);

  const handleChange = function (event) {
    setCurrency(event.target.value);
  };

  const MenuProps = {
    PaperProps: {
      style: {
        margin: 5,
        maxWidth: 300,
        maxHeight: 300,
        padding: 0,
      },
    },
  };

  return {
    //TODO Return Symbol as well or perhaps whole object
    currency,
    render: (
      <div>
        <Box className="m-2" sx={{ minWidth: 300 }}>
          <FormControl fullWidth>
            <Select
              sx={{
                marginBottom: 2,
                maxWidth: 300,
                borderColor: "red",
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              displayEmpty
              value={currency}
              onChange={handleChange}
              MenuProps={MenuProps}
            >
              {filteredCountries.map((country) => (
                <MenuItem value={country.currency.code} key={country.name}>
                  <div className="flex items-center">
                    <img
                      className="mr-2 rounded-md border-solid border-2 border-gray-200"
                      src={"data:image/png;base64," + country.flag}
                      alt={country.name}
                    />
                    {country.currency.code} - {country.name}
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
