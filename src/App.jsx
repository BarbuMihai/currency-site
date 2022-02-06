import "./App.css";
import ExchangeContainer from "./components/exchangeContainer";
import ExchangeTable from "./components/exchangeTable";

// No Country
// CUC
// SDG
// URY
// HRV
// TMT
// GHS
// BIH
// SSP
// XRP
// BTC
// ETH
// LTC

function App() {
  return (
    <div className="App">
      <ExchangeContainer />
      <ExchangeTable></ExchangeTable>
    </div>
  );
}

export default App;
