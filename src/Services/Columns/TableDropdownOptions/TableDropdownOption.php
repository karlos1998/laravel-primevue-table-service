<?php

namespace Karlos3098\LaravelPrimevueTableService\Services\Columns\TableDropdownOptions;

use Karlos3098\LaravelPrimevueTableService\Enum\TableDropdownOptionType;

class TableDropdownOption
{
    public $type = TableDropdownOptionType::DEFAULT;

    public function __construct(
        public string $label,
        private $query
    ) {
    }

    public function getQuery()
    {
        return $this->query;
    }
}
