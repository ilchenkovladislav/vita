<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once "../config/database.php";
include_once "../objects/section.php";
require "../utility/createServerResponse.php";

$database = new Database();
$db = $database->getConnection();

$section = new Section($db);

$data = json_decode(file_get_contents("php://input"));

$section->id = $data->id;
$section->title = $data->title;
$section->comment = $data->comment;
$section->pageId = $data->pageId;
$section->sequence = $data->sequence;

if ($section->delete()) {
    http_response_code(200);

    echo createServerResponse(200, "Секция удалена", [$section]);
} else {
    http_response_code(503);

    echo createServerResponse(503, "Не удалось удалить секцию");
}
