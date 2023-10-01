<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once "../config/database.php";
include_once "../objects/image.php";
require "../utility/createServerResponse.php";

$database = new Database();
$db = $database->getConnection();

define("FULL_PATH_TO_FOLDER", "{$_SERVER["DOCUMENT_ROOT"]}/files/");

moveUploadedFiles(FULL_PATH_TO_FOLDER);

$errors = [];

$images = createRecords($db, $errors);

if (count($errors) === 0) {
    http_response_code(201);

    echo createServerResponse(201, "Изображения добавлены.", $images);
} else {
    http_response_code(503);

    echo createServerResponse(503, "Невозможно добавить изображение.");
}

function createRecords($db, &$errors)
{
    $images = [];

    foreach ($_FILES["images"]["name"] as $filename) {
        $image = new Image($db);

        $p = FULL_PATH_TO_FOLDER . "{$filename}";

        $image->path = $p;

        if (!$image->create()) {
            $errors[] = $image->path;
            continue;
        }

        $image->id = $image->getLastId();
        $image->sectionId = $_POST["sectionId"];
        $images[] = $image;
    }

    return $images;
}

function moveUploadedFiles($dir)
{
    for ($i = 0; $i < count($_FILES['images']['name']); $i++) {
        $path = "{$dir}/{$_FILES["images"]["name"][$i]}";

        move_uploaded_file($_FILES['images']['tmp_name'][$i], $path);
    }
}
