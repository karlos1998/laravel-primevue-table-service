<?php

namespace Karlos3098\LaravelPrimevueTableService\Services\Columns;

use Karlos3098\LaravelPrimevueTableService\Enum\TableColumnDataType;
use Karlos3098\LaravelPrimevueTableService\Enum\TableComponentType;

class TableSliderColumn extends TableBaseColumn
{
    public function __construct(
        public readonly string $placeholder = '',
        public readonly int $min = 0,
        public readonly int $max = 100,
        public readonly int $step = 1,
        public bool $sortable = false,
        protected array $queryPaths = [],
        protected readonly ?string $sortPath = null,
        protected ?TableColumnDataType $sortDataType = null,
    ) {
        $this->columnDataType = TableColumnDataType::NUMERIC;
        $this->tableComponentType = TableComponentType::SLIDER;
    }
}
