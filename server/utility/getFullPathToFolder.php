<?php
function getFullPathToFolder($filename)
{
    if (isset($_SERVER['HTTPS'])) {
        return "https://" . $_SERVER["SERVER_NAME"] . "/server/files/$filename";
    } else {
        return "http://" . $_SERVER["SERVER_NAME"] . "/server/files/$filename";
    }
}
