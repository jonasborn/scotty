<?php


// file: src/index.php
namespace Tqdev\PhpCrudApi {

    require_once __DIR__ . '/vendor/autoload.php';

    use Exception;
    use Tqdev\PhpCrudApi\Config\Config;


    $db_template = __DIR__ . '/.secure/scotty.template.db';
    $db_file = __DIR__ . '/.secure/scotty.db';
    if (!file_exists($db_file)) {
        copy($db_template, $db_file);
    }

    try {
        $config = new Config([
            'driver' => 'sqlite',
            'address' => '.secure/scotty.db',
            // 'port' => '3306',
            'username' => 'php-crud-api',
            'password' => 'php-crud-api',
            'database' => 'php-crud-api',
            'debug' => true
        ]);

        $request = RequestFactory::fromGlobals();
        $api = new Api($config);
        $response = $api->handle($request);
        ResponseUtils::output($response);

        file_put_contents('request.log',RequestUtils::toString($request)."===\n",FILE_APPEND);
        file_put_contents('request.log',ResponseUtils::toString($response)."===\n",FILE_APPEND);
    } catch (Exception $e) {
        echo 'We are fucked';
    }

}