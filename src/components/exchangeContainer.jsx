import axios from "axios";
import { Card } from "@mui/material";
import CurrencyDropdown from "./currencySelectDropdown";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { Collapse } from "@mui/material";
import { CardContent } from "@mui/material";
import ExchangeIcon from "./exchangeIcon";
import { Typography } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

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
        (currencyData[renderToComponent.currency] /
          currencyData[renderFromComponent.currency])
      : amount *
        (currencyData[renderFromComponent.currency] /
          currencyData[renderToComponent.currency]);

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
    <>
      <Card sx={{ borderRadius: "20px", maxWidth: 930 }} className="mx-auto">
        <div className="flex py-1 justify-center items-end mb-5">
          <div className="ml-2">
            <div className="field-title">Amount</div>
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
            />
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
                    ? renderFromComponent.currency
                    : renderToComponent.currency}{" "}
                  =
                </Typography>
              </div>
              <div className="flex justify-between items-center">
                <Typography fontSize={34} fontWeight={700} className="flex">
                  {displayComputed.blackText}
                  <span>{displayComputed.greyText}</span>
                  {isExchangeInversed
                    ? renderToComponent.currency
                    : renderFromComponent.currency}
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
                  ? renderFromComponent.currency
                  : renderToComponent.currency}{" "}
                = {computedExchange.split(".")[0]}{" "}
                {isExchangeInversed
                  ? renderToComponent.currency
                  : renderFromComponent.currency}
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
