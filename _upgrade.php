<?php

ini_set('max_execution_time', 600);


$this->log->info("UPGRADE | begin");
$t = new timeExec();

$this->log->info("UPGRADE | end :".$t->getTime());
?>