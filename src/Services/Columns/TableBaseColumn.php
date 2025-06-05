<?php

namespace Karlos3098\LaravelPrimevueTableService\Services\Columns;

use Karlos3098\LaravelPrimevueTableService\Enum\TableColumnDataType;
use Karlos3098\LaravelPrimevueTableService\Enum\TableComponentType;

class TableBaseColumn
{
    public TableColumnDataType $columnDataType;

    public TableComponentType $tableComponentType;

    public bool $sortable = false;

    protected array $queryPaths = [];

    protected readonly ?string $sortPath;

    protected ?TableColumnDataType $sortDataType = null;

    public function getQueryPaths()
    {
        return $this->queryPaths;
    }

    public function isSortable(): bool
    {
        return $this->sortable;
    }

    public function hasSpecificSortPath()
    {
        return $this->sortPath !== null;
    }

    public function getSpecificSortPath()
    {
        return $this->sortPath;
    }

    public function getSortDataType(): ?TableColumnDataType
    {
        return $this->sortDataType;
    }
}
