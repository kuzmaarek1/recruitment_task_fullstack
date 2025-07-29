<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Enum\SupportedCurrency;

#[ORM\Entity]
#[ORM\Table(name: 'exchange_rate')]
class ExchangeRate
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    public ?int $id = null;

    #[ORM\Column(type: 'date')]
    public \DateTimeInterface $date;

    #[ORM\Column(type: 'string', length: 3, enumType: SupportedCurrency::class)]
    public SupportedCurrency $currencyCode;

    #[ORM\Column(type: 'float')]
    public float $mid;
} 