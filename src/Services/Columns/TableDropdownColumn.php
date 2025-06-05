<?php

namespace Karlos3098\LaravelPrimevueTableService\Services\Columns;

use Karlos3098\LaravelPrimevueTableService\Enum\TableColumnDataType;
use Karlos3098\LaravelPrimevueTableService\Enum\TableComponentType;

class TableDropdownColumn extends TableBaseColumn
{
    public function __construct(
        public string $placeholder = '',
        public array $options = [],
        public bool $sortable = false,
        protected array $queryPaths = [],
        protected readonly ?string $sortPath = null,
        protected ?TableColumnDataType $sortDataType = null,
    ) {
        $this->columnDataType = TableColumnDataType::DEFAULT;
        $this->tableComponentType = TableComponentType::DROPDOWN;
    }

    public function findOption($value)
    {
        $collect = collect($this->options);

        return $collect->firstWhere('label', $value->label);
    }
}
