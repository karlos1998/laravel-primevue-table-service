<?php

namespace Karlos3098\LaravelPrimevueTableService\Services;

use Carbon\Carbon;
use Carbon\Exceptions\InvalidFormatException;
use Karlos3098\LaravelPrimevueTableService\Enum\TableColumnDataType;
use Karlos3098\LaravelPrimevueTableService\Services\Columns\TableBaseColumn;

class TableService
{
    public string $sortOrder = 'ASC';

    public string $sortField = 'id';

    public \stdClass $activeFilters;

    public string $globalFilter;

    public function __construct(
        public readonly array $columns = [],
        public readonly array $globalFilterColumns = [],
        public readonly array $rowsPerPage = [30, 50, 100],
        public readonly string $propName = 'default',
    ) {
    }

    public function hasColumnExist(string $columnName): bool
    {
        return array_key_exists($columnName, $this->columns);
    }

    public function getColumn(string $columnName): TableBaseColumn
    {
        return $this->columns[$columnName];
    }

    /**
     * @param  array  $filters
     * @return void
     *              Zapisuje w tabeli filtry które są w query od uzytkownika - chodzi o to, by zwrocic mu je do serwisu na froncie i zawartosci filtrow.
     */
    public function setActiveFilters(\stdClass $filtersInput): void
    {

        $filters = clone $filtersInput;

        foreach ($filters as $columnName => $filter) {
            if (! $this->hasColumnExist($columnName)) {
                continue;
            }

            $column = $this->getColumn($columnName);

            if ($column->columnDataType === TableColumnDataType::DATE) {
                if (property_exists($filter, 'constraints')) {
                    $filter->constraints = array_map(function ($obj) use ($column) {
                        try {
                            if ($obj->value !== null) {
                                $time = Carbon::parse($obj->value);
                                $time->setTimezone(config('app.timezone')); // inaczej jest godzina do tylu i wychodzi przez to jakby dzien wczesniejszy :) (23:00)
                                $obj->value = $time->format($column->getPhpDateFormat());
                            }
                        } catch (InvalidFormatException $e) {
                            $obj->value = null;
                        }

                        return $obj;
                    }, $filter->constraints);
                } else {
                    //todo - w przypadku pojedynczego fitra, bez opcji wyboru kilku regul filtra
                }
            }
        }
        $this->activeFilters = $filters;
    }

    public function getRowsPerPage(): int
    {
        $fromQuery = (int) request($this->getRowsPerPageParameterName());

        return in_array($fromQuery, $this->rowsPerPage) ? $fromQuery : $this->rowsPerPage[0];
    }

    public function getRowsPerPageParameterName(): string
    {
        return 'tables.'.$this->getPropName().'.perPage';
    }

    public function getPageParameterName(): string
    {
        return 'tables.'.$this->getPropName().'.page';
    }

    public function getPropName(): string
    {
        return $this->propName;
    }

    public function setSortData(string $field, string $order): void
    {
        $this->sortField = $field;
        $this->sortOrder = $order;
    }

    public function setGlobalFilter(string $value): void
    {
        $this->globalFilter = $value;
    }
}
