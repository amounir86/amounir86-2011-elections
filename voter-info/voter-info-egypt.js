// voter-info-egypt.js
// By Michael Geary - http://mg.to/
// See UNLICENSE or http://unlicense.org/ for public domain notice.

// Language and prefs

$(window).load(function() {
	$(function() {      
		$('#pid').chained('#gid'); 
	});
	
	$("input#nid").focus(function () {
         $('.id-demo > .id-num').fadeIn(500);
    });
    $("input#nid").blur(function () {
         $('.id-demo > .id-num').fadeOut(500);
    });
    
    $("select#gid").focus(function () {
         $('.id-demo > .gov').fadeIn(500);
    });
    $("select#gid").blur(function () {
         $('.id-demo > .gov').fadeOut(500);
    });
    
    $("select#pid").focus(function () {
         $('.id-demo > .station').fadeIn(500);
    });
    $("select#pid").blur(function () {
         $('.id-demo > .station').fadeOut(500);
    });
});
$(document).ready(function(){
	
   
/*
* Chained - jQuery non AJAX(J) chained selects plugin
*
* Copyright (c) 2010 Mika Tuupola
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*
*/

(function($) {

    $.fn.chained = function(parent_selector, options) {
        
        return this.each(function() {
            
            /* Save this to self because this changes when scope changes. */
            var self = this;
            var backup = $(self).clone();
                        
            /* Handles maximum two parents now. */
            $(parent_selector).each(function() {
                                                
                $(this).bind("change", function() {
                    $(self).html(backup.html());

                    /* If multiple parents build classname like foo\bar. */
                    var selected = "";
                    $(parent_selector).each(function() {
                        selected += "\\" + $(":selected", this).val();
                    });
                    selected = selected.substr(1);

                    /* Also check for first parent without subclassing. */
                    /* TODO: This should be dynamic and check for each parent */
                    /* without subclassing. */
                    var first = $(parent_selector).first();
                    var selected_first = $(":selected", first).val();
                
                    $("option", self).each(function() {
                        /* Remove unneeded items but save the default value. */
                        if (!$(this).hasClass(selected) &&
                            !$(this).hasClass(selected_first) && $(this).val() !== "") {
                                $(this).remove();
                        }
                    });
                
                    /* If we have only the default value disable select. */
                    if (1 == $("option", self).size() && $(self).val() === "") {
                        $(self).attr("disabled", "disabled");
                    } else {
                        $(self).removeAttr("disabled");
                    }
                    $(self).trigger("change");
                });
                
                /* Force IE to see something selected on first page load, */
                /* Unless something is already selected */
                if ( !$("option:selected", this).length ) {
                    $("option", this).first().attr("selected", "selected");
                }

                /* Force updating the children. */
                $(this).trigger("change");

            });
        });
    };
    
    /* Alias for those who like to use more English like syntax. */
    $.fn.chainedTo = $.fn.chained;
    
})(jQuery);


	//$(function() {      
		//setTimeout("$('#pid').chained('#gid')",20);   
//	});



	
	





});

//Michael code
var defaultLanguage = 'ar';
var supportedLanguages = {
	ar: 'عربي',
	en: 'English',
	fr: 'Français',
	_: null
};

var prefs = new _IG_Prefs();
var pref = {
	lang: prefs.getString( '.lang' )
};

if( ! supportedLanguages[pref.lang] )
	pref.lang = defaultLanguage;

function localPrefs( pref ) {
}

var initialBbox = [ 22.6066970, 21.61291460, 38.9982990, 31.79954240 ];

//var initialBbox = [ 22.6066970, 21.61291460, 38.9982990, 31.79954240 ];

// Output formatters

function attribution() {
	return T( 'attribution' );
}

function locationWarning() {
	return vote.locations && vote.locations.length ?
		T('locationWarning') :
		'';
}

function electionInfo() {
	var elections = [];
	return S(
		generalInfo(),
		elections.join(''),
		infoLinks(),
		attribution()
	);
}

function generalInfo() {
	return S(
		'<div style="margin-bottom:0.5em;">',
		'</div>'
	);
}

function perElectionInfo( state, electionDay, electionName ) {
	
	var cands = candidates();
	return cands ? S(
		'<div style="margin-bottom:0.5em;">',
			'<div class="heading" style="margin:0.75em 0;">',
				formatDate(electionDay), ' ', electionName,
			'</div>',
			cands,
		'</div>'
	) : '';
	
	function candidates() {
		var contests = getContests();
		if( ! contests ) return '';
		contests = sortArrayBy( contests, 'ballot_placement', { numeric:true } );
		var randomize = contests[0].ballot.candidate[0].order_on_ballot == null;
		var randomizedMessage = ! randomize ? '' : S(
			'<div style="font-size:85%; font-style:italic; margin-top:0.5em">',
				T('candidateRandomOrder'),
			'</div>'
		);
		return S(
			'<div>',
				randomizedMessage,
				contests.mapjoin( function( contest ) {
					var candidates = contest.ballot.candidate;
					candidates = randomize ?
						candidates.randomized() :
						sortArrayBy( candidates, 'order_on_ballot', { numeric:true } );
						
					return S(
						'<div class="heading" style="xfont-size:110%; margin-top:0.5em">',
							contest.office,
						'</div>',
						candidates.mapjoin( function( candidate ) {
							function party() {
								return candidate.party ? S(
									'<span style="color:#444; font-size:85%;">',
										' - ',
										candidate.party,
									'</span>'
								) : '';
							}
							return S(
								'<div>',
									linkIf( candidate.name, candidate.candidate_url ),
									party(),
								'</div>'
							);
						})
					);
				}),
			'</div>'
		);
	}
}

function setVoteHtml() {
	if( !( vote.info || vote.locations ) ) {
		$details.append( log.print() );
		return;
	}
	
	function voteLocation( infowindow ) {
		var loc = T('yourVotingLocation');
		if( !( vote.locations && vote.locations.length ) )
			return '';
		if( vote.info )
	
			return formatLocations(vote.poll.contests, vote.locations, vote.info,
				null,
				loc, infowindow, '', true
			);
		/*return infowindow ? '' : formatLocations( vote.locations, vote.info,
			{ url:'vote-icon-32.png', width:32, height:32 },
			loc + ( vote.locations.length > 1 ? 's' : '' ), false, '', false
		);*/
	}
	
	if( ! sidebar ) 
		$tabs.show();//TODO
	$details.html( longInfo() ).show();
	vote.html = infoWrap( S(
		log.print(),
		electionHeader(),
		homeAndVote()//,
		//'<div style="padding-top:1em">',
		//'</div>',
		//electionInfo()
	) );
	vote.htmlInfowindow = infoWrap( S(
		log.print(),
		electionHeader(),
		homeAndVote( true )//,
		//'<div style="padding-top:1em">',
		//'</div>',
		//electionInfo()
	) );
	
	function homeAndVote( infowindow ) {
		var viewMessage = getContests() ?
			T('viewCandidates') :
			T('viewDetails');
		var viewLink = sidebar ? '' : S(
			'<div style="padding-top:0.75em;">',
				'<a href="#detailsbox" onclick="return selectTab(\'#detailsbox\');">',
					viewMessage,
				'</a>',
			'</div>'
		);

		return vote.info && vote.info.latlng ? S(voteLocation( true ),viewLink) : S(voteLocation( infowindow ));
		
	}
	
	function longInfo() {
		return T( 'longInfo', {
			log: log.print(),
			header: electionHeader(),
			location: voteLocation(),
			warning: locationWarning(),
			info: electionInfo()
		});
	}
}

function getContests() {
	var contests = vote && vote.poll && vote.poll.contests && vote.poll.contests[0];
	return contests && contests.length && contests;
}

function formatLocations( contests,locations, info, icon, title, infowindow, extra, mapped ) {
	
	//alert(contests[0].police_stations[0].pname);
	function formatLocationRow( info ) {
		//alert(info.toSource());
		var address = T( 'address', {
			location: H( info.location ),
			//contests: contests[0].police_stations[0].pname,
			contests: contests,
			address: multiLineAddress( info.address )
		});
		return T( 'locationRow', {
			iconSrc: "",//imgUrl(icon.url),
			iconWidth: 0,//icon.width,
			iconHeight: 0,//icon.height,
			address: address,
			//contests: contests[0].police_stations[0].pname,
			contests: contests,
			directions: info.directions || '',
			hours: info.hours ? 'Hours: ' + info.hours : '',
			extra: extra || ''
		});
	}
	
	var rows = info ?
		[ formatLocationRow(info) ] :
		locations.map( function( location ) {
			var a = location.address;
			return formatLocationRow({
				location: a && a.location_name || '',
				directions: location.directions || '',
				hours: location.pollinghours || '',
				//contests: contests[0].police_stations[0].pname || '',
				contests: contests || [],
				address: a
			});
		});
	
	return S(
		T( 'locationHead', {
			select: includeMap() ? 'onclick="return maybeSelectTab(\'#mapbox\',event);" style="cursor:pointer;"' : '',
			title: title
		}),
		rows.join(''),
		T( 'locationFoot', {
			unable: info && info.latlng || mapped ? '' : T('locationUnable')
		})
	);
}

// Set up map and sidebar when the polling place location is known
function setVoteGeo(location) {
	
	//alert(vote.poll.contests.toSource());
	if( location ) {
/*		var place = {address_components:[{long_name:"", short_name:"", types:["street_number"]}, {long_name:location[0].address.location_name, short_name:location[0].address.location_name, types:["route"]}, {long_name:"Oakton", short_name:"Oakton", types:["locality", "political"]}, {long_name:"Providence", short_name:"Providence", types:["administrative_area_level_3", "political"]}, {long_name:"Fairfax", short_name:"Fairfax", types:["administrative_area_level_2", "political"]}, {long_name:"Virginia", short_name:"VA", types:["administrative_area_level_1", "political"]}, {long_name:"United States", short_name:"US", types:["country", "political"]}, {long_name:"22124", short_name:"22124", types:["postal_code"]}], formatted_address:"11509 Waples Mill Rd, Oakton, VA 22124, USA", geometry:{location:{Pa:38.875815, Qa:-77.344786}, location_type:"ROOFTOP", viewport:{ba:{b:38.8744660197085, d:38.8771639802915}, V:{d:-77.34613498029148, b:-77.34343701970852}}}, partial_match:true, types:["street_address"]}*/
		/*var place = {geometry:{location:{Pa:38.875815, Qa:-77.344786}, location_type:"ROOFTOP", viewport:{ba:{b:38.8744660197085, d:38.8771639802915}, V:{d:-77.34613498029148, b:-77.34343701970852}}}};*/

		var place ={geometry: {
		location: {},
		location_type: "ROOFTOP",
		/*viewport: {
			southwest: {lat: location.lat-0.02,lng: location.lng-0.01},
			northeast: {lat: location.lat+0.02,lng: location.lng+0.01}
      		},*/
		/*bounds: {
			southwest: {lat: location.lat-0.0005,lng: location.lng-0.001},
			northeast: {lat: location.lat+0.0015,lng: location.lng+0.001}

      		}*/
	    }};
	    //alert(place.toSource());
	    place.geometry.location =new gm.LatLng( location.lat, location.lng );
	    //place.geometry.location = new gm.LatLng(  30.0647,31.2495);
	    log( 'Getting polling place map info' );
	    setMap( vote.info = mapInfo( vote.poll.contests, place, location ) );
	    map.setCenter( voteLatLng );
	    //return;
	}
	setVoteNoGeo();
}

// Set up map and sidebar with no polling place location
function setVoteNoGeo() {
	setVoteHtml();
	forceDetails();
}

// Return a single line formatted address, from either a string or
// an address object
function oneLineAddress( address ) {
	if( ! address )
		return '';
	//if( typeof address == 'string' )
	//	return H(address).replace( /, USA$/, '' );
	return H( S(
		address.line1 ? address.line1 + ', ' : '',
		address.line2 ? address.line2 + ', ' : '',
		address.city, ', ', address.state,
		address.zip ? ' ' + address.zip : ''
	) );
}

// Return a multiline formatted address, from either a string or
// an address object
function multiLineAddress( address ) {
	if( ! address )
		return '';
	if( typeof address == 'string' )
		return H(address)
			//.replace( /, USA$/, '' )
			.replace( /, (\w\w) /, '\| $1 ' )
			.replace( /, /g, '<br>' )
			.replace( /\|/g, ',' );
	return S(
		address.line1 ? H(address.line1) + '<br>' : '',
		address.line2 ? H(address.line2) + '<br>' : '',
		H(address.city), ', ', H(address.state),
		address.zip ? ' ' + H(address.zip) : ''
	);
}

// Apply any local fixups to an address
function fixInputAddress( addr ) {
	//if( addr == pref.example )
	//	addr = addr.replace( /^.*: /, '' );
	return addr;
}

// Geocoding and Election Center API

function lookupPollingPlace( nid,gid,pid, callback ) {
	//alert ("lookupPollingPlace");
	function ok( poll ) { return poll.status == 'SUCCESS'; }
	function countyAddress() {
		return S( info.street, ', ', info.county, ', ', info.state.abbr, ' ', info.zip );
	}
	pollingApi( nid,gid,pid, function( poll ) {
		if( ok(poll) ){
			//alert("OK");	
			callback( poll );
		}else{
			//alert("FAIL");
			pollingApi( nid,gid,pid, callback );
		}
	});
}

function findPrecinct( nid,gid,pid ) {
	//alert("findPrecinct");
	lookupPollingPlace( nid,gid,pid, 


function( poll ) {
	    
		alert("callback called");
		log( 'API status code: ' + poll.status || '(OK)' );
		vote.poll = poll;
		var locations = vote.locations = poll.locations;
		var contests = poll.contests;
		//alert(locations.toSource());
		if( poll.status != 'SUCCESS'  ||  ! locations  ||  ! locations.length ) {
			sorry();//TODO
			return;
		}
		var location = locations[0];
		//alert(location.toSource());
		if( location.lng && location.lat ){
			log( 'Polling address found' );			
			setVoteGeo( location );
		}
		else {
			log( 'No polling address' );
			setVoteNoGeo();
		}
	}

);
}

// Gadget initialization

function zoomTo( bbox ) {
	var bounds = new gm.LatLngBounds(
		new gm.LatLng( bbox[1], bbox[0] ),
		new gm.LatLng( bbox[3], bbox[2] )
	);
	map.fitBounds( bounds );
}

function gadgetReady( json ) {
	initMap( function() {
		setupTabs();
		if( pref.ready ){
			//alert('if');
			submit( pref.address || pref.example );
		}else{
			//alert('else');
			zoomTo( initialBbox );
		}
	});
}
