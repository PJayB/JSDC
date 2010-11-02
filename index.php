<?

include('mobile-detect.php');

if ( !detect_mobile_device() && !isset($_GET['lite']) && strstr($_SERVER['HTTP_USER_AGENT'], "MSIE") === FALSE )
{
	include('raycast.html');
}
else
{
	include('mobile.html');
}

?>
