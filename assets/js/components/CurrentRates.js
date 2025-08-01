import React, { useState, useEffect } from 'react';

const CurrentRates = () => {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fikcyjne dane JSON z aktualnymi kursami walut (struktura zgodna z API)
    const mockRatesData = [
        {
            "id": 1,
            "date": "2025-01-15",
            "currency": "EUR",
            "currencyName": "euro",
            "mid": 4.2813
        },
        {
            "id": 2,
            "date": "2025-01-15",
            "currency": "USD",
            "currencyName": "dolar amerykański",
            "mid": 3.7536
        },
        {
            "id": 3,
            "date": "2025-01-15",
            "currency": "CZK",
            "currencyName": "korona czeska",
            "mid": 0.1744
        },
        {
            "id": 4,
            "date": "2025-01-15",
            "currency": "IDR",
            "currencyName": "rupia indonezyjska",
            "mid": 0.00022763
        },
        {
            "id": 5,
            "date": "2025-01-15",
            "currency": "BRL",
            "currencyName": "real (Brazylia)",
            "mid": 0.6703
        }
    ];

    useEffect(() => {
        // Symulacja ładowania danych
        setTimeout(() => {
            setRates(mockRatesData);
            setLoading(false);
        }, 500);
    }, []);

    const formatCurrency = (value) => {
        if (value === null) return "-";
        return value.toFixed(4) + " PLN";
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('pl-PL');
    };

    // Funkcja do obliczania kursów kantoru na podstawie kursu NBP
    const calculateExchangeRates = (nbpRate, currency) => {
        if (currency === 'EUR' || currency === 'USD') {
            return {
                buyRate: nbpRate - 0.15,
                sellRate: nbpRate + 0.11
            };
        } else {
            return {
                buyRate: null,
                sellRate: nbpRate + 0.20
            };
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Ładowanie...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">
                        <i className="fas fa-chart-line mr-2"></i>
                        Aktualne kursy walut
                    </h2>
                    
                    <div className="card">
                        <div className="card-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h5 className="mb-0">Kursy kantoru</h5>
                                </div>
                                <div className="col-auto">
                                    <small className="text-muted">
                                        Ostatnia aktualizacja: {formatDateTime(mockRatesData[0].date)}
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col" className="text-center">Waluta</th>
                                            <th scope="col" className="text-center">Nazwa</th>
                                            <th scope="col" className="text-center">Kurs NBP</th>
                                            <th scope="col" className="text-center">Kurs kupna</th>
                                            <th scope="col" className="text-center">Kurs sprzedaży</th>
                                            <th scope="col" className="text-center">Spread</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rates.map((rate, index) => {
                                            const exchangeRates = calculateExchangeRates(rate.mid, rate.currency);
                                            return (
                                                <tr key={rate.id} className={index % 2 === 0 ? 'table-striped' : ''}>
                                                    <td className="text-center font-weight-bold">
                                                        <span className="badge badge-primary">{rate.currency}</span>
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
                                                                {(exchangeRates.sellRate - exchangeRates.buyRate).toFixed(4)} PLN
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row">
                                <div className="col-md-6">
                                    <small className="text-muted">
                                        <strong>EUR, USD:</strong> Kurs kupna = NBP - 0.15 PLN, Kurs sprzedaży = NBP + 0.11 PLN
                                    </small>
                                </div>
                                <div className="col-md-6">
                                    <small className="text-muted">
                                        <strong>CZK, IDR, BRL:</strong> Tylko sprzedaż = NBP + 0.20 PLN
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