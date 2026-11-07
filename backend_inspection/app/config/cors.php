<?php
/**
 * Broadbeach Academy — Centralized CORS & Preflight Handler
 * 
 * Provides robust CORS support for:
 * - Production Vercel domain (https://broadbeach-academy-lms-d5gx.vercel.app)
 * - Vercel preview/branch deployments (*.vercel.app)
 * - Local development origins (localhost:3000, 5173, 5174)
 * - Production domain (cadac.in, broadbeachlearning.com)
 */

function handleCors(): void
{
    $origin = $_SERVER["HTTP_ORIGIN"] ?? "";

    // Base allowed origins
    $staticAllowed = [
        "https://broadbeach-academy-lms-d5gx.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://cadac.in",
        "https://www.cadac.in",
        "https://broadbeachlearning.com",
        "https://www.broadbeachlearning.com",
    ];

    // Optional environment-configured origins (comma-separated)
    $envOrigins = getenv("ALLOWED_ORIGINS");
    if ($envOrigins) {
        $extra = array_map('trim', explode(',', $envOrigins));
        $staticAllowed = array_merge($staticAllowed, $extra);
    }

    $isAllowed = false;
    if ($origin !== "") {
        if (in_array($origin, $staticAllowed, true)) {
            $isAllowed = true;
        } elseif (preg_match('#^https://[a-zA-Z0-9_\-]+\.vercel\.app$#', $origin)) {
            // Allow Vercel preview and deployment URLs
            $isAllowed = true;
        }
    }

    if ($isAllowed) {
        header("Access-Control-Allow-Origin: " . $origin);
        header("Access-Control-Allow-Credentials: true");
    }

    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, X-Admin-PIN, X-Admin-Token, X-User-Token");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
    header("Access-Control-Max-Age: 86400");
    header("Vary: Origin");

    // Handle OPTIONS preflight request immediately
    if (($_SERVER["REQUEST_METHOD"] ?? "") === "OPTIONS") {
        http_response_code(204);
        exit;
    }
}

// Execute immediately when included
handleCors();
