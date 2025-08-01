import React, { useState, useEffect } from 'react';

const RateHistory = () => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCurrency, setSelectedCurrency] = useState('EUR');
    const [selectedDate, setSelectedDate] = useState('2024-01-15');

    const mockHistoryData = [
        {
            "id": 1,
            "date": "2025-01-02",
            "currency": "EUR",
            "currencyName": "euro",
            "mid": 4.32
        },
        {
            "id": 2,
            "date": "2025-01-03",
            "currency": "EUR",
            "currencyName": "euro",
            "mid": 4.35
        },
        {
            "id": 3,
            "date": "2025-01-04",
            "currency": "EUR",
            "currencyName": "euro",
            "mid": 4.33
        },
        {
            "id": 4,
            "date": "2025-01-05",
            "currency": "EUR",
            "currencyName": "euro",
            "mid": 4.36
        },
        {
            "id": 5,
            "date": "2025-01-08",
            "currency": "EUR",
            "currencyName": "euro",
            "mid": 4.34
        },
        {
            "id": 6,
            "date": "2025-01-09",
            "currency": "EUR",
            "currencyName": "euro",
            "mid": 4.37
        },
        {
            "id": 7,
            "date": "2025-01-10",
            "currency": "EUR",
            "currencyName": "euro",
            "mid": 4.35
        },
        {
            "id": 8,
            "date": "2025-01-11",
            "currency": "EUR",
            "currencyName": "euro",
            "mid": 4.38
        },
        {
            "id": 9,
            "date": "2025-01-12",
            "currency": "EUR",
            "currencyName": "euro",
            "mid": 4.36
        },
        {
            "id": 10,
            "date": "2025-01-15",
            "currency": "EUR",
            "currencyName": "euro",
            "mid": 4.35
        }
    ];

    // Przykładowe dane dla USD
    const mockUSDHistoryData = [
        {
            "id": 11,
            "date": "2025-01-02",
            "currency": "USD",
            "currencyName": "dolar amerykański",
            "mid": 3.75
        },
        {
            "id": 12,
            "date": "2025-01-03",
            "currency": "USD",
            "currencyName": "dolar amerykański",
            "mid": 3.77
        },
        {
            "id": 13,
            "date": "2025-01-04",
            "currency": "USD",
            "currencyName": "dolar amerykański",
            "mid": 3.76
        },
        {
            "id": 14,
            "date": "2025-01-05",
            "currency": "USD",
            "currencyName": "dolar amerykański",
            "mid": 3.78
        },
        {
            "id": 15,
            "date": "2025-01-08",
            "currency": "USD",
            "currencyName": "dolar amerykański",
            "mid": 3.77
        },
        {
            "id": 16,
            "date": "2025-01-09",
            "currency": "USD",
            "currencyName": "dolar amerykański",
            "mid": 3.79
        },
        {
            "id": 17,
            "date": "2025-01-10",
            "currency": "USD",
            "currencyName": "dolar amerykański",
            "mid": 3.77
        },
        {
            "id": 18,
            "date": "2025-01-11",
            "currency": "USD",
            "currencyName": "dolar amerykański",
            "mid": 3.80
        },
        {
            "id": 19,
            "date": "2025-01-12",
            "currency": "USD",
            "currencyName": "dolar amerykański",
            "mid": 3.78
        },
        {
            "id": 20,
            "date": "2025-01-15",
            "currency": "USD",
            "currencyName": "dolar amerykański",
            "mid": 3.77
        }
    ];

    const currencies = [
        { code: 'EUR', name: 'Euro' },
        { code: 'USD', name: 'Dolar amerykański' },
        { code: 'CZK', name: 'Korona czeska' },
        { code: 'IDR', name: 'Rupia indonezyjska' },
        { code: 'BRL', name: 'Real brazylijski' }
    ];

    useEffect(() => {
        // Symulacja ładowania danych
        setTimeout(() => {
            const data = selectedCurrency === 'USD' ? mockUSDHistoryData : mockHistoryData;
            setHistoryData(data);
            setLoading(false);
        }, 500);
    }, [selectedCurrency]);

    const handleShowHistory = () => {
        setLoading(true);
        // Symulacja zapytania do API
        setTimeout(() => {
            const data = selectedCurrency === 'USD' ? mockUSDHistoryData : mockHistoryData;
            setHistoryData(data);
            setLoading(false);
        }, 500);
    };

    const formatCurrency = (value) => {
        if (value === null) return "-";
        return value.toFixed(4) + " PLN";
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL');
    };

    const formatChange = (currentRate, previousRate) => {
        if (!previousRate) return <span className="text-muted">-</span>;
        const change = currentRate - previousRate;
        const sign = change >= 0 ? '+' : '';
        const color = change >= 0 ? 'text-success' : 'text-danger';
        return <span className={color}>{sign}{change.toFixed(4)} PLN</span>;
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
                        <i className="fas fa-history mr-2"></i>
                        Historia kursów walut
                    </h2>
                    
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Filtry</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="currencySelect" className="form-label">Wybierz walutę:</label>
                                    <select 
                                        className="form-control" 
                                        id="currencySelect"
                                        value={selectedCurrency}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
                                    >
                                        {currencies.map(currency => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.code} - {currency.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="dateInput" className="form-label">Wybierz datę:</label>
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
                                        <i className="fas fa-search mr-2"></i>
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
                                        Historia kursów {selectedCurrency} - ostatnie 14 dni przed {formatDate(selectedDate)}
                                    </h5>
                                </div>
                                <div className="col-auto">
                                    <small className="text-muted">
                                        Dane przykładowe
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col" className="text-center">Data</th>
                                            <th scope="col" className="text-center">Kurs NBP</th>
                                            <th scope="col" className="text-center">Kurs kupna</th>
                                            <th scope="col" className="text-center">Kurs sprzedaży</th>
                                            <th scope="col" className="text-center">Zmiana</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.map((rate, index) => {
                                            const exchangeRates = calculateExchangeRates(rate.mid, rate.currency);
                                            const previousRate = index > 0 ? historyData[index - 1].mid : null;
                                            return (
                                                <tr key={rate.id} className={index % 2 === 0 ? 'table-striped' : ''}>
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

export default RateHistory; 