import axios from "axios";
import { Card } from "@mui/material";
import CurrencyDropdown from "./currencySelectDropdown";
import { Button } from "@mui/material";
import { useState } from "react";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import { TextField } from "@mui/material";
import { Collapse } from "@mui/material";
import { CardContent } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
const currencyApiCall = getCurrencyData();
const currencyData = { ...currencyApiCall.data, USD: 1 };
const countryCodes = [...Object.keys(currencyData)];

export default function ExchangeContainer() {
  const [isExchangeInversed, setIsExchangeInversed] = useState(false);
  const [amount, setAmount] = useState("");
  const [computedExchange, setComputedExchange] = useState("");
  const [expand, setExpandState] = useState(false);

  const currencyCalculator = (from, to, amount) => {
    return isExchangeInversed
      ? (currencyData[to] / currencyData[from]) * amount
      : (currencyData[from] / currencyData[to]) * amount;
  };

  const handleChange = (event) => {
    setAmount(event.target.value);
  };
  const renderFromComponent = CurrencyDropdown({
    initial: "USD",
    countryCodes,
  });
  const renderToComponent = CurrencyDropdown({
    initial: "EUR",
    countryCodes,
  });

  return (
    <div className="max-w-6xl my-10 mx-auto p-2">
      <Card>
        <div className="flex py-4 justify-center">
          <div className="mr-8">
            <div className="mb-2 ml-2 text-xl">Amount</div>
            <TextField
              error={amount.length ? false : true}
              helperText={amount.length ? "" : "Field must not be empty."}
              id="outlined-basic"
              variant="outlined"
              value={amount}
              onChange={handleChange}
            />
          </div>
          <div>
            <div className="mb-2 ml-2 text-xl">From</div>
            {isExchangeInversed
              ? renderFromComponent.render
              : renderToComponent.render}
          </div>
          <div className="mt-8">
            <button
              onClick={() => {
                setIsExchangeInversed(!isExchangeInversed);
                setComputedExchange(
                  isExchangeInversed
                    ? amount *
                        (currencyData[renderToComponent.currency] /
                          currencyData[renderFromComponent.currency])
                    : amount *
                        (currencyData[renderFromComponent.currency] /
                          currencyData[renderToComponent.currency])
                );
              }}
            >
              <div
                className={`transition ease-in-out ${
                  isExchangeInversed ? "rotate-180" : "rotate-0"
                } duration-300 `}
              >
                <ChangeCircleOutlinedIcon
                  sx={{ fontSize: 50, opacity: 0.9 }}
                  color="primary"
                />
              </div>
            </button>
          </div>
          <div>
            <div className="mb-2 ml-2 text-xl">To</div>
            {isExchangeInversed
              ? renderToComponent.render
              : renderFromComponent.render}
          </div>
          <div className="p-1 ml-8 mt-8">
            <Button
              disabled={amount.length ? false : true}
              sx={{ borderRadius: 50 }}
              variant="contained"
              onClick={() => {
                setExpandState(true);
                const response = isExchangeInversed
                  ? amount *
                    (currencyData[renderToComponent.currency] /
                      currencyData[renderFromComponent.currency])
                  : amount *
                    (currencyData[renderFromComponent.currency] /
                      currencyData[renderToComponent.currency]);
                setComputedExchange(response);
                setComputedExchange(response);
              }}
            >
              Convert
            </Button>
          </div>
        </div>

        <Collapse in={expand} timeout="auto" unmountOnExit>
          <CardContent>
            <div className="flex justify-between px-10">
              <div>
                {computedExchange}{" "}
                {isExchangeInversed
                  ? renderToComponent.currency
                  : renderFromComponent.currency}
              </div>
              <button>
                <KeyboardArrowDownIcon
                  className="rotate-180"
                  onClick={() => setExpandState(false)}
                />
              </button>
            </div>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
}
