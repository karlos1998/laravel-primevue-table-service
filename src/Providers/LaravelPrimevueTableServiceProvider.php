<?php

namespace Karlos3098\LaravelPrimevueTableService\Providers;

use Illuminate\Support\ServiceProvider;

class LaravelPrimevueTableServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->publishes([
            __DIR__.'/../Assets' => resource_path('js/karlos3098-LaravelPrimevueTable'),
        ], 'public');
    }
}
