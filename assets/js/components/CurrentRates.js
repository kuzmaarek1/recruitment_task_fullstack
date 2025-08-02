import React, { useState, useEffect } from "react";
import axios from "axios";

const CurrentRates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentRates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/current-rates");
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
          setRates(response.data);
        } else {
          console.error(
            "API zwróciło nieprawidłowy format danych:",
            response.data
          );
          setError("Nieprawidłowy format danych z API");
        }
      } catch (err) {
        console.error("Błąd podczas pobierania kursów:", err);
        setError("Nie udało się pobrać aktualnych kursów walut");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentRates();
  }, []);

  const formatCurrency = (value) => {
    if (value === null) return "-";
    return value.toFixed(4) + " PLN";
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pl-PL");
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
          Ładowanie kursów walut...
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
          <h2 className="mb-4">Aktualne kursy walut</h2>

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col">
                  <h5 className="mb-0">Kursy kantoru</h5>
                </div>
                <div className="col-auto">
                  <small className="text-muted">
                    Ostatnia aktualizacja: {formatDateTime(rates[0]?.date)}
                  </small>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col" className="text-center">
                        Waluta
                      </th>
                      <th scope="col" className="text-center">
                        Nazwa
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
                    {Array.isArray(rates) && rates.length > 0 ? (
                      rates.map((rate, index) => {
                        const exchangeRates = calculateExchangeRates(
                          rate.mid,
                          rate.currency
                        );
                        return (
                          <tr
                            key={rate.id}
                            className={index % 2 === 0 ? "table-striped" : ""}
                          >
                            <td className="text-center font-weight-bold">
                              <span className="badge badge-primary">
                                {rate.currency}
                              </span>
                            </td>
                            <td className="text-center">{rate.currencyName}</td>
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
                              {exchangeRates.buyRate ? (
                                <span className="text-warning">
                                  {(
                                    exchangeRates.sellRate -
                                    exchangeRates.buyRate
                                  ).toFixed(4)}{" "}
                                  PLN
                                </span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
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

export default CurrentRates;
