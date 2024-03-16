<?php

namespace Karlos3098\LaravelPrimevueTableService\Enum;

//TODO: No refaktoryzacja tego jest nie unikniona :)

enum TableCalendarDateFormat: string
{
    case YMD = 'YMD';

    public function getPHPDateFormat(): string
    {
        return match ($this) {
            self::YMD => 'Y/m/d',
        };
    }

    public function getJSDateFormat(): string
    {
        return match ($this) {
            self::YMD => 'yy/mm/dd',
        };
    }

    public function getMask(): string
    {
        return match ($this) {
            self::YMD => '9999/99/99',
        };
    }
}
