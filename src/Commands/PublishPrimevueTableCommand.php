<?php

namespace Karlos3098\LaravelPrimevueTableService\Commands;

use Illuminate\Console\Command;

class PublishPrimevueTableCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'primevue-table:publish {--force : Force the operation to run when in production}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publish PrimevueTable assets with force option to overwrite existing files';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Publishing PrimevueTable assets...');

        // Force publish the assets
        $this->call('vendor:publish', [
            '--tag' => 'laravel-primevue-table',
            '--force' => true,
        ]);

        // Also publish with the 'public' tag for backward compatibility
        $this->call('vendor:publish', [
            '--tag' => 'public',
            '--force' => true,
        ]);

        $this->info('PrimevueTable assets published successfully!');

        return Command::SUCCESS;
    }
}
