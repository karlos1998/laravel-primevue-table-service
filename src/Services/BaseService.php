<?php

namespace Karlos3098\LaravelPrimevueTableService\Services;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;
use Karlos3098\LaravelPrimevueTableService\Enum\FilterOperator;
use Karlos3098\LaravelPrimevueTableService\Enum\MatchMode;
use Karlos3098\LaravelPrimevueTableService\Enum\TableColumnDataType;
use Karlos3098\LaravelPrimevueTableService\Services\Columns\TableBaseColumn;
use Karlos3098\LaravelPrimevueTableService\Services\Columns\TableCalendarColumn;
use \Exception;
abstract class BaseService
{
    /**
     * @var Builder
     */
    private Builder $builder;

    /**
     * @var TableService
     */
    private TableService $table;

    /**
     * @param string $resourceFileName
     * @param Builder|Model|HasMany|MorphToMany $builder
     * @param TableService $table
     * @return AnonymousResourceCollection
     * @throws Exception
     */
    protected function fetchData(
        string                $resourceFileName,
        Builder|Model|HasMany|MorphToMany $builder,
        TableService          $table = new TableService(),
    ): AnonymousResourceCollection
    {
        $this->table = $table;

        /**
         * @var JsonResource $resource
         */
        $resource = $resourceFileName;

        /**
         * @var HasMany $builder
         */
        $this->builder = $builder instanceof Builder ? $builder : ($builder instanceof Model ? $builder->query() : $builder->getQuery());

        $this->filterable();

        $this->sortable();

        $collection = $this->builder
            ->orderBy('created_at', 'desc')
            ->paginate(perPage: $this->table->getRowsPerPage(), pageName: $this->table->getPageParameterName());

        /**
         * @var AnonymousResourceCollection $resource
         */
        $resource = $resource::collection($collection);
        $resource->additional(['tableData' => $this->table]);

        return $resource;
    }

    /**
     * @return void
     * @throws Exception
     */
    private function filterable(): void
    {
        $globalFilter = request('tables.'.$this->table->getPropName().'.globalFilter');
        if(strlen($globalFilter) > 0) {
            $this->runGlobalFilter($globalFilter);
            $this->table->setGlobalFilter($globalFilter);
            //todo - obsluga globalnego filtra
        }

        $filtersString = request('tables.'.$this->table->getPropName().'.filters');
        $filters = (object) json_decode($filtersString) ?? new \stdClass();

        $this->table->setActiveFilters($filters);

        foreach ($filters as $columnName => $filter) {
            if (property_exists($filter, 'constraints')) {
                $operator = FilterOperator::tryFrom($filter->operator);

                $this->builder->where(/**
                 * @throws Exception
                 */ function ($query) use ($operator, $filter, $columnName) {
                    foreach ($filter->constraints as $rule) {
                        if ($operator === FilterOperator::AND) {
                            $this->checkColumnFilter($query, $columnName, $rule);
                        } elseif ($operator === FilterOperator::OR) {
                            $query->orWhere(function ($query) use ($columnName, $rule) {
                                $this->checkColumnFilter($query, $columnName, $rule);
                            });
                        }
                    }
                });

            } else {
                //todo - w przypadku pojedynczego filtra (np global. tam nie ma listy regul tylko jest jedna)
            }
        }

        //        dd('----------------------------');
    }

    /**
     * @param Builder $query
     * @param string $columnName
     * @param \stdClass $rule
     * @return void
     * @throws Exception
     */
    private function checkColumnFilter(Builder $query, string $columnName, \stdClass $rule): void
    {
        if (! $this->table->hasColumnExist($columnName)) {
            return;
        }

        if (empty($rule->value)) {
            return;
        }

        $column = $this->table->getColumn($columnName);

        $queryPaths = $column->getQueryPaths();

        $value = $rule->value;

        $matchMode = MatchMode::tryFrom($rule->matchMode);

        if (count($queryPaths) > 0) {
            $query->where(function ($query) use ($column, $queryPaths, $value, $rule, $matchMode) {
                foreach ($queryPaths as $path) {
                    $query->orWhere(function ($query) use ($path, $column, $value, $rule, $matchMode) {

                        $pathData = explode('.', $path);

                        if (count($pathData) === 2) {
                            $relation = $pathData[0];
                            $relationColumn = $pathData[1];

                            $query->whereHas($relation, function ($query) use ($column, $value, $relationColumn, $rule, $matchMode) {
                                $this->runMatchModeFilter($query, $matchMode, $rule, $relationColumn, $value, $column);
                            });
                        } elseif (count($pathData) == 1) {
                            $this->runMatchModeFilter($query, $matchMode, $rule, $path, $value, $column);
                        } else if (count($pathData) > 2) {
                            $relationColumn = array_pop($pathData);
                            $query->where(function ($query) use ($column, $value, $relationColumn, $rule, $matchMode, $pathData) {
                                $this->applyNestedWhereHas($query, $pathData, $column, $value, $relationColumn, $rule, $matchMode);
                            });
                        } else {
                            throw new Exception('Invalid $queryPath format: '.$path);
                        }
                    });
                }
            });
        } else {
            $this->runMatchModeFilter($query, $matchMode, $rule, $columnName, $value, $column);
        }

    }

    /**
     * @param $query
     * @param $pathData
     * @param $column
     * @param $value
     * @param $relationColumn
     * @param $rule
     * @param $matchMode
     * @return void
     * @throws Exception
     * Wymysl gpt na rekurencje - baaardzo zagniezdzone szukanie po relacjach :D
     */
    private function applyNestedWhereHas($query, $pathData, $column, $value, $relationColumn, $rule, $matchMode) {
        $relation = array_shift($pathData); // Pobierz i usuń pierwszy element z $pathData.

        if (!empty($relation)) {
            // Aplikuj `whereHas` dla bieżącej relacji.
            $query->whereHas($relation, function ($query) use ($pathData, $column, $value, $relationColumn, $rule, $matchMode) {
                if (count($pathData) > 0) {
                    // Jeśli są jeszcze jakieś relacje, rekurencyjnie zastosuj `whereHas` dla nich.
                    $this->applyNestedWhereHas($query, $pathData, $column, $value, $relationColumn, $rule, $matchMode);
                } else {
                    // Jesteśmy na "końcu" ścieżki, zastosuj filtr.
                    $this->runMatchModeFilter($query, $matchMode, $rule, $relationColumn, $value, $column);
                }
            });
        }
    }

    /**
     * @param Builder $query
     * @param MatchMode $matchMode
     * @param \stdClass $rule
     * @param string $columnName
     * @param string $value
     * @param TableBaseColumn $column
     * @return void
     * @throws Exception
     */
    private function runMatchModeFilter(Builder $query, MatchMode $matchMode, \stdClass $rule, string $columnName, string $value, TableBaseColumn $column): void
    {
        switch ($column->columnDataType) {

            default:
                throw new Exception('Undefined column data type: '.$column->columnDataType->value);
            case TableColumnDataType::DEFAULT:
                $this->runMatchModeForText($query, $matchMode, $rule, $columnName, $value);
                break;

            case TableColumnDataType::DATE:
                $this->runMatchModeForDate($query, $matchMode, $rule, $columnName, $value, $column);
                break;
        }
    }

    /**
     * @param Builder $query
     * @param MatchMode $matchMode
     * @param \stdClass $rule
     * @param string $columnName
     * @param string $value
     * @return void
     * @throws Exception
     */
    private function runMatchModeForText(Builder $query, MatchMode $matchMode, \stdClass $rule, string $columnName, string $value): void
    {
        switch ($matchMode) {
            default:
                throw new Exception('Unknown matchMode: '.$rule->matchMode);
            case MatchMode::StartsWith:
                $query->where($columnName, 'LIKE', "$value%");
                break;

            case MatchMode::Contains:
                $query->where($columnName, 'LIKE', "%$value%");
                break;

            case MatchMode::NotContains:
                $query->where($columnName, 'NOT LIKE', "%$value%");
                break;

            case MatchMode::EndsWith:
                $query->where($columnName, 'LIKE', "%$value");
                break;

            case MatchMode::Equals:
                $query->where($columnName, $value);
                break;

            case MatchMode::NotEquals:
                $query->where($columnName, '!=', $value);
                break;
        }
    }

    /**
     * @param Builder $query
     * @param MatchMode $matchMode
     * @param \stdClass $rule
     * @param string $columnName
     * @param string $value
     * @param TableCalendarColumn $column
     * @return void
     * @throws Exception
     */
    public function runMatchModeForDate(Builder $query, MatchMode $matchMode, \stdClass $rule, string $columnName, string $value, TableCalendarColumn $column): void
    {
        $value = Carbon::parse($value); //->format('Y/m/d');
        //        $value = Carbon::parse($value)->parse($column->dateFormat);

        $value->setTimezone(config('app.timezone')); // inaczej jest godzina do tylu i wychodzi przez to jakby dzien wczesniejszy :) (23:00)

        switch ($matchMode) {
            default:
                throw new Exception('Unknown matchMode: '.$rule->matchMode);
            case MatchMode::DateIs:
                $query->whereDate($columnName, $value);
                break;

            case MatchMode::DateIsNot:
                $query->whereDate($columnName, '!=', $value);
                break;

            case MatchMode::DateBefore:
                $query->whereDate($columnName, '<=', $value);
                break;

            case MatchMode::DateAfter:
                $query->whereDate($columnName, '>=', $value);
                break;

        }
    }

    /**
     * @return void
     */

    private function sortable(): void
    {
        $order = request('tables.'.$this->table->getPropName().'.sortOrder') == 'DESC' ? 'DESC' : 'ASC';

        $field = request('tables.'.$this->table->getPropName().'.sortField');

        if (! $field) {
            return;
        }

        if (! $this->table->hasColumnExist($field)) {
            return;
        }

        $column = $this->table->getColumn($field);

        if (! $column->isSortable()) {
            return;
        }

        $sortPath = $column->hasSpecificSortPath() ? $column->getSpecificSortPath() : $field;

        //TODO - zrobic obsluge sortpath, znaczy ze jak bedzie nazwa_relacji.created_at itp

        $this->builder->orderBy($sortPath, $order);

        $this->table->setSortData($field, $order);
    }

    private function runGlobalFilter(string $value)
    {
        $this->builder->where(function($query) use ($value) {
            foreach ($this->table->globalFilterColumns as $column) {
                $query->orWhere($column, 'LIKE', "%$value%");
            }
        });
    }
}
