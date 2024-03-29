<?php

namespace Karlos3098\LaravelPrimevueTableService\Services\Columns\TableDropdownOptions;

use Karlos3098\LaravelPrimevueTableService\Enum\TableDropdownOptionType;
use Karlos3098\LaravelPrimevueTableService\Enum\TagSeverity;

final class TableDropdownOptionTag extends TableDropdownOption
{
    public $type = TableDropdownOptionType::TAG;

    public function __construct(
        public string $label,
        private $query,
        public ?TagSeverity $severity = null,
    )
    {
        parent::__construct($label, $query);
    }

    public function getQuery()
    {
        return $this->query;
    }
}
