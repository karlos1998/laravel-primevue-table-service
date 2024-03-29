<?php

namespace Karlos3098\LaravelPrimevueTableService\Enum;

enum TagSeverity: string
{
    case SECONDARY = 'secondary';
    case SUCCESS = 'success';
    case INFO = 'info';
    case WARNING = 'warning';
    case DANGER = 'danger';
    case CONTRAST = 'contrast';

}
