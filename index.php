<?

include('mobile-detect.php');

if ( !detect_mobile_device() && !isset($_GET['lite']) )
{
	include('raycast.html');
}
else
{
	echo "Coming Soon.";
}

?>
