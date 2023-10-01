<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/database.php";
include_once "../objects/image.php";
require "../utility/createServerResponse.php";
require_once "../utility/getFullPathToFolder.php";

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

$image = new Image($db);

$images = $image->read($data->id);
$num = $images->rowCount();

if ($num > 0) {
    $images_arr = array();

    while ($row = $images->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $image_item = array(
            "id" => $id,
            "sectionId" => $section_id,
            "path" => "http://vita/server/files/" . $path
        );

        $images_arr[] = $image_item;
    }

    http_response_code(200);

    echo createServerResponse(200, "Успешно", $images_arr);
} else {
    http_response_code(404);

    echo createServerResponse(404, "Страницы не найдены.");
}
