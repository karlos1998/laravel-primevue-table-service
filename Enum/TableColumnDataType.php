<?php

namespace Karlos3098\LaravelPrimevueTableService\Enum;

enum TableColumnDataType: string
{
    case DEFAULT = 'text'; //todo - czy na pewno text?
    case NUMERIC = 'numeric';
    case BOOLEAN = 'boolean';
    case DATE = 'date';
}
