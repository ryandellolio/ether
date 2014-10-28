<?php
/*

Ether v.01

Ryan Dellolio

*/
print json_encode(dns_get_record($_GET['host'], DNS_TXT));

?>