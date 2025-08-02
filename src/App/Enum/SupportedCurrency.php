<?php

declare(strict_types=1);

namespace App\Enum;

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