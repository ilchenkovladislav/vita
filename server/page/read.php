<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/database.php";
include_once "../objects/page.php";
include_once "../objects/section.php";
require "../utility/createServerResponse.php";

$database = new Database();
$db = $database->getConnection();

$page = new Page($db);
$section = new Section($db);

$pages = $page->read();
$num = $pages->rowCount();

if ($num > 0) {
    $pages_arr = array();

    while ($row = $pages->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $page_item = array(
            "id" => $id,
            "title" => $title,
            "link" => $link
        );

        $sections = $section->read($id);
        $num = $sections->rowCount();

        if ($num > 0) {
            $row = $sections->fetchAll(PDO::FETCH_ASSOC);

            foreach ($row as &$item) {
                $item["pageId"] = $item["page_id"];
                unset($item["page_id"]);
            }

            $page_item["sections"] = $row;
        } else {
            $page_item["sections"] = [];
        }

        $pages_arr[] = $page_item;
    }

    http_response_code(200);

    echo createServerResponse(200, "Успешно", $pages_arr);
} else {
    http_response_code(404);

    echo createServerResponse(404, "Страницы не найдены.");
}
