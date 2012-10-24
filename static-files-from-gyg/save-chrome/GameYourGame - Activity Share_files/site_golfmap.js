function calDistance(lat1, lon1, lat2, lon2) {
    lat1 = de2ra(lat1);
    lat2 = de2ra(lat2);
    lon1 = de2ra(lon1);
    lon2 = de2ra(lon2);

    var R = 6371 * 1000;
    var d = Math.acos(Math.sin(lat1)*Math.sin(lat2) +
        Math.cos(lat1)*Math.cos(lat2) *
            Math.cos(lon2-lon1)) * R;
    return d;
}
function de2ra(deg) {
    var pi = Math.PI;
    return (deg * (pi/180));
}
function ra2de(rad) {
    var pi = Math.PI;
    return (rad*(180/pi));;
}

function calBearing(lat1, lon1, lat2, lon2) {
    var dLon = de2ra(lon2 - lon1);
    lat1 = de2ra(lat1);
    lat2 = de2ra(lat2);

    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) -
        Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var brng = ra2de(Math.atan2(y, x));
    return (brng + 360)%360;
}

function calAngel(a,b) {

    return 2 * ra2de(Math.asin(b/(2*a)));
}
function calDest(lat1, lon1, brng, d) {
    var R = 6371 * 1000;

    brng = de2ra(brng);

    lat1 = de2ra(lat1);
    lon1 = de2ra(lon1);

    var lat2 = Math.asin( Math.sin(lat1)*Math.cos(d/R) +
        Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng) );
    var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1),
        Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2));
    lon2 = (lon2+3*Math.PI)%(2*Math.PI) - Math.PI;
    return new google.maps.LatLng(ra2de(lat2), ra2de(lon2));

}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function drawShot(startShot, endShot, map, pathcolor, key)
{
    startlatlon = new google.maps.LatLng(startShot['latitude'], startShot['longitude']);
    
    var d = (isNumber(startShot['calculated_distance_metres']) ? parseFloat(startShot['calculated_distance_metres']) : calDistance(startShot['latitude'], startShot['longitude'], endShot['latitude'], endShot['longitude']));
    var r = d;
    if(d > 150)
        r = d/2 + 200;
    var ppath = [];
    ppath.push(new google.maps.LatLng(startShot['latitude'], startShot['longitude']));
    if(d >5) {
        var brng = calBearing(startShot['latitude'], startShot['longitude'], endShot['latitude'], endShot['longitude']);
        
        
        
        var ang = calAngel(r, d);
        
        var dang = (brng + 270 + ang/2)%360;
        
    	//if(brng < 180 && brng >=0)
		//		dang = 360 - dang;
        var rp = calDest(startShot['latitude'], startShot['longitude'], dang, r);
        var pdang = (dang + 180)%360;
        var qdang = pdang - ang;
        if(pdang - qdang < 0)
            qdang = qdang - 360;

		//if(brng > 180 && brng <=360)
		//		pdang =  360 - pdang;
		
		//ppath.push(rp);
        while (pdang - qdang > 1)
        {
        	
        	
            pdang = pdang - 1/map.getZoom() - 1;
            endlocation = calDest(rp.lat(), rp.lng(), pdang, r);
			ppath.push(endlocation);
            //drawsegment(startlatlon, endlocation, pathcolor, startShot, key);
            startlatlon = endlocation;
        }
    }
    var endLatlng = new google.maps.LatLng(endShot['latitude'], endShot['longitude']);
    ppath.push(endLatlng);
    
    var shotPath = new google.maps.Polygon({
    	path: ppath,
    	strokeColor: pathcolor,
    	strokeOpacity: 0.1,
    	strokeWeight: 4,
    	fillColor: pathcolor,
    	fillOpacity: 0.2
  	});
  	shotPath.setMap(map);

	var holepath = new google.maps.Polyline({
        holeid: key,
        shotinfo: startShot,
        originalcolor: pathcolor,
        path: ppath,
        strokeColor: pathcolor,
        strokeOpacity: 0.7,
        strokeWeight: 3
    });

	
    google.maps.event.addListener(holepath, 'mouseover', mouseOverShot);
    google.maps.event.addListener(holepath, 'mouseout', mouseOutShot);
    google.maps.event.addListener(holepath, 'mousemove', mouseMoveShot);

    holepath.setMap(map);
    drawCircle(endLatlng, pathcolor, map.getZoom()/5);
    //drawsegment(new google.maps.LatLng(startShot['latitude'], startShot['longitude']), new google.maps.LatLng(endShot['latitude'], endShot['longitude']), pathcolor, startShot, key);
}

function drawCircle(position, color, size) {
	var circlePath = [];
	var initBrng = 0;
	
	for(var i=0; i < 120; i++) {
		circlePath.push(calDest(position.lat(), position.lng(), initBrng, size));
		initBrng +=5;	
	}
	
	var circle = new google.maps.Polygon({
    	path: circlePath,
    	strokeColor: color,
    	strokeOpacity: 0.1,
    	strokeWeight: 4,
    	fillColor: color,
    	fillOpacity: 0.3
  	});
  	circle.setMap(map);
  	
}

function mouseOverShot(e) {
	
        //holepath.setOptions(options: { strokeColor: 'blue' });

        var club = getclub(this.shotinfo.equipment_id);


        /*<div class="clubitem"><table><tr><td>'+(i+1)+'</td><td><strong>'+club['name']+'</strong><br/>'+club['modelRange']['name'] + '<br/>Euipement Type: '+ club['equipmentType']['name']+'</td><td align="right"><strong>'+hdata['shot'][i]['calculated_distance_metres']+' </strong>Metres</td></tr></table></div>*/

        ibcontent = '<div style="border: 1px solid black; margin-top: 8px; background: black; padding: 5px;color:#fff;"><div><strong>Hole: </strong>'+this.holeid+'</div><div><strong>Club Name: </strong>'+club['name']+'</div><div><strong>Model Name:</strong> '+club['modelRange']['name']+'</div><div><strong>Equipment Type: </strong>'+club['equipmentType']['name']+'</div><div><strong>Total Hole Distance: </strong>'+this.shotinfo.calculated_distance_metres+' (in metres)</div>';
        var thisnode = this;
        if(ib_timer != null)
            clearTimeout(ib_timer);


        ibopenTimer = setTimeout(function () {
            ib.setContent(ibcontent);
            //thisnode.setOptions({strokeColor: 'red', strokeWeight: 10});

            var lat = e.latLng.lat();
            var long = e.latLng.lng()
            ib.open(map, marker);
            ib.setPosition(new google.maps.LatLng(lat, long));
        }, 500);

}

function mouseOutShot(e) {
	var path = this;
        var originalc = this.originalcolor;
        path.setOptions({strokeColor: originalc, strokeWeight: 3});
        ib_timer = setTimeout(function () {
            ib.close(map, marker);
        }, 500);
        clearTimeout(ibopenTimer);
        //$("#easyTooltip").remove();
}

function mouseMoveShot(e) {
	
        //$("#easyTooltip").css("top",(e.pageY - options.yOffset) + "px").css("left",(e.pageX + options.xOffset) + "px")
        //alert('mousemove:'+e.latLng.lat()+':'+e.latLng.lng());
        var lat = e.latLng.lat();
        var long = e.latLng.lng()
        ib.setPosition(new google.maps.LatLng(lat, long));
}

