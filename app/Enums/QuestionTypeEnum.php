<?php
namespace App\Enums;

class QuestionTypeEnum
{
    const TEXT = 'text';
    const TEXTAREA = 'textarea';
    const SELECT = 'select';
    const RADIO = 'radio';
    const CHECKBOX = 'checkbox';

    public static function getValues()
    {
        return [
            self::TEXT,
            self::TEXTAREA,
            self::SELECT,
            self::RADIO,
            self::CHECKBOX,
        ];
    }
}
