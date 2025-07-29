<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\ExchangeRate;
use App\Controller\SupportedCurrency;
use App\Service\ExchangeRateService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class ExchangeRateController extends AbstractController
{
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