# Cron Job Setup - Pobieranie kursów walut z API NBP

## Opis
Prosty skrypt PHP, który pobiera kursy walut z API NBP i zapisuje je do Airtable.

## Plik skryptu
`fetch_exchange_rates.php` - główny skrypt do uruchomienia

## Uruchomienie ręczne

### Linux/Mac
```bash
php fetch_exchange_rates.php
```

### Windows
```cmd
fetch_rates.bat
```
lub
```cmd
php fetch_exchange_rates.php
```

## Konfiguracja Cron

### Linux/Mac
Dodaj do crontab (`crontab -e`):
```bash
# Pobieraj kursy walut codziennie o 12:30 (po publikacji kursów przez NBP)
30 12 * * * cd /path/to/your/project && php fetch_exchange_rates.php >> /var/log/exchange-rates.log 2>&1
```

### Windows (Task Scheduler)
1. Otwórz Task Scheduler
2. Utwórz nowe zadanie
3. Ustaw trigger na codziennie o 12:30
4. Akcja: uruchom program `php` z argumentami `fetch_exchange_rates.php`
5. Ustaw working directory na ścieżkę do projektu

## Co robi skrypt

1. **Pobiera kursy z API NBP** - używa endpointu `https://api.nbp.pl/api/exchangerates/tables/A/?format=json`
2. **Filtruje obsługiwane waluty** - EUR, USD, CZK, IDR, BRL
3. **Zapisuje do Airtable** - każdy kurs jest zapisywany jako nowy rekord
4. **Loguje wyniki** - pokazuje ile kursów zostało pobranych

## Obsługiwane waluty
- EUR (euro)
- USD (dolar amerykański) 
- CZK (korona czeska)
- IDR (rupia indonezyjska)
- BRL (real brazylijski)

## Struktura danych w Airtable
Każdy kurs zawiera:
- `date` - data kursu (format Y-m-d)
- `currency_code` - kod waluty (3 znaki)
- `mid` - średni kurs waluty

## Logi
Skrypt wyświetla:
- Czas rozpoczęcia
- Datę kursów
- Każdy zapisany kurs
- Podsumowanie (ile kursów zapisano)
- Czas zakończenia
- Błędy jeśli wystąpią

## Przykład wyjścia
```
Starting exchange rate fetch at 2024-01-15 12:30:00
Fetched rates for date: 2024-01-15
Stored rate for EUR: 4.1234
Stored rate for USD: 3.9876
Stored rate for CZK: 0.1723
Stored rate for IDR: 0.0003
Stored rate for BRL: 0.8234
Successfully stored 5 out of 35 rates
Exchange rate fetch completed at 2024-01-15 12:30:05
```

## Uwagi
- Kursy NBP są publikowane codziennie około południa
- API NBP jest darmowe i nie wymaga klucza
- Skrypt obsługuje błędy i kontynuuje pracę nawet jeśli niektóre waluty się nie pobiorą
- Wszystkie błędy są logowane do error_log
- Skrypt używa istniejących zależności GuzzleHttp

## Testowanie
Przetestuj skrypt ręcznie przed dodaniem do cron:
```bash
php fetch_exchange_rates.php
``` 