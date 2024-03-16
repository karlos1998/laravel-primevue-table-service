<?php

namespace Karlos3098\LaravelPrimevueTableService\Services\Columns;

use Karlos3098\LaravelPrimevueTableService\Enum\TableCalendarDateFormat;
use Karlos3098\LaravelPrimevueTableService\Enum\TableColumnDataType;
use Karlos3098\LaravelPrimevueTableService\Enum\TableComponentType;

class TableCalendarColumn extends TableBaseColumn
{
    public string $dateFormat;

    public string $mask;

    public function __construct(
        public readonly TableCalendarDateFormat $format = TableCalendarDateFormat::YMD,
        public readonly string $placeholder = '',
        public bool $sortable = false,
        protected array $queryPaths = [],
        protected readonly ?string $sortPath = null,
    ) {
        $this->columnDataType = TableColumnDataType::DATE;
        $this->tableComponentType = TableComponentType::CALENDAR;

        $this->dateFormat = $this->format->getJSDateFormat();
        $this->mask = $this->format->getMask();
    }

    public function getPhpDateFormat(): string
    {
        return $this->format->getPHPDateFormat();
    }
}
