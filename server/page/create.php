<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once "../config/database.php";
include_once "../objects/page.php";
require "../utility/createServerResponse.php";

$database = new Database();
$db = $database->getConnection();
$page = new Page($db);

$data = json_decode(file_get_contents("php://input"));

$page->title = $data->title;
$page->link = $data->link;

if ($page->create()) {
    http_response_code(201);

    $page->id = $page->getLastId();
    $page->sections = [];

    echo createServerResponse(201, "Страница создана", [$page]);
} else {
    http_response_code(503);

    echo createServerResponse(503, "Не удалось создать страницу");
}
