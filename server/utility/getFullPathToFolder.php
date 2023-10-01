<?php
function getFullPathToFolder($filename)
{
    return $_SERVER["DOCUMENT_ROOT"] . "/server/files/$filename";
}
