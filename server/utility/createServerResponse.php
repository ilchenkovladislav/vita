<?php
function createServerResponse($code, $message, $record = null)
{
    if ($record === null) {
        return json_encode(["status" => $code, "message" => $message], JSON_UNESCAPED_UNICODE);
    }

    return json_encode(["status" => $code, "message" => $message, "records" => $record], JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
}
