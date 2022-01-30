import { Card } from "@mui/material";
import CurrencyDropdown from "./currencySelectDropdown";
import { Button } from "@mui/material";
import { useState } from "react";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import { TextField } from "@mui/material";

export default function ExchangeContainer() {
  const [button, setButton] = useState(false);

  function changeCurrencyOrder() {
    setButton(!button);
  }

  const { render: renderFromComponent, currency: currencyFrom } =
    CurrencyDropdown({
      initial: "USD",
    });
  const { render: renderToComponent, currency: currencyTo } = CurrencyDropdown({
    initial: "EUR",
  });

  return (
    <div className="max-w-6xl">
      <Card className="flex py-4 justify-center">
        <div className="mr-8">
          <div className="mb-2 ml-2 text-xl">Amount</div>
          <TextField id="outlined-basic" variant="outlined" />
        </div>
        <div>
          <div className="mb-2 ml-2 text-xl">From</div>
          {button ? renderFromComponent : renderToComponent}
        </div>
        <div className="mt-8">
          <button
            onClick={() => {
              changeCurrencyOrder();
            }}
          >
            <div
              className={` transition ease-in-out rotate-${
                button ? "180" : "0"
              }`}
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
          {button ? renderToComponent : renderFromComponent}
        </div>
        <div className="p-1 ml-8 mt-8">
          <Button
            sx={{ borderRadius: 50 }}
            variant="contained"
            onClick={() => {}}
          >
            Convert
          </Button>
        </div>
      </Card>
    </div>
  );
}
