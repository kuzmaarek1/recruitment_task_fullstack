<?php

/**
 * Simple script to fetch exchange rates from NBP API
 * Run this script via cron job
 */

require_once __DIR__ . '/../../../vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

$airtableConfig = [
    'base_id' => 'appAiGuC5XR2IQii3',
    'api_key' => 'patxVMVkclfHia53a.4ea78ef893e55507287f04bc49e3fdf8c8cd40eff15637bd8ab4aed1482a6302',
    'table_name' => 'exchange_rates'
];

$supportedCurrencies = ['EUR', 'USD', 'CZK', 'IDR', 'BRL'];

$client = new Client([
    'timeout' => 30,
    'headers' => [
        'Accept' => 'application/json',
        'User-Agent' => 'ExchangeRateFetcher/1.0'
    ]
]);


function fetchExchangeRates($client) {
    $url = 'https://api.nbp.pl/api/exchangerates/tables/A/?format=json';
    
    try {
        $response = $client->request('GET', $url);
        $data = json_decode($response->getBody()->getContents(), true);
        
        if (!isset($data[0]['rates'])) {
            throw new Exception('Invalid response from NBP API');
        }
        
        return $data[0];
        
    } catch (GuzzleException $e) {
        throw new Exception('HTTP error while fetching exchange rates: ' . $e->getMessage());
    }
}


function storeRateToAirtable($client, $config, $rate) {
    $data = [
        'fields' => [
            'date' => $rate['date'],
            'currency_code' => $rate['currency_code'],
            'mid' => $rate['mid']
        ]
    ];
    
    try {
        $client->request('POST', "https://api.airtable.com/v0/{$config['base_id']}/{$config['table_name']}", [
            'headers' => [
                'Authorization' => "Bearer {$config['api_key']}",
                'Content-Type' => 'application/json'
            ],
            'json' => $data
        ]);
        return true;
    } catch (GuzzleException $e) {
        error_log("Failed to store rate to Airtable: " . $e->getMessage());
        return false;
    }
}

try {
    echo "Starting exchange rate fetch at " . date('Y-m-d H:i:s') . "\n";
    
    $nbpData = fetchExchangeRates($client);
    $effectiveDate = $nbpData['effectiveDate'];
    $rates = $nbpData['rates'];
    
    echo "Fetched rates for date: $effectiveDate\n";
    
    $storedCount = 0;
    $totalRates = count($rates);
    
    foreach ($rates as $rateData) {
        $currencyCode = $rateData['code'];
        
        if (!in_array($currencyCode, $supportedCurrencies)) {
            continue;
        }
        
        $rate = [
            'date' => $effectiveDate,
            'currency_code' => $currencyCode,
            'mid' => (float) $rateData['mid']
        ];
        
        if (storeRateToAirtable($client, $airtableConfig, $rate)) {
            $storedCount++;
            echo "Stored rate for $currencyCode: {$rate['mid']}\n";
        }
    }
    
    echo "Successfully stored $storedCount out of $totalRates rates\n";
    echo "Exchange rate fetch completed at " . date('Y-m-d H:i:s') . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
} 