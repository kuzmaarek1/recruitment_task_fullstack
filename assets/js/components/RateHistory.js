import React, { useState, useEffect } from "react";
import axios from "axios";

const RateHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const currencies = [
    { code: "EUR", name: "Euro" },
    { code: "USD", name: "Dolar amerykański" },
    { code: "CZK", name: "Korona czeska" },
    { code: "IDR", name: "Rupia indonezyjska" },
    { code: "BRL", name: "Real brazylijski" },
  ];

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/rate-history", {
          params: {
            currency: selectedCurrency,
            date: selectedDate,
          },
        });
        if (Array.isArray(response.data)) {
          setHistoryData(response.data);
        } else {
          console.error(
            "API zwróciło nieprawidłowy format danych:",
            response.data
          );
          setError("Nieprawidłowy format danych z API");
        }
      } catch (err) {
        console.error("Błąd podczas pobierania historii:", err);
        setError("Nie udało się pobrać historii kursów");
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  const handleShowHistory = () => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/rate-history", {
          params: {
            currency: selectedCurrency,
            date: selectedDate,
          },
        });
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setHistoryData(response.data);
        } else {
          console.error(
            "API zwróciło nieprawidłowy format danych:",
            response.data
          );
          setError("Nieprawidłowy format danych z API");
        }
      } catch (err) {
        console.error("Błąd podczas pobierania historii:", err);
        setError("Nie udało się pobrać historii kursów");
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  };

  const formatCurrency = (value) => {
    if (value === null) return "-";
    return value.toFixed(4) + " PLN";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL");
  };

  const formatChange = (currentRate, previousRate) => {
    if (!previousRate) return <span className="text-muted">-</span>;
    const change = currentRate - previousRate;
    const sign = change >= 0 ? "+" : "";
    const color = change >= 0 ? "text-success" : "text-danger";
    return (
      <span className={color}>
        {sign}
        {change.toFixed(4)} PLN
      </span>
    );
  };

  const calculateExchangeRates = (nbpRate, currency) => {
    if (currency === "EUR" || currency === "USD") {
      return {
        buyRate: nbpRate - 0.15,
        sellRate: nbpRate + 0.11,
      };
    } else {
      return {
        buyRate: null,
        sellRate: nbpRate + 0.2,
      };
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          Ładowanie historii...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Historia kursów walut</h2>

          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Filtry</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="currencySelect" className="form-label">
                    Wybierz walutę:
                  </label>
                  <select
                    className="form-control"
                    id="currencySelect"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="dateInput" className="form-label">
                    Wybierz datę:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateInput"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleShowHistory}
                  >
                    Pokaż historię
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col">
                  <h5 className="mb-0">
                    Historia kursów {selectedCurrency} - ostatnie 14 dni przed{" "}
                    {formatDate(selectedDate)}
                  </h5>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col" className="text-center">
                        Data
                      </th>
                      <th scope="col" className="text-center">
                        Kurs NBP
                      </th>
                      <th scope="col" className="text-center">
                        Kurs kupna
                      </th>
                      <th scope="col" className="text-center">
                        Kurs sprzedaży
                      </th>
                      <th scope="col" className="text-center">
                        Zmiana
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(historyData) && historyData.length > 0 ? (
                      historyData.map((rate, index) => {
                        const exchangeRates = calculateExchangeRates(
                          rate.mid,
                          rate.currency
                        );
                        const previousRate =
                          index > 0 ? historyData[index - 1].mid : null;
                        return (
                          <tr
                            key={rate.id}
                            className={index % 2 === 0 ? "table-striped" : ""}
                          >
                            <td className="text-center font-weight-bold">
                              {formatDate(rate.date)}
                            </td>
                            <td className="text-center text-info">
                              {formatCurrency(rate.mid)}
                            </td>
                            <td className="text-center">
                              {exchangeRates.buyRate ? (
                                <span className="text-success font-weight-bold">
                                  {formatCurrency(exchangeRates.buyRate)}
                                </span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td className="text-center">
                              <span className="text-danger font-weight-bold">
                                {formatCurrency(exchangeRates.sellRate)}
                              </span>
                            </td>
                            <td className="text-center">
                              {formatChange(rate.mid, previousRate)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          Brak danych do wyświetlenia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer">
              <div className="row">
                <div className="col-md-6">
                  <small className="text-muted">
                    <strong>EUR, USD:</strong> Kurs kupna = NBP - 0.15 PLN, Kurs
                    sprzedaży = NBP + 0.11 PLN
                  </small>
                </div>
                <div className="col-md-6 text-right">
                  <small className="text-muted">
                    <strong>CZK, IDR, BRL:</strong> Tylko sprzedaż = NBP + 0.20
                    PLN
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateHistory;
