/*
    PJB: Is this IE/FF/Opera/Safari/Chrome/something else?
*/
function is_browser(what)
{
	return navigator.userAgent.indexOf(what) != -1;
}
function is_ie()
{
    return is_browser('Internet Explorer');
}
function is_firefox()
{
    return is_browser('FireFox');
}
function is_opera()
{
    return is_browser('Opera');
}
function is_safari()
{
    return is_browser('Safari');
}
function is_chrome()
{
    return is_browser('Chrome');
}

