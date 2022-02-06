import axios from "axios";
import { Card } from "@mui/material";
import CurrencyDropdown from "./currencySelectDropdown";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { Collapse } from "@mui/material";
import { CardContent, Box } from "@mui/material";
import ExchangeIcon from "./exchangeIcon";
import { Typography } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import InputAdornment from "@mui/material/InputAdornment";

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
  const [amount, setAmount] = useState("15");
  const [displayAmount, setDisplayAmount] = useState("");
  const [computedExchange, setComputedExchange] = useState("");
  const [expand, setExpandState] = useState(false);
  const [displayComputed, setDisplayComputed] = useState({});

  const currencyCalculator = () => {
    const calculatedValue = isExchangeInversed
      ? amount *
        (currencyData[renderToComponent.currency.code] /
          currencyData[renderFromComponent.currency.code])
      : amount *
        (currencyData[renderFromComponent.currency.code] /
          currencyData[renderToComponent.currency.code]);

    setComputedExchange(calculatedValue.toFixed(8));
  };

  useEffect(() => {
    currencyCalculator();
  }, [isExchangeInversed]);

  useEffect(() => {
    setDisplayComputed({
      blackText: computedExchange.slice(0, -6),
      greyText: computedExchange.slice(-6),
    });
  }, [computedExchange]);

  const handleChange = (event) => {
    event.target.value > 0 ? setAmount(event.target.value) : setAmount(0);
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
    <>
      <Card
        sx={{ borderRadius: "20px", maxWidth: 930 }}
        className="mx-auto my-3"
      >
        <div className="flex py-1 justify-center items-end mb-5">
          <div className="ml-2">
            <div className="field-title">Amount</div>
            <Box sx={{ borderRadius: 10 }}>
              <TextField
                sx={{
                  maxWidth: "196px",
                  marginRight: "10px",
                }}
                type="number"
                error={amount.length ? false : true}
                id="outlined-basic"
                variant="outlined"
                value={amount}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {isExchangeInversed
                        ? renderFromComponent.currency.symbol
                        : renderToComponent.currency.symbol}
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </div>
          <div>
            <div className="ml-2">
              <div className="field-title"> From </div>
            </div>
            {isExchangeInversed
              ? renderFromComponent.render
              : renderToComponent.render}
          </div>
          <div className="mx-3">
            <button
              className="flex border-2 rounded-xl py-2 px-1"
              onClick={() => {
                setIsExchangeInversed(
                  (prevIsExchangeInversed) => !prevIsExchangeInversed
                );
              }}
            >
              <div
                className={`transition ease-in-out ${
                  isExchangeInversed ? "rotate-180" : "rotate-0"
                } duration-300 `}
              >
                <ExchangeIcon></ExchangeIcon>
              </div>
            </button>
          </div>
          <div>
            <div className="field-title"> To </div>

            {isExchangeInversed
              ? renderToComponent.render
              : renderFromComponent.render}
          </div>
          <div className="px-2 mt-9">
            <Button
              disabled={amount.length ? false : true}
              sx={{
                borderRadius: "10px",
                bgcolor: "#191C1F",
                height: 48,
                width: 125,
                textTransform: "capitalize",
              }}
              variant="contained"
              onClick={() => {
                setExpandState(true);
                currencyCalculator();
                setDisplayAmount(amount);
              }}
            >
              <Typography color="white" fontSize={"15px"}>
                Convert
              </Typography>
            </Button>
          </div>
        </div>

        <Collapse in={expand} timeout="auto" unmountOnExit>
          <CardContent className="ml-6">
            <div className="mb-10">
              <div className="mb-1 mt-1">
                <Typography fontSize={17} fontWeight={700}>
                  {displayAmount}{" "}
                  {isExchangeInversed
                    ? renderFromComponent.currency.code
                    : renderToComponent.currency.code}{" "}
                  =
                </Typography>
              </div>
              <div className="flex justify-between items-center">
                <Typography fontSize={34} fontWeight={700} className="flex">
                  {displayComputed.blackText}
                  <span>{displayComputed.greyText}</span>
                  {isExchangeInversed
                    ? renderToComponent.currency.code
                    : renderFromComponent.currency.code}
                </Typography>
                <div className="mr-4">
                  <button onClick={() => setExpandState(false)}>
                    <ArrowLeftIcon fontSize="large" className="rotate-90" />
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-2 text-base flex justify-between">
              <div>
                {displayAmount}{" "}
                {isExchangeInversed
                  ? renderFromComponent.currency.code
                  : renderToComponent.currency.code}{" "}
                = {computedExchange.split(".")[0]}{" "}
                {isExchangeInversed
                  ? renderToComponent.currency.code
                  : renderFromComponent.currency.code}
              </div>
              <div className="mr-2">
                Last Updated{" "}
                {new Date(
                  currencyApiCall.query.timestamp * 1000
                ).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
}
