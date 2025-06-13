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
        // Register the command for force publishing assets
        if ($this->app->runningInConsole()) {
            $this->app->singleton('command.primevue-table.publish', function ($app) {
                return new \Karlos3098\LaravelPrimevueTableService\Commands\PublishPrimevueTableCommand;
            });

            $this->commands(['command.primevue-table.publish']);
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $assetsPath = __DIR__.'/../Assets';
        $destinationPath = resource_path('js/karlos3098-LaravelPrimevueTable');

        // Standard publishing (won't overwrite existing files by default)
        // To force overwrite, use: php artisan vendor:publish --tag=laravel-primevue-table --force
        $this->publishes([
            $assetsPath => $destinationPath,
        ], 'laravel-primevue-table');

        // For backward compatibility
        // To force overwrite, use: php artisan vendor:publish --tag=public --force
        $this->publishes([
            $assetsPath => $destinationPath,
        ], 'public');

        // Or use the dedicated command that always forces overwrite:
        // php artisan primevue-table:publish
    }
}
