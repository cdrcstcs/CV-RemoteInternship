<?php

namespace App\Enums;

enum GiftTypeEnum: string
{
    case Lion = 'lion';
    case Flower = 'flower';
    case Star = 'star';
    case Heart = 'heart';

    // Optionally, add a method to get the display name
    public function getDisplayName(): string
    {
        return ucfirst($this->value);
    }

    // Get the price associated with each gift
    public function getPrice(): float
    {
        switch ($this) {
            case self::Lion:
                return 100.00;
            case self::Flower:
                return 50.00;
            case self::Star:
                return 200.00;
            case self::Heart:
                return 150.00;
            default:
                return 0.00;
        }
    }
}
