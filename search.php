<?php

require 'rdio/rdio.php';

$rdio = new Rdio(array("4mjsnxuvs9j83sqsesgmswzx", "CpVnbCmyWF"));

$call = $rdio->call('search', array('query'=>$_GET['term'], 'types'=>'Track', 'extras'=>'bigIcon'));

echo '[';
$arr = array();
foreach($call->result->results as $result) {
	$arr[] = '{ "label": "' . $result->name . '", "artist": "' . $result->artist . '", "value": "' . $result->name . '", "id": "' . $result->key . '", "cover": "' . $result->bigIcon . '", "duration": ' . $result->duration . '}';
}
$arr_str = implode(',', $arr);
echo $arr_str;
echo ']';

?>