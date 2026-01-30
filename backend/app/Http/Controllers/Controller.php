<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

abstract class Controller
{
    /**
     * Default pagination size
     */
    protected int $defaultPerPage = 15;

    /**
     * Maximum pagination size
     */
    protected int $maxPerPage = 100;

    /**
     * Get pagination size from request
     *
     * @param Request $request
     * @return int
     */
    protected function getPerPage(Request $request): int
    {
        $perPage = (int) $request->get('per_page', $this->defaultPerPage);

        return min(max($perPage, 1), $this->maxPerPage);
    }
}
