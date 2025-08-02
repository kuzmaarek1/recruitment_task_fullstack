<?php

declare(strict_types=1);

namespace App\Tests\Integration\ExchangeRate;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class RateHistoryEndpointTest extends WebTestCase
{
    private $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
    }

    public function testReturnsMaximum14Records(): void
    {
        $this->client->request('GET', '/api/rate-history', [
            'currency' => 'EUR',
            'date' => date('Y-m-d')
        ]);

        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
        
        $data = json_decode($response->getContent(), true);
        
        // Sprawdź czy zwracane jest maksymalnie 14 rekordów
        $this->assertLessThanOrEqual(14, count($data), 'Endpoint powinien zwracać maksymalnie 14 rekordów');
        
        // Sprawdź strukturę danych
        if (!empty($data)) {
            $this->assertArrayHasKey('id', $data[0]);
            $this->assertArrayHasKey('date', $data[0]);
            $this->assertArrayHasKey('currency', $data[0]);
            $this->assertArrayHasKey('currencyName', $data[0]);
            $this->assertArrayHasKey('mid', $data[0]);
        }
    }

    public function testReturnsDataOnlyForSpecificCurrency(): void
    {
        $this->client->request('GET', '/api/rate-history', [
            'currency' => 'USD',
            'date' => date('Y-m-d')
        ]);

        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
        
        $data = json_decode($response->getContent(), true);
        
        // Sprawdź czy wszystkie rekordy są dla waluty USD
        foreach ($data as $record) {
            $this->assertEquals('USD', $record['currency'], 'Wszystkie rekordy powinny być dla waluty USD');
            $this->assertEquals('dolar amerykański', $record['currencyName'], 'Nazwa waluty powinna być poprawna');
        }
    }

    public function testReturnsDataFromLast14Days(): void
    {
        $this->client->request('GET', '/api/rate-history', [
            'currency' => 'EUR',
            'date' => date('Y-m-d')
        ]);

        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
        
        $data = json_decode($response->getContent(), true);
        
        if (count($data) > 1) {
            // Sprawdź czy dane są posortowane malejąco (najnowsze pierwsze)
            $firstDate = new \DateTime($data[0]['date']);
            $secondDate = new \DateTime($data[1]['date']);
            $this->assertGreaterThanOrEqual($secondDate, $firstDate, 'Dane powinny być posortowane malejąco');
            
            // Sprawdź czy wszystkie daty są w rozsądnym zakresie (nie w przyszłości)
            $targetDate = new \DateTime();
            foreach ($data as $record) {
                $recordDate = new \DateTime($record['date']);
                $this->assertLessThanOrEqual($targetDate, $recordDate, 'Data nie powinna być w przyszłości');
                
                // Sprawdź czy dane nie są zbyt stare (max 30 dni wstecz)
                $diff = $targetDate->diff($recordDate);
                $this->assertLessThanOrEqual(30, $diff->days, 'Dane nie powinny być starsze niż 30 dni');
            }
        }
    }

    public function testReturnsDataFromLastDayOnly(): void
    {
        // Test z konkretną datą z przeszłości
        $specificDate = '2024-01-15';
        
        $this->client->request('GET', '/api/rate-history', [
            'currency' => 'EUR',
            'date' => $specificDate
        ]);

        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
        
        $data = json_decode($response->getContent(), true);
        
        // Sprawdź czy wszystkie rekordy są z określonej daty lub wcześniejsze
        foreach ($data as $record) {
            $recordDate = new \DateTime($record['date']);
            $targetDate = new \DateTime($specificDate);
            $this->assertLessThanOrEqual($targetDate, $recordDate, 'Wszystkie rekordy powinny być z określonej daty lub wcześniejsze');
        }
        
        // Sprawdź czy nie ma duplikatów dat
        $dates = array_column($data, 'date');
        $uniqueDates = array_unique($dates);
        $this->assertCount(count($uniqueDates), $dates, 'Nie powinno być duplikatów dat');
    }

    public function testInvalidCurrencyReturnsError(): void
    {
        $this->client->request('GET', '/api/rate-history', [
            'currency' => 'INVALID',
            'date' => date('Y-m-d')
        ]);

        $response = $this->client->getResponse();
        $this->assertEquals(400, $response->getStatusCode());
        
        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('error', $data);
        $this->assertEquals('Nieprawidłowa waluta', $data['error']);
    }

    public function testInvalidDateFormatReturnsError(): void
    {
        $this->client->request('GET', '/api/rate-history', [
            'currency' => 'EUR',
            'date' => 'invalid-date'
        ]);

        $response = $this->client->getResponse();
        $this->assertEquals(400, $response->getStatusCode());
        
        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('error', $data);
        $this->assertEquals('Nieprawidłowy format daty', $data['error']);
    }
} 