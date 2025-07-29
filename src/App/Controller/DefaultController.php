<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

// Dodany enum z obsługiwanymi walutami
enum SupportedCurrency: string
{
    case EUR = 'EUR';
    case USD = 'USD';
    case CZK = 'CZK';
    case IDR = 'IDR';
    case BRL = 'BRL';

    public function label(): string
    {
        return match($this) {
            self::EUR => 'euro',
            self::USD => 'dolar amerykański',
            self::CZK => 'korona czeska',
            self::IDR => 'rupia indonezyjska',
            self::BRL => 'real (Brazylia)',
        };
    }
}


class DefaultController extends AbstractController
{

    public function index(): Response
    {
        return $this->render(
            'app-root.html.twig'
        );
    }

    public function setupCheck(Request $request): Response
    {
        $responseContent = json_encode([
            'testParam' => $request->get('testParam')
                ? (int) $request->get('testParam')
                : null
        ]);
        return new Response(
            $responseContent,
            Response::HTTP_OK,
            ['Content-type' => 'application/json']
        );
    }


}
