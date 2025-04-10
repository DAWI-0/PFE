<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Suppression de EnsureFrontendRequestsAreStateful du groupe 'api'
        $middleware->api(prepend: [
            // Rien ici, ou ajoute d'autres middlewares si besoin
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);

        // Optionnel : Si tu veux désactiver CSRF explicitement pour les routes API
        $middleware->validateCsrfTokens(except: [
            'api/*', // Désactive la vérification CSRF pour toutes les routes API
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
