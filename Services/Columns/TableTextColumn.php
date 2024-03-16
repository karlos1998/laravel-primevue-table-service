<?php

namespace Karlos3098\LaravelPrimevueTableService\Services\Columns;

use Karlos3098\LaravelPrimevueTableService\Enum\TableColumnDataType;
use Karlos3098\LaravelPrimevueTableService\Enum\TableComponentType;

class TableTextColumn extends TableBaseColumn
{
    public function __construct(
        public string $placeholder = '',
        public bool $sortable = false,
        protected array $queryPaths = [],
        protected readonly ?string $sortPath = null,
    ) {
        $this->columnDataType = TableColumnDataType::DEFAULT;
        $this->tableComponentType = TableComponentType::INPUT_TEXT;
    }
}
