<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\ExchangeRate;
use App\Enum\SupportedCurrency;
use App\Service\ExchangeRateService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ExchangeRateController extends AbstractController
{
    public function getCurrentRates(ExchangeRateService $service): Response
    {
        $rates = $service->getCurrentRates();
        
        $data = array_map(function($rate) {
            return [
                'id' => $rate->id,
                'date' => $rate->date->format('Y-m-d'),
                'currency' => $rate->currencyCode->value,
                'currencyName' => $rate->currencyCode->label(),
                'mid' => $rate->mid
            ];
        }, $rates);
        
        return new Response(
            json_encode($data),
            Response::HTTP_OK,
            ['Content-type' => 'application/json']
        );
    }


    public function getRateHistory(Request $request, ExchangeRateService $service): Response
    {
        $currency = $request->query->get('currency', 'EUR');
        $date = $request->query->get('date', date('Y-m-d'));
        
        if (!in_array($currency, ['EUR', 'USD', 'CZK', 'IDR', 'BRL'])) {
            return new Response(
                json_encode(['error' => 'Nieprawidłowa waluta']),
                Response::HTTP_BAD_REQUEST,
                ['Content-type' => 'application/json']
            );
        }
        
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return new Response(
                json_encode(['error' => 'Nieprawidłowy format daty']),
                Response::HTTP_BAD_REQUEST,
                ['Content-type' => 'application/json']
            );
        }
        
        $rates = $service->getRateHistory($currency, $date);
        
        $data = array_map(function($rate) {
            return [
                'id' => $rate->id,
                'date' => $rate->date->format('Y-m-d'),
                'currency' => $rate->currencyCode->value,
                'currencyName' => $rate->currencyCode->label(),
                'mid' => $rate->mid
            ];
        }, $rates);
        
        return new Response(
            json_encode($data),
            Response::HTTP_OK,
            ['Content-type' => 'application/json']
        );
    }

    public function index(ExchangeRateService $service): Response
    {
        $rates = $service->getAll();
        
        $data = array_map(function($rate) {
            return [
                'id' => $rate->id,
                'date' => $rate->date->format('Y-m-d'),
                'currency' => $rate->currencyCode->value,
                'currencyName' => $rate->currencyCode->label(),
                'mid' => $rate->mid
            ];
        }, $rates);
        
        return new Response(
            json_encode($data),
            Response::HTTP_OK,
            ['Content-type' => 'application/json']
        );
    }
} 