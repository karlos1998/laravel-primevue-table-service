<?php

namespace Karlos3098\LaravelPrimevueTableService\Enum;

enum MatchMode: string
{
    case StartsWith = 'startsWith';
    case Contains = 'contains';
    case NotContains = 'notContains';
    case EndsWith = 'endsWith';
    case Equals = 'equals';
    case NotEquals = 'notEquals';
    case In = 'in';
    case Lt = 'lt';
    case Lte = 'lte';
    case Gt = 'gt';
    case Gte = 'gte';
    case Between = 'between';
    case DateIs = 'dateIs';
    case DateIsNot = 'dateIsNot';
    case DateBefore = 'dateBefore';
    case DateAfter = 'dateAfter';

    //todo - jeszcze tam niby byl string i undefinded
}
