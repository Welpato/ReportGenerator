<?php
//header("Content-type: text/javascript; charset=iso-8859-1");
$arr = '';
if(isset($_REQUEST)){
	require 'reports.php';
	$report = new negRelatorio();
	if($_REQUEST['action'] == 'returnReports'){
		$arr = $report->returnReports((isset($_REQUEST['reportId'])?$_REQUEST['reportId']:''),isset($_REQUEST['onlyActive'])?$_REQUEST['onlyActive']:true);
	}else if($_REQUEST['action'] == 'insertUpdateReport'){
		$arr = $report->insertUpdateReport($_REQUEST['reportName'],$_REQUEST['sqlBase'],$_REQUEST['radioActive'],(isset($_REQUEST['reportId'])?$_REQUEST['reportId']:""));
	}else if($_REQUEST['action'] == 'insertUpdateInput'){
		$arr = $report->insertUpdateInput($_REQUEST['reportId'], $_REQUEST['type'], $_REQUEST['exhibitionName'], $_REQUEST['name'], $_REQUEST['notNull'], (isset($_REQUEST['inputId'])?$_REQUEST['inputId']:""));
	}else if($_REQUEST['action'] == 'deleteInput'){
		$arr = $report->deleteInput($_REQUEST['inputId']);
	}else if($_REQUEST['action'] == 'returnReportInputs'){
		$arr = $report->returnReportInputs($_REQUEST['reportId']);
	}else if($_REQUEST['action'] == 'executeSql') {
		$arr = $report->executeSql($_REQUEST['sql']);
	}
}
//var_dump($arr);
echo json_encode($arr);