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
        $response = $this->client->request('GET', "https://api.airtable.com/v0/{$this->config['base_id']}/{$this->config['table_name']}", [
            'headers' => [
                'Authorization' => "Bearer {$this->config['api_key']}"
            ]
        ]);

        $data = json_decode($response->getBody(), true);
        $records = $data['records'] ?? [];
        
        return array_map([$this, 'mapToEntity'], $records);
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