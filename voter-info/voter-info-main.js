// voter-info-main.js
// By Michael Geary - http://mg.to/
// See UNLICENSE or http://unlicense.org/ for public domain notice.

//window.console && typeof console.log == 'function' && console.log( location.href );

// Utility functions and jQuery extensions
var $window = $(window), $body = $('body');

// Return window width or height
function winWidth() { return getWH('Width'); }
function winHeight() { return getWH('Height'); }

function getWH( what ) {
	return window[ 'inner' + what ] || document.documentElement[ 'offset' + what ];
}

// Return element height if visible or 0
$.fn.visibleHeight = function() {
	return this.is(':visible') ? this.height() : 0;
};

// Return element width if visible or 0
$.fn.visibleWidth = function() {
	return this.is(':visible') ? this.width() : 0;
};

var GoogleElectionMap = {};

// Code and data normally both come from the same place, except
// for local testing with a PHP proxy
opt.dataUrl = opt.codeUrl;
if( opt.debug ) opt.dataUrl += 'proxy-local.php?jsonp=?&file=';

// Load Google API loader

function writeScript( url ) {
	document.write( '<script type="text/javascript" src="', url, '"></script>' );
}

writeScript( 'http://www.google.com/jsapi' );

// Array extensions

// Standard array.forEach() for old browsers
if( ! Array.prototype.forEach ) {
	Array.prototype.forEach = function( fun /*, thisp*/ ) {
		if( typeof fun != 'function' )
			throw new TypeError();
		
		var thisp = arguments[1];
		for( var i = 0, n = this.length;  i < n;  ++i ) {
			if( i in this )
				fun.call( thisp, this[i], i, this );
		}
	};
}

// Standard array.map() for old browsers
if( ! Array.prototype.map ) {
	Array.prototype.map = function( fun /*, thisp*/ ) {
		var len = this.length;
		if( typeof fun != 'function' )
			throw new TypeError();
		
		var res = new Array( len );
		var thisp = arguments[1];
		for( var i = 0;  i < len;  ++i ) {
			if( i in this )
				res[i] = fun.call( thisp, this[i], i, this );
		}
		
		return res;
	};
}

// Do an array.map() and then join the elements with no delimiter
// or the specified delimiter (does not default to comma)
Array.prototype.mapjoin = function( fun, delim ) {
	return this.map( fun ).join( delim || '' );
};

// Return a random element from an array
Array.prototype.random = function() {
	return this[ randomInt(this.length) ];
};

// Return a copy of an array with the elements in random order
Array.prototype.randomized = function() {
	var from = this.concat();
	var to = [];
	while( from.length )
		to.push( from.splice( randomInt(from.length), 1 )[0] );
	return to;
};

// Sort an array of objects.
// key is either a property name to sort by, or a function that
// returns a ranking value.
// The sort is a string sort, or if opt.numeric is true, a numeric
// sort (for positive integers).
// A string sort is case independent unless opt.caseDependent is true.
function sortArrayBy( array, key, opt ) {
	opt = opt || {};
	// TODO: use code generation instead of multiple if statements?
	var sep = unescape('%uFFFF');
	
	var i = 0, n = array.length, sorted = new Array( n );
	if( opt.numeric ) {
		if( typeof key == 'function' ) {
			for( ;  i < n;  ++i )
				sorted[i] = [ ( 1000000000000000 + key(array[i]) + '' ).slice(-15), i ].join(sep);
		}
		else {
			for( ;  i < n;  ++i )
				sorted[i] = [ ( 1000000000000000 + array[i][key] + '' ).slice(-15), i ].join(sep);
		}
	}
	else {
		if( typeof key == 'function' ) {
			for( ;  i < n;  ++i )
				sorted[i] = [ key(array[i]), i ].join(sep);
		}
		else if( opt.caseDependent ) {
			for( ;  i < n;  ++i )
				sorted[i] = [ array[i][key], i ].join(sep);
		}
		else {
			for( ;  i < n;  ++i )
				sorted[i] = [ array[i][key].toLowerCase(), i ].join(sep);
		}
	}
	
	sorted.sort();
	
	var output = new Array( n );
	for( i = 0;  i < n;  ++i )
		output[i] = array[ sorted[i].split(sep)[1] ];
	
	return output;
}

// Return a random integer in the range 0 <= result < n
function randomInt( n ) {
	return Math.floor( Math.random() * n );
}

// Concatenate all arguments as strings
function S() {
	return Array.prototype.join.call( arguments, '' );
}

// Wrap text in an <a> tag if href is given, with optional title.
// If href is missing or empty, just return text.
function linkIf( text, href, title ) {
	title = H( title || text ).replace( /"/g, '&quot;' );
	text = H( text );
	return ! href ? text : S(
		'<a target="_blank" href="', href, '" title="', title, '">',
			text,
		'</a>'
	);
}

// Fetch JSON or other content. TODO: clean up
function fetch( url, callback, cache ) {
	if( cache === false ) {
		$.getJSON( url, callback );
	}
	else if( opt.debug  &&  url.indexOf(opt.dataUrl) == 0 ) {
		$.getJSON( url, function( data ) {
			if( ! data ) data = { error: 'Null data' };
			if( data.error ) alert( data.error + ':\n' + url );
			else callback( data.result );
		});
	}
	else {
		_IG_FetchContent( url, callback, {
			refreshInterval: cache != null ? cache : opt.debug ? 1 : opt.cache || 600
		});
	}
}

// Load a string from a template file, T.variables, or a localization file.
// name can be 'template:name' or just 'name' to use T.file.
// Either one is concatenated with T.baseUrl and .html.
// If the name is not found in the template file, look for it in
// in T.variables which also includes the current language's
// localization strings.
// Any {{foo}} found in the string are looked up in the values object
// argument or in T.variables (again including the localization file).
// TODO: We don't look up {{foo}} in the template file - maybe should?
// The first time you call T() on a given template file, you have to
// use the 'give' callback, since the file is loaded asynchronously.
// If you know the file is already loaded, you can just use the return
// value from T() instead (or the callback still works if you use it).
function T( name, values, give ) {
	name = name.split(':');
	var file = name[1] ? name[0] : T.file;
	var url = T.baseUrl + file + '.html', part = name[1] || name[0];
	if( T.urls[url] )
		return ready();
	
	fetch( url, function( data ) {
		var o = T.urls[url] = {};
		var a = data
			.replace( /\r/g, '' )
			.replace( /([^ ])\n+\s*/g, '$1' )
			.split( /\s*<!--::\s+/g );
		for( var i = 1, n = a.length;  i < n;  ++i ) {
			var s = a[i], k = s.match(/^\S+/), v = s.replace( /^\S+\s+::-->/, '' );
			o[k] = $.trim(v);
		}
		ready();
	}, 60 );
	
	function ready() {
		var text = T.urls[url][part];
		if( ! text ) text = T.variables && T.variables[part];
		if( ! text ) return T.error && T.error( url, part );
		text = text.replace(
			/(<!--)?\{\{(\w+)\}\}(-->)?/g,
			function( match, ignore, name ) {
				//window.console && console.log( name );
				var value = values && values[name];
				if( value == null ) value = T.variables && T.variables[name];
				if( value == null ) value = match;
				return value;
			});
		give && give(text);
		return text;
	}
	
	return null;
};
T.urls = {};  // URLs that T() has loaded

// T() options
T.baseUrl = opt.dataUrl + 'templates/';
T.file = 'gadget';
T.error = function( url, part ) {
	if( part == 'ignore' ) {
		// T('ignore') is used only for the initial preload
		$('#outerlimits').html( T('troubleLoading') );
	}
	else {
		// Template error, don't need to localize
		alert(S( "T('", part, "') missing from ", url ));
	}
};

// Call T() and turn the result into a jQuery object
$.T = function( name, values /* TODO: , give */ ) {
	return $( T( name, values ) );
};

// "HTML escape" a string by letting the browser do the work
function H( str ) {
	if( str == null ) return '';
	var div = document.createElement( 'div' );
	div.appendChild( document.createTextNode( str ) );
	return div.innerHTML;
}

// Was a function to return an IG cached version of a URL, but
// we turned that off because refreshInterval stopped working.
// Now it just returns the url or a cachebusted version of it.
// TODO: investigate the IG caching again.
function cacheUrl( url, cache, always ) {
	if( opt.debug  &&  ! always ) return url + '?q=' + new Date().getTime();
	//if( opt.debug ) cache = 0;
	//if( typeof cache != 'number' ) cache = 3600;
	//url = _IG_GetCachedUrl( url, { refreshInterval:cache } );
	//if( ! url.match(/^http:/) ) url = 'http://' + location.host + url;
	return url;
}

// Return an IG cached URL for an image in our image directory
// (but see note re cacheURL)
function imgUrl( url, cache, always ) {
	return cacheUrl( opt.codeUrl + 'images/' + url, cache, always );
}

// Build a query string from the params object, append it to the
// base URL with delim or '?' in between, and return the result.
// Ignore params with null or undefined values.
// Just return the base URL if no params.
function url( base, params, delim ) {
	var a = [];
	for( var p in params ) {
		var v = params[p];
		if( v != null ) a[a.length] = [ p, v ].join('=');
	}
	return a.length ? [ base, a.sort().join('&') ].join( delim || '?' ) : base;
}

// Return an <a> tag linking to a URL (with or without http://)
// or an email address. Prefix an email address with mailto:, or
// if a URL is missing the http:// prefix it with that.
function linkto( addr ) {
	var a = H(addr), u = a;
	if( addr.match(/@/) )
		u = 'mailto:' + u;
	else if( ! addr.match(/^http:\/\//) )
		u = a = 'http://' + a;
	return S( '<a target="_blank" href="', u, '">', a, '</a>' );
}

// Convert Markdown-style text into HTML.
// Just supports *bold* and _italic_ at the moment.
function minimarkdown( text ) {
	return text
		.replace( /\*([^*]+)\*/g, '<b>$1</b>' )
		.replace( /_([^_]+)_/g, '<i>$1</i>' );
}

// Report Analytics for the given path, with a bunch of ad hoc fixups.
function analytics( path ) {
	function fixHttp( url ) {
		return url.replace( /http:\/\//, 'http/' ).replace( /mailto:/, 'mailto/' );
	}
	function fixAction( url ) {
		return {
			'lookup': 'search_submit',
			'#detailsbox': 'view_detail',
			'#mapbox':  'load_map',
			'#Poll411Gadget': 'find_location'
		}[url];
	}
	if( window._ADS_ReportInteraction ) {
		if( path == 'view'  ||  /^javascript:/.test(path) ) return;
		var action = fixAction( path );
		if( action ) {
			//console.log( 'adaction', action );
			_ADS_ReportInteraction( action );
		}
		else {
			//console.log( 'adclick', path );
			_ADS_ReportInteraction( 'destination_url_1', path );
		}
	}
	else {
		if( path.indexOf( 'http://maps.gmodules.com/ig/ifr' ) == 0 ) return;
		if( path.indexOf( 'http://maps.google.com/maps?f=d' ) == 0 ) path = '/directions';
		path = ( maker ? '/creator/' : pref.onebox ? '/onebox/' : inline ? '/inline/' : '/gadget/' ) + fixHttp(path);
		path = '/' + fixHttp(document.referrer) + '/' + path;
		//console.log( 'analytics', path );
		_IG_Analytics( 'UA-5730550-1', path );
	}
}

var userAgent = navigator.userAgent.toLowerCase(),
	msie = /msie/.test( userAgent ) && !/opera/.test( userAgent );

// Gadget options and prefs

// Fetch preferences from gadget userprefs, with default values
var prefInit = {
	gadgetType: 'iframe',
	details: 'tab',
	example: '',
	address: '',
	fontFamily: 'Arial,sans-serif',
	fontSize: '16',
	fontUnits: 'px',
	logo: false,
	onebox: false,
	state: '',
	homePrompt: '',
	electionId: '',
	sidebar: false
};
for( var name in prefInit )
	pref[name] = prefs.getString(name) || prefInit[name];

pref.ready = prefs.getBool('submit');

// Override prompt
//pref.homePrompt = 'We are not supporting any current elections. Click the *Search* button for a demo of this app:';

// TODO: not really using pref.logo any more, remove?
if( pref.logo ) pref.example = pref.example.replace( 'Ex:', 'Example:' );

if( pref.logo ) {
	pref.fontSize = '13';
}

// Let local file (voter-info-[country].js) update prefs
localPrefs( pref );

// Are we running in the gadget creator?
var maker = decodeURIComponent(location.href).indexOf('source=http://www.gmodules.com/ig/creator?') > -1;

// Set up {{foo}} variables for T().
// T.variables includes pref.strings and other values set up here.

var fontStyle = S( 'font-family:', escape(pref.fontFamily), '; font-size:', pref.fontSize, pref.fontUnits, '; ' );

function loadStrings( strings ) {
	pref.strings = strings;
	
	T.variables = $.extend( strings, {
		width: winWidth() - 8,
		height: winHeight() - 80,
		heightFull: winHeight(),
		homePrompt: minimarkdown(pref.homePrompt),
		example: pref.example,
		fontFamily: pref.fontFamily.replace( "'", '"' ),
		fontSize: pref.fontSize,
		fontUnits: pref.fontUnits,
		fontStyle: fontStyle,
		gadgetUrl: opt.gadgetUrl,
		logoImage: imgUrl('election_center_logo.gif'),
		spinDisplay: pref.ready ? '' : 'display:none;',
		spinImage: imgUrl('spinner.gif')
	});
}

// Date and time

var seconds = 1000, minutes = 60 * seconds, hours = 60 * minutes,
	days = 24 * hours, weeks = 7 * days;

// Return localized name of a day of the week (0-6)
function dayName( date ) {
	var day = new Date(date).getDay() + 1;
	return T( 'dayName' + day );
}

// Return localized name of a month (0-11)
function monthName( date ) {
	var month = new Date(date).getMonth() + 1;
	if( month < 10 ) month = '0' + month;
	return T( 'monthName' + month );
}

// Return a localized date like 'January 1' in English
function formatDate( date ) {
	date = new Date( date );
	return T( 'dateFormat', {
		monthName: monthName( date ),
		dayOfMonth: date.getDate()
	});
}

// Return a localized date like 'Monday, January 1' in English
function formatDayDate( date ) {
	date = new Date( date );
	return T( 'dayDateFormat', {
		dayName: dayName( date ),
		monthName: monthName( date ),
		dayOfMonth: date.getDate()
	});
}

// Construct a Date object from a 'MM-DD-YYYY' or 'MM/DD/YYYY' string
function dateFromMDY( mdy ) {
	mdy = mdy.split( /[/-]/ );
	return new Date( mdy[2], mdy[0]-1, mdy[1] );
}

// Construct a Date object from a 'YYYY-MM-DD' or 'YYYY/MM/DD' string
function dateFromYMD( ymd ) {
	ymd = ymd.split( /[/-]/ );
	return new Date( ymd[0], ymd[1]-1, ymd[2] );
}

// Today's date as of midnight
var today = new Date;
today.setHours( 0, 0, 0, 0 );

// Geo calculations

var earthRadius = 6371.0072;

// Return the distance in kilometers between two LatLng objects
function getDistance( ll1, ll2 ) {
	var lat1 = degreesToRadians( ll1.lat() );
	var lat2 = degreesToRadians( ll2.lat() );
	var lng1 = ll1.lng(), lng2 = ll2.lng();
	var lngD = degreesToRadians( lng2 - lng1 );
	var sinLat1 = Math.sin(lat1), sinLat2 = Math.sin(lat2);
	var cosLat1 = Math.cos(lat1), cosLat2 = Math.cos(lat2);
	
	return Math.acos(
		sinLat1 * sinLat2 +
		cosLat1 * cosLat2 * Math.cos(lngD)
	) * earthRadius;
}

// Convert degrees to radians
function degreesToRadians( degrees ) {
	return degrees * Math.PI / 180;
}

// Select gadget mode based on prefs and window size
// TODO: the pixel sizes are fairly arbitrary; there should be
// a way to force a particular mode in the gadget prefs.

var inline = pref.gadgetType == 'inline';
var iframe = ! inline;  // TODO: redundant now
var balloon = pref.sidebar  ||  ( winWidth() >= 450  &&  winHeight() >= 400 );
//var sidebar = !!( pref.sidebar  ||  ( winWidth() >= 800  &&  winHeight() >= 500 ) );
var sidebar = false;
$body.toggleClass( 'logo', pref.logo );
$body.toggleClass( 'sidebar', sidebar );

function initialMap() {
	return balloon && vote && vote.info && vote.info.latlng;
}

var
	gm,  // google.maps
	gme,  // google.maps.events
	map;  // the google.maps.Map object

var
	home,  // home information
	vote;  // voting information

// HTML snippets

// TODO: this isn't really used
function electionHeader() {
	return S(
		'<div style="font-weight:bold;">',
		'</div>'
	);
}

// Should we show the map? Depends on polling place location.
function includeMap() {
	return vote.poll && true;
	//return vote && vote.info && vote.info.latlng;
}

// Return HTML for the tab links, adjusted for active tab
function tabLinks( active ) {
	function tab( id, label ) {
		return T( id == active ? 'tabLinkActive' : 'tabLinkInactive', {
			id: id,
			label: label
		});
	}
	if (((document.location.href.indexOf('nid=') > 0) 
	&& (document.location.href.indexOf('gid=') > 0) 
	&& (document.location.href.indexOf('pid=') > 0)) || (document.location.href.indexOf('cid=') > 0)) {
		return T( 'tabLinks', {
			tab1: tab( '#detailsbox', 'معلومات' ),
			tab2: includeMap() ? tab( '#mapbox', 'الخـريطة' ) : '',
			tab3: '' 
		});	
	}
	return T( 'tabLinks', {
		tab1: tab( '#detailsbox', 'معلومات' ),
		tab2: includeMap() ? tab( '#mapbox', 'الخـريطة' ) : '',
		tab3: pref.ready ? '' : tab( '#Poll411Gadget', 'بـحـــث' )
	});
}

// Show info links for home address
// TODO: this doesn't really use the home address any more,
// could just use the template
function infoLinks() {
	return home && home.info ? T('infoLinks') : '';
}

// Maker inline initialization

function makerWrite() {
	if( msie ) $('body')[0].scroll = 'no';
	$('body').css({ margin:0, padding:0 });
	
	document.write(
		'<div id="outerlimits">',
		'</div>'
	);
}

// Gadget inline initialization

function gadgetWrite() {
	
	document.write(
		'<div id="outerlimits">',
		'</div>'
	);
	
	document.body.scroll = 'no';
}

// Document ready code for inline gadget creator

function makerSetup() {
	analytics( 'creator' );
	
	var $outerlimits = $('#outerlimits');
	
	// Center $item in the window
	function center( $item ) {
		$item.css({
			left: ( winWidth() - $item.width() ) / 2,
			top: ( winHeight() - $item.height() ) / 2
		});
	}
	
	// Add custom "Get the code" popup and button with click action
	function addCodePopups( style, body ) {
		$.T('maker:makerOverlays').insertAfter($outerlimits);
		var $getcode = $('#getcode'), $havecode = $('#havecode'), $codearea = $('#codearea');
		$codearea.height( winHeight() - 150 );
		center( $getcode );
		center( $havecode );
		$getcode.show();
		$('#btnGetCode').click( function() {
			$codearea.val( style + '\n\n' + body + '\n' );
			$havecode.show();
			document.codeform.codearea.focus()
			document.codeform.codearea.select()
		});
	}
	
	// Load the gadget body for the gadget creator
	T( 'maker:ignore', null, function() {
		var style = T('style');
		$(style).appendTo('head');
		$.T('maker:makerStyle').appendTo('head');
		var body = T('html') + '\n\n' + T('maker:makerScript');
		$outerlimits.html( body ).height( winHeight() );
		if( pref.gadgetType != 'iframe' ) addCodePopups( style, body );
	});
}

// Return a DIV containing an A tag linking to a Google map with
// directions for the two locations provided (the home and vote objects)
function directionsLink( from, to ) {
	from = from.info;
	to = to.info;
	return ! isGeocodeAccurate(to.place) ? '' : S(
		'<div>',
			'<a target="_blank" href="http://maps.google.com/maps?f=d&saddr=',
				! isGeocodeAccurate(from.place) ? '' : encodeURIComponent(from.address),
				'&daddr=', encodeURIComponent(to.address),
				'&hl=en&mra=ls&ie=UTF8&iwloc=A&iwstate1=dir"',
			'>',
				T('getDirections'),
			'</a>',
		'</div>'
	);
}

// Wrap some HTML in a DIV for an info section
function infoWrap( html ) {
	return T( 'infoWrap', { html:html } );
}

// TODO: unused? was for V2 Maps API
function formatWaypoint( name, info ) {
	return S(
		T(name), ' (', info.address, ')@',
		info.latlng.lat().toFixed(6), ',', info.latlng.lng().toFixed(6)
	);
}

// Load the Maps API and when it's ready create the Map object
function initMap( go ) {
	google.load( 'maps', '3', {
		other_params: 'sensor=false',
		callback: function() {
			gm = google.maps;
			gme = gm.event;
			var mt = google.maps.MapTypeId;
			map = new gm.Map( $map[0], {
				mapTypeId: mt.ROADMAP
			});
			go();
		}
	});
}

// Load the home and vote markers onto the map, and load voting
// information into the sidebar
function loadMap( a,z ) {
	go();
	
	function ready() {
		setTimeout( function() {
			var only = ! vote.info  ||  ! vote.info.latlng;
			if( home.info  &&  home.info.latlng )
				setMarker({
					place: home,
					image: 'marker-green.png',
					open: only,
					html: ! only ? formatHome(true) : vote.htmlInfowindow || formatHome(true)
				});
			if( vote.info  &&  vote.info.latlng )
				map.setCenter( vote.info.latlng );
				setMarker({
					place: vote,
					html: vote.htmlInfowindow,
					open: true,
					zIndex: 1
				});
		}, 500 );
	}
	
	function setMarker( a ) {
		if(a != null && a.place != null && a.place.info != null && a.place.info.latlng){
			var mo = {
				position: a.place.info.latlng
			};
		}
		if( a.image ) mo.icon = imgUrl( a.image );
		var marker = a.place.marker = new gm.Marker( mo );
		addOverlay( marker );
		gme.addListener( marker, 'click', function() {
			if( balloon ) openBalloon();
			else selectTab( '#detailsbox' );
		});
		if( balloon ) openBalloon();
		
		function openBalloon() {
			var iw = new gm.InfoWindow({
				content: $(a.html)[0],
				maxWidth: Math.min( $map.width() - 100, 350 ),
				zIndex: a.zIndex || 0
			});
			iw.open( map, marker );
		}
	}
	
	function go() {
		setVoteHtml();
		
		var homeLatLng = home && home.info && home.info.latlng;
		var voteLatLng = vote && vote.info && vote.info.latlng;
		
		$tabs.html( tabLinks( initialMap() ? '#mapbox' : '#detailsbox' ) );
		if( ! sidebar ) $map.css({ visibility:'hidden' });
		setLayout();
		if( initialMap() ) {
			$map.show().css({ visibility:'visible' });
			if( ! sidebar ) $detailsbox.hide();
		}
		else {
			if( ! sidebar ) $map.hide();
			$detailsbox.show();
		}
		
		if( homeLatLng && voteLatLng ) {
			new gm.DirectionsService().route({
				origin: homeLatLng,
				destination: voteLatLng,
				travelMode: gm.TravelMode.DRIVING
			}, function( result, status ) {
				if( status != 'OK' ) return;
				var route = result.routes[0];
				map.fitBounds( route.bounds );
				var polyline = new gm.Polyline({
					path: route.overview_path,
					strokeColor: '#0000FF',
					strokeOpacity: .5,
					strokeWeight: 5
				});
				addOverlay( polyline );
			});
		}
		else if( voteLatLng ) {
			if (!z) map.setZoom( 15 );
			else map.setZoom( z );
		}
		
		ready();
		spin( false );
	}
}

// A list of overlays maintained so we can clear them;
// use addOverlay(overlay) instead of overlay.setMap(map),
// and call clearOverlays to clear all overlays.
var overlays = [];

function addOverlay( overlay ) {
	if( ! overlay ) return;
	overlays.push( overlay );
	overlay.setMap( map );
}

function clearOverlays() {
	for( var overlay;  overlay = overlays.pop(); )
		overlay.setMap( null );
}

// Show or hide the spinner
function spin( yes ) {
	//console.log( 'spin', yes );
	$('#spinner').css({ visibility: yes ? 'visible' : 'hidden' });
}

// Geocode an address and call the callback
function geocode( address, callback ) {
	new gm.Geocoder().geocode({
		address: address
	}, callback );
}

// Given a place and type, find an address component returned by the geocoder
function getAddressComponent( place, type ) {
	var components = place.address_components;
	for( var i = 0;  i < components.length;  ++i ) {
		var component = components[i], types = component.types;
		for( var j = 0;  j < types.length;  ++j ) {
			if( types[j] == type )
				return component;
		}
	}
	return null;
}

// Decide if geocoded result is accurate enough for map display
function isGeocodeAccurate( place ) {
	var type = place.geometry.location_type;
	return type == 'ROOFTOP' || type == 'RANGE_INTERPOLATED';
}

// Call the polling location API for an address and call the callback
function pollingApi( nid,gid,pid, callback ) {
	//alert("pollingApi");
	if( ! nid ) {
		//alert("NID is null!");
		callback({ status:'ERROR' });
		return;
	}

	if ((document.location.href.indexOf('cid=') > 0))
		var url ='http://elections2011.eg/proxy.php?type=cid&id='+nid 
		//var url ='http://elections.espace-technologies.com/proxy.php?staging=true&type=cid&id='+nid;
		//var url ='http://178.79.173.29:9000/election?cid='+nid ;
	else
		var url ='http://elections2011.eg/proxy.php?type=nid&id='+nid  
		//var url ='http://elections.espace-technologies.com/proxy.php?staging=true&type=nid&id='+nid; 
		//var url ='http://178.79.173.29:9000/election?nid='+nid ;
		
	//alert(url);
	log( 'Polling API:' );  log( url );
	//alert("Just before calling the api");
	


	$.ajax( url, {
		type: 'GET',		
		//cache: true,
		dataType: 'jsonp',
		jsonp: 'jsonp',

		success: function( poll ) {
			 callback( typeof poll == 'object' ? poll : { status:"ERROR" } );

		},
		error: function(poll){
			//alert("error");
			//alert(poll.toSource());
		}
	});
	//alert("Just after calling the api");
	return false;
}

// Get a JSON value and make sure it is evaluated to JSON
// TODO: this and fetch() need some refactoring
function getJSON( url, callback, cache ) {
	fetch( url, function( text ) {
		// TEMP
		//if( typeof text == 'string' ) text = text.replace( '"locality": }', '"locality":null }' );
		// END TEMP
		//console.log( 'getJson', url );
		//console.log( text );
		var json =
			typeof text == 'object' ? text :
			text == '' ? {} :
			eval( '(' + text + ')' );
		callback( json );
	}, cache );
}

// Set up handlers for input form. Closely related to the makerScript
// section of maker.html.
function setGadgetPoll411() {
	var nid = $('#nid')[0];
	var gid = $('#gid')[0];
	var pid = $('#pid')[0];
	nid.value = pref.example;
	Poll411 = {
		
		focus: function() {
			if( nid.value == pref.example ) {
				nid.className = '';
				nid.value = '';
			}
		},
		
		blur: function() {
			if( nid.value ==  ''  ||  nid.value == pref.example ) {
				nid.className = 'example';
				nid.value = pref.example;
			}
		},
		
		submit: function() {
		   //alert("submit")
		   $previewmap.hide();
			if( sidebar ) {		
				submit( nid.value,gid.value,pid.value );	
			}
			else {
					 $map.hide().css({ visibility:'hidden' });
					 $search.slideUp( 250, function() {
						 $spinner.show();
						 submit( nid.value,gid.value,pid.value );
					});			
			}
			return false;
		}
		
	};
}

// Input form submit handler.
// Turns on logging if input address is prefixed with !
function submit( nid,gid,pid ) {
	if( $("#nid").attr("class") == "error" || $("#pid").attr("class") == "error" || $("#gid").attr("class") == "error" ){
		if(!sidebar ) {
			$map.show().css({ visibility:'visible' });
			$search.slideDown( 250, function() {
				$spinner.hide();
			});
		}
		return false;
	}
	analytics( 'lookup' );
	
	home = {};
	vote = {};
	
	clearOverlays();
	$spinner.show();
	$details.empty();
	nid = $.trim( nid );
	log();
	log.yes = /^!!?/.test( nid );
	if( log.yes ) nid = $.trim( nid.replace( /^!!?/, '' ) );
	
	log( 'Input nid:', nid );
	nid = fixInputAddress( nid );
	
	submitID( nid,gid,pid );
}

// Submit an ID for a voter ID election - no geocoding
function submitID( nid,gid,pid) {
	findPrecinct( nid,gid,pid );
}


// Set up the gadget layout according to its size and options
function setLayout() {
	$body.toggleClass( 'sidebar', sidebar );
	var headerHeight = $('#header').visibleHeight();
	if( pref.logo ) {
		$('#Poll411Form > .Poll411SearchTable').css({
			width: $('#Poll411Form > .Poll411SearchTitle > span').width()
		});
	}
	var formHeight = $('#Poll411Gadget').visibleHeight();
	if( formHeight ) formHeight += 8;  // TODO: WHY DO WE NEED THIS?
	var height = winHeight() - headerHeight - formHeight - $tabs.visibleHeight();
	$map.height( height );
	$detailsbox.height( height );
	if( sidebar ) {
		var left = $detailsbox.width();
		$map.css({
			left: left,
			top: 0,
			width: winWidth() - left
		});
	}
}

// TODO: refactor detailsOnly() and forceDetails()
function detailsOnly( html ) {
	if( ! sidebar ) {
		$tabs.html( tabLinks('#detailsbox') ).show();
		setLayout();
		$map.hide();
	}
	$details.html( html ).show();
	spin( false );
}

// Display only basic information for an election, whatever is
// available without a specific address
function sorry() {
	$details.html( log.print() + sorryHtml() );
	forceDetails();
}

// Display only basic information for an election, whatever is
// available without a specific address
function notTheSame() {
	$details.html( log.print() + notTheSameHtml() );
	forceDetails();
}

// TODO: refactor detailsOnly() and forceDetails()
function forceDetails() {
	
	 setMap( home.info );
        if( ! sidebar ) {
                $map.hide();
                $tabs.html( tabLinks('#detailsbox') ).show();
        }
        $detailsbox.show();
        spin( false );
	
}

// Return the HTML for basic election info
function sorryHtml() {
	setMap( home.info );
	if( ! sidebar ) {
		//$map.hide();
		$tabs.html( tabLinks('#detailsbox') ).show();
		$detailsbox.html(
			 "<div class='not-found'> " +
  			"<h2>غير موجود!</h2>" +
  			" <h3>قد يكون إسمك غير مدرج في جداول الناخبين لأحد الأسباب التالية:</h3>" +
        "<ul>" +
        	"<li>سن المواطن أقل من 18 عام</li>" +
          "<li>" +
          	"<h4>المواطن معفي أو محروم أو موقوف عن الانتخاب طبقا للأسباب التالية:</h4>" +
          	"<ul> "+
            	"<li>  يعفى من أداء واجب الانتخاب ضباط وأفراد القوات المسلحة الرئيسية والفرعية والإضافية وضباط وأفراد هيئة الشرطة طوال مدة خدمتهم بالقوات المسلحة أو الشرطة</li>" +
              "<li> "+
            " <h4> يحرم من مباشرة الحقوق السياسية:</h4>" +
              	"<ol>" +
                	"<li>  المحكوم عليه في جناية ما لم يكن قد رد إليه اعتباره</li> "+
                 " <li>من صدر حكم محكمة القيم بمصادرة أمواله ، ويكون الحرمان لمدة خمس سنوات من تاريخ صدور الحكم</li>" +
                  "<li>المحكوم عليه بعقوبة الحبس في سرقة أو إخفاء أشياء مسروقة أو نصب أو إعطاء شيك لا يقابله رصيد أو خيانة أمانة أو غدر أو رشوة أو تفالس بالتدليس أو تزوير أو استعمال أوراق مزورة أو شهادة زور أو إغراء شهود أو هتك عرض أو إفساد أخلاق الشباب أو انتهاك حرمة الآداب أو تشرد أو في جريمة ارتكبت للتخلص من الخدمة العسكرية والوطنية , كذلك المحكوم عليه لشروع منصوص عليه لإحدى الجرائم المذكورة وذلك ما لم يكن الحكم موقوفا تنفيذه أو كان المحكوم عليه قدر رد إليه اعتباره</li>" +
                  "<li>المحكوم عليه بعقوبة الحبس في سرقة أو إخفاء أشياء مسروقة أو نصب أو إعطاء شيك لا يقابله رصيد أو خيانة أمانة أو غدر أو رشوة أو تفالس بالتدليس أو تزوير أو استعمال أوراق مزورة أو شهادة زور أو إغراء شهود أو هتك عرض أو إفساد أخلاق الشباب أو انتهاك حرمة الآداب أو تشرد أو في جريمة ارتكبت للتخلص من الخدمة العسكرية والوطنية , كذلك المحكوم عليه لشروع منصوص عليه لإحدى الجرائم المذكورة وذلك ما لم يكن الحكم موقوفا تنفيذه أو كان المحكوم عليه قدر رد إليه اعتباره</li>" +
                  "<li>من سبق فصله من العاملين في الدولة أو القطاع العام لأسباب مخلة بالشرف ما لم تنقض خمس سنوات من تاريخ الفصل إلا إذا كان قد صدر لصالحه حكم نهائي بإلغاء قرار الفصل أو التعويض عنه</li>" +
               " </ol>" +
              "</li>" +
              "<li>" +
              	"<h4>تقف مباشرة الحقوق السياسية بالنسبة للأشخاص الآتي ذكرهم:</h4>" +
             		"<ol> "+
                	"<li>المحجور عليهم مدة الحجر </li> "+
                  "<li>المصابون بأمراض عقلية المحجوزون مدة حجزهم</li>" +
                 " <li>لذين شهر إفلاسهم مدة خمس سنوات من تاريخ شهر إفلاسهم ما لم يرد إليهم اعتبارهم قبل ذلك </li>" +
                "</ol>" +
             "</li>" +
            "</ul> "+
          "</li>" +
       " </ul> "+
				"<p><strong>إذا كان لا ينطبق عليك أي مما سبق يمكنك الطعن لإدراج إسمك في الجداول. سوف يتم فتح باب الطعون والإعلان عن آليات الطعن في وقت لاحق .</strong></p>" +		
  		"</div>"
       
		);
		$detailsbox.height('100%');	
	}
    $detailsbox.show();
	spin( false );
   
	

	
}



// Return the HTML for basic election info
function notTheSameHtml() {
	setMap( home.info );
	if( ! sidebar ) {
		//$map.hide();
		$tabs.html( tabLinks('#detailsbox') ).show();
		$detailsbox.html(
		"<div class='not-associated'>" +
      		"<h2>غير مطابق!</h2>" +
       		"<p><strong>هذا الرقم لا يتبع هذا القسم/المحافظة. من فضلك أدخل الرقم والمحافظة والقسم كما هو مدون على بطاقة الرقم القومي الخاص بك.</strong></p>" +
      	"</div>" 
       
		);
		$detailsbox.height('100%');	
	}
    $detailsbox.show();
	spin( false );
   
	

	
}

// Make the map visible and load the home/vote icons
function setMap( a,contest,z ) {//set width and height
	//Phase1	
	/*if( ! a ) return;
	a.width = $map.width();
	$map.show().height( a.height = Math.floor( winHeight() - $map.offset().top ) );*/

	if( ! a ){
		$map.show().height( Math.floor( winHeight() - $map.offset().top ) );
	}else{
		a.width = $map.width();
		$map.show().height( a.height = Math.floor( winHeight() - $map.offset().top ) );
	}

	//end phase1

clearOverlays();
if(contest){
	
		gov = contest.constituency_code.split('_')[1];
		for(var i=0;i<contest.police_stations.length;i++){
			polyState(gov+'_'+contest.police_stations[i].pid ,contest);
//alert(gov+'_'+contest.police_stations[i].pid);
	//alert(contest.police_stations[i].pname);
		}
}

loadMap( a,z );

	
	
}

// Return HTML list of radio butons for multiple geocode matches
function formatPlaces( places ) {
	if( ! places ) return sorryHtml();
	
	var checked = '';
	if( places.length == 1 ) checked = 'checked="checked"';
	else spin( false );
	var list = places.map( function( place, i ) {
		var id = 'Poll411SearchPlaceRadio-' + i;
		place.extra = { index:i, id:id };
		return T( 'placeRadioRow', {
			checked: checked,
			id: 'Poll411SearchPlaceRadio-' + i,
			address: oneLineAddress( place.formatted_address )
		});
	});
	
	return T( 'placeRadioTable', { rows:list.join('') } );
}

// Return an 'info' object for either home.info or vote.info
function mapInfo( contests,place, extra ) {//place and location
	
	extra = extra || {};
	if( place  &&  ! isGeocodeAccurate(place) ) {
		log( 'Not accurate enough' );
		return null;
	}
	
	var formatted =  extra.address 
	log( 'Formatted address:', formatted );
	return {
		place: place,
		address: formatted,
		latlng: place.geometry.location,
		contests: vote.poll.contests,
		location: extra.name,
		_:''
	};
}

// Add click event handlers to the tab links
function setupTabs() {
	var $tabs = $('#tabs');
	$tabs.click( function( event ) {
		var $target = $(event.target);
		if( $target.is('a') ) {
			var tab = $target.attr('href').replace( /^.*#/, '#' );
			selectTab( tab );
		}
		return false;
	});
}


// Activate the named tab
function selectTab( tab ) {
	//alert(tab);	
	analytics( tab );
	$( $tabs.find('span')[0].className ).hide();
	if( tab == '#Poll411Gadget' ) {
		$details.empty();
		nid = $('#nid');
		if(nid) nid.val('');
		cid = $('#cid');
		if(cid) cid.val('');
		$tabs.hide();
		$spinner.css({ display:'none' });
		$map.hide();
		clearOverlays();
		$search.slideDown( 250, function() {
			//$previewmap.show();
			setLayout();
			$map.show();
		});
	}
	else if(tab == "#mapbox"){
		//alert('z');
		//setMap(vote.info,vote.poll.contests[0],12);		
		//gotoConstit(0,true);
		$(tab).show().css({ visibility:'visible' });
		$tabs.html( tabLinks(tab) );
	}else {
		$(tab).show().css({ visibility:'visible' });
		$tabs.html( tabLinks(tab) );
	}
	return false;
};

// Select a tab if it's not already selected
function maybeSelectTab( tab, event ) {
	event = event || window.event;
	var target = event.target || event.srcElement;
	if( target.tagName.toLowerCase() != 'a' ) return selectTab( tab );
	return true;
};

// Load gadget body and load jQuery variables for various elements
function gadgetSetup() {
	$.T('style').appendTo('head');
	$.T('gadgetStyle').appendTo('head');
	
	$('body').prepend( S(
		pref.logo ? T('header') : '',
		T('html')
	) );
	$.T('gadgetBody').appendTo('#outerlimits');
	
	/*var*/ $search = $('#Poll411Gadget'),
		$selectState = $('#Poll411SelectState'),
		$tabs = $('#tabs'),
		$previewmap = $('#previewmap'),
		$map = $('#mapbox'),
		$details = $('#details'),
		$detailsbox = $('#detailsbox'),
		$spinner = $('#spinner'),
		$directions = $('#directions');
	
	if( pref.ready ) $search.hide();
	else setGadgetPoll411();
	setLayout();
	
	analytics( 'view' );
	log();
	gadgetReady();
}

// Append each argument to the log array and also write it to
// console.log if present
function log() {
	if( arguments.length == 0 )
		log.log = [];
	else for( var i = -1, text;  text = arguments[++i]; ) {
		log.log.push( text );
		window.console && console.log && console.log( text );
	}
}




// Global variables
xMousePos = 0; // Horizontal position of the mouse on the screen
yMousePos = 0; // Vertical position of the mouse on the screen
xMousePosMax = 0; // Width of the page
yMousePosMax = 0; // Height of the page

function captureMousePosition(e) {
    if (document.layers) {
        // When the page scrolls in Netscape, the event's mouse position
        // reflects the absolute position on the screen. innerHight/Width
        // is the position from the top/left of the screen that the user is
        // looking at. pageX/YOffset is the amount that the user has
        // scrolled into the page. So the values will be in relation to
        // each other as the total offsets into the page, no matter if
        // the user has scrolled or not.
        xMousePos = e.pageX;
        yMousePos = e.pageY;
        xMousePosMax = window.innerWidth+window.pageXOffset;
        yMousePosMax = window.innerHeight+window.pageYOffset;
    } else if (document.all) {
        // When the page scrolls in IE, the event's mouse position
        // reflects the position from the top/left of the screen the
        // user is looking at. scrollLeft/Top is the amount the user
        // has scrolled into the page. clientWidth/Height is the height/
        // width of the current page the user is looking at. So, to be
        // consistent with Netscape (above), add the scroll offsets to
        // both so we end up with an absolute value on the page, no
        // matter if the user has scrolled or not.
        xMousePos = window.event.x+document.body.scrollLeft;
        yMousePos = window.event.y+document.body.scrollTop;
        xMousePosMax = document.body.clientWidth+document.body.scrollLeft;
        yMousePosMax = document.body.clientHeight+document.body.scrollTop;
    } else if (document.getElementById) {
        // Netscape 6 behaves the same as Netscape 4 in this regard
        xMousePos = e.pageX;
        yMousePos = e.pageY;
        xMousePosMax = window.innerWidth+window.pageXOffset;
        yMousePosMax = window.innerHeight+window.pageYOffset;
    }
}

var pids =[
            "388" , "3689","371" , "3824", "493" , "3875",
            
            "43" , "3204", "3506" , "3638", "302" , "3867", "p311" , "3913",  "272" , "3646", "78" , "4073","345" , "4431", "108" , "329", 
            
            "558" , "3123", "541" , "3131",  "3115" , "3166",
            
            "663" , "3794","681" , "4006",
            
            "817" , "3093", "809" , "3328", "833" , "3603",  "868" , "3905",
            
            "949" , "3832", 
            
            "1112" , "4448", "1198" , "4014", "1198" , "4022",
            
            "1228" , "3816", 
            
            "1741" , "4456", 
            
            "1864" , "3654", "1864" , "3662", "1929" , "4472", "9" , "4057",  "09" , "4057",
            
             "2071" , "3174",
            
            "2275" , "3808", 
            
            "2682" , "3611", "2641" , "3948", "2641" , "3956",
            
            "2691" , "3719", 
                        
            "2781" , "3107", "2771" , "3743", 
            
            "2801" , "3999", "2798" , "4065",
            
            "2917" , "3263", 
            
            "3034" , "3786", "2976" , "2992", "2551" , "3972"
            
        ];
function get_new_pid(old_pid){
	for(var i=0;i<pids.length-1;i++){
		if (pids[i] == old_pid) {return pids[i+1];}
	}
	return -2;
}
function polyState( abbr,contest) {
	GoogleElectionMap.currentAbbr = abbr = abbr.toLowerCase();
	GoogleElectionMap.shapeReady = function( json ) {
		//if( json.state != GoogleElectionMap.currentAbbr ) return;
		//clearOverlays();
		var paths = new gm.MVCArray;
		json.shapes.forEach( function( poly ) {
			var path = new gm.MVCArray;
			paths.push( path );
			var points = poly.points;
			for( var point, i = -1;  point = points[++i]; )
				path.push( new gm.LatLng( point.y, point.x ) );
			path.push( new gm.LatLng( points[0].y, points[0].x ) );
		});
		var polygon = new gm.Polygon({
			paths: paths,
			strokeColor: 'red',
			strokeWeight: 2,
			strokeOpacity: .7,
			fillColor: '#000000',
			fillOpacity: .07
		});

		// Set Netscape up to run the "captureMousePosition" function whenever
		// the mouse is moved. For Internet Explorer and Netscape 6, you can capture
		// the movement a little easier.
		if (document.layers) { // Netscape
		    document.captureEvents(Event.MOUSEMOVE);
		    document.onmousemove = captureMousePosition;
		} else if (document.all) { // Internet Explorer
		    document.onmousemove = captureMousePosition;
		} else if (document.getElementById) { // Netcsape 6
		    document.onmousemove = captureMousePosition;
		}

		//gme.addListener(polygon,'click',function(){alert('sss');});
				
		gme.addListener(polygon,'mouseover',function() {
			var pname;
			for(var i=0;i<contest.police_stations.length;i++){
				if (contest.police_stations[i].pid == json.name.split('_')[1]){
					pname = contest.police_stations[i].pname;
				}
			}
			$("div#popup").html(pname);
			$("div#popup").css('top', yMousePos + 10).css('left', xMousePos + 20);
			$('div#popup').show();
		});

		gme.addListener(polygon,'mouseout',function() {
			$('div#popup').hide();
		});

		addOverlay( polygon );

		map.setCenter(polygon.latLngs.b[0].b[0]);
	};

	$.ajax({
	  url: cacheUrl( S( opt.codeUrl, 'shapes/json/', abbr, '.js' ) ),
	  dataType: "script",
		async: false
	
	});

	//$.getScript( , function(){} );
}


// Return the log array joined with <br> elements in between
log.print = function() {
	return log.yes ? T( 'log', { content:log.log.join('<br />') } ) : '';
}

// Final initialization

opt.writeScript( 'locale/lang-' + pref.lang + '.js' );
maker && inline ? makerWrite() : gadgetWrite();
$(function() {
	$window.resize( setLayout );
	T( 'ignore', null, function() {
		maker && inline ? makerSetup() : gadgetSetup();
	});
	$('body').click( function( event ) {
		var target = event.target;
		if( $(target).is('a') )
			analytics( $(target).attr('href') );
	});
});

