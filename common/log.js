function clear_log()
{
    var log_wnd = document.getElementById("log");
    log_wnd.innerHTML = "";
}

function log(text)
{
	text = String(text);
	
    var log_wnd = document.getElementById("log");
	
	if (text.length == 0 || log_wnd == null)
	{
		return;
	}
	
	var old_strings = log_wnd.innerHTML.split('\n');
	var new_strings = text.split('\n');
	
	for ( var c = 0; c < new_strings.length; ++c )
	{
		if ( new_strings[c].length != 0 )
		{
			new_strings[c] = "<li>" + new_strings[c] + "</li>";
		}
	}
	
	var final_strings = [];
	for ( var c = 0; c < old_strings.length; ++c )
	{
		if ( old_strings[c].length != 0 )
		{
			final_strings.push( old_strings[c] );
		}
	}
	
	final_strings = final_strings.concat(new_strings);
	
	var offset = Math.max(0, final_strings.length - 5);
				
	log_wnd.innerHTML = "";
	for ( var c = offset; c < final_strings.length; ++c )
	{
		log_wnd.innerHTML += final_strings[c] + "\n";
	}
}

