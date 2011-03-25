<?

include('mobile-detect.php');

function is_ok_browser()
{
	$agent = $_SERVER['HTTP_USER_AGENT'];
	return	strstr($agent, "Chrome") !== FALSE ||
			strstr($agent, "Firefox/4.0") !== FALSE;
//	return	strstr($agent, "MSIE") === FALSE &&
//			strstr($agent, "Opera") === FALSE &&
//			strstr($agent, "FireFox") === FALSE;
}

if ( isset($_GET['idontcare']) || (!detect_mobile_device() && !isset($_GET['lite']) && is_ok_browser()))
{
	include('raycast.html');
}
else
{
	include('mobile.html');
}

?>
