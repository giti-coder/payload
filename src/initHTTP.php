<?php

use Express\Response;
use Collections\DataLoader;
use Config\InitOptions;
use Payload\PayloadRequest;
use Payload\Payload;
use Middleware\Authenticate;
use Middleware\IdentifyAPI;
use Middleware\ErrorHandler;

function initHTTP(InitOptions $options): Promise
{
    if (!isset($options->local)) {
        $options->local = false;
    }

    $payload = getPayload($options);

    if (!$options->local) {
        $payload->router = new Express\Router();
        $payload->router->use(...expressMiddleware($payload));
        initAuth($payload);

        initCollectionsHTTP($payload);
        initGlobalsHTTP($payload);

        $options->express->use(function (PayloadRequest $req, Response $res, callable $next) use ($payload) {
            $req->payload = $payload;
            $next();
        });

        $options->express->use(function (PayloadRequest $req, Response $res, callable $next) use ($payload) {
            $req->payloadDataLoader = getDataLoader($req);
            $next();
        });

        $payload->express = $options->express;

        if ($payload->config->rateLimit->trustProxy) {
            $payload->express->set('trust proxy', 1);
        }

        initAdmin($payload);
        initPreferences($payload);

        $payload->router->get('/access', 'access');

        if (!$payload->config->graphQL->disable) {
            $payload->router->use(
                $payload->config->routes->graphQL,
                function (PayloadRequest $req, Response $res, callable $next) {
                    if ($req->method === 'OPTIONS') {
                        $res->sendStatus(204);
                    } else {
                        $next();
                    }
                },
                IdentifyAPI('GraphQL'),
                function (PayloadRequest $req, Response $res) {
                    return graphQLHandler($req, $res)($req, $res);
                }
            );
            initGraphQLPlayground($payload);
        }

        mountEndpoints($options->express, $payload->router, $payload->config->endpoints);

        $payload->express->use($payload->config->routes->api, $payload->router);

        initStatic($payload);

        $payload->errorHandler = ErrorHandler($payload->config, $payload->logger);
        $payload->router->use($payload->errorHandler);

        $payload->authenticate = Authenticate($payload->config);
    }

    return $payload;
}
