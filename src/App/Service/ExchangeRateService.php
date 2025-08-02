<?php

namespace App\Service;

use App\Entity\ExchangeRate;
use App\Enum\SupportedCurrency;
use GuzzleHttp\Client;

class ExchangeRateService
{
    private Client $client;
    private array $config;

    public function __construct()
    {
        $this->client = new Client();
        $this->config = [
            'base_id' => 'appAiGuC5XR2IQii3',
            'api_key' => 'patxVMVkclfHia53a.4ea78ef893e55507287f04bc49e3fdf8c8cd40eff15637bd8ab4aed1482a6302',           
            'token_id' => 'patxVMVkclfHia53a',
            'table_name' => 'exchange_rates'
        ];
    }

    public function getAll(): array
    {
        $allRecords = [];
        $offset = null;
        
        do {
            $params = [];
            if ($offset) {
                $params['offset'] = $offset;
            }
            
            $url = "https://api.airtable.com/v0/{$this->config['base_id']}/{$this->config['table_name']}";
            if (!empty($params)) {
                $url .= '?' . http_build_query($params);
            }
            
            $response = $this->client->request('GET', $url, [
                'headers' => [
                    'Authorization' => "Bearer {$this->config['api_key']}"
                ]
            ]);

            $data = json_decode($response->getBody(), true);
            $records = $data['records'] ?? [];
            
            $allRecords = array_merge($allRecords, $records);
            
            // Sprawdź czy jest offset dla następnej strony
            $offset = $data['offset'] ?? null;
            
        } while ($offset !== null);
        
        return array_map([$this, 'mapToEntity'], $allRecords);
    }

    public function getCurrentRates(): array
    {
        $allRates = $this->getAll();
        
        $currentRates = [];
        foreach ($allRates as $rate) {
            $currency = $rate->currencyCode->value;
            
            if (!isset($currentRates[$currency]) || 
                $rate->date > $currentRates[$currency]->date) {
                $currentRates[$currency] = $rate;
            }
        }
        
        return array_values($currentRates);
    }


    public function getRateHistory(string $currency, string $date): array
    {
        $allRates = $this->getAll();
        $targetDate = new \DateTime($date);
        $currencyRates = array_filter($allRates, function($rate) use ($currency) {
            return $rate->currencyCode->value === $currency;
        });
        
        // Sortuj po dacie malejąco
        usort($currencyRates, function($a, $b) {
            return $b->date <=> $a->date;
        });
        
        // Znajdź kursy z ostatnich 14 dni przed podaną datą
        $historyRates = [];
        foreach ($currencyRates as $rate) {
            if ($rate->date <= $targetDate) {
                $historyRates[] = $rate;
                
                // Ogranicz do 14 dni
                if (count($historyRates) >= 14) {
                    break;
                }
            }
        }
        
        // Sortuj po dacie rosnąco dla lepszej prezentacji
        usort($historyRates, function($a, $b) {
            return $a->date <=> $b->date;
        });
        
        return $historyRates;
    }

    private function mapToEntity(array $record): ExchangeRate
    {
        $fields = $record['fields'] ?? [];
        
        $entity = new ExchangeRate();
        $entity->id = (int) ($record['id']);
        $entity->date = new \DateTime($fields['date']);
        $entity->currencyCode = SupportedCurrency::from($fields['currency_code']);
        $entity->mid = (float) ($fields['mid']);
        
        return $entity;
    }
} 