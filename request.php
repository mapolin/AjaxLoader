<?php 
    $response = array( 'items' => array() );

    for($i = 0; $i < 3; $i++) {
        array_push($response['items'], array(
                'piece1' => 'piece 1 content',
                'piece2' => 'piece 2 content',
                'piece3' => 'piece 3 content',
                'piece4' => 'piece 4 content'
            )
        );
    }

    $encoded = json_encode($response);
    header('Content-type: application/json');
    exit($encoded);
?>