<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once "../config/database.php";
include_once "../objects/setting.php";
require "../utility/createServerResponse.php";

$database = new Database();
$db = $database->getConnection();
$setting = new Setting($db);

$data = json_decode(file_get_contents("php://input"));

$setting->theme = $data->settings->theme;
$setting->pageId = $data->pageId;

if ($setting->create()) {
    http_response_code(201);

    $setting->id = $setting->getLastId();

    echo createServerResponse(201, "Страница создана.", [$setting]);
} else {
    http_response_code(503);

    echo createServerResponse(503, "Невозможно создать страницу.");
}
