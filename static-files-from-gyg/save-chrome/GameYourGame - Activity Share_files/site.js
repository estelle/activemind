/**
 *
 * Copyright (c) 2007 Tom Deater (http://www.tomdeater.com)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

(function($) {
  /**
   * equalizes the heights of all elements in a jQuery collection
   * thanks to John Resig for optimizing this!
   * usage: $("#col1, #col2, #col3").equalizeCols();
   */

  $.fn.equalizeCols = function(){
    var height = 0,
      reset = $.browser.msie && $.browser.version < 7 ? "1%" : "auto";

    return this
      .css("height", reset)
      .each(function() {
        height = Math.max(height, this.offsetHeight);
      })
      .css("height", height)
      .each(function() {
        var h = this.offsetHeight;
        if (h > height) {
          $(this).css("height", height - (h - height));
        };
      });

  };

})(jQuery);



$(document).ready(function() {

  //member menu actions
  var mmtimer = null;
  $('#member_actions_menu').bind('mouseleave', function() {
    mmtimer = setTimeout(function() {
      $('#member_actions_menu').fadeOut();
    },1000);
  });
  $('#member_actions_menu').bind('mouseenter', function() {
    clearTimeout(mmtimer);
  });

  $('#my_actions_menu').bind('mouseenter', function () {
    clearTimeout(mmtimer);
  });
  $('#my_actions_menu').bind('mouseleave', function () {
    mmtimer = setTimeout(function() {
      $('#member_actions_menu').fadeOut();
    },1000);
  });
  $('#my_actions_menu').bind('click', function () {
    $('#member_actions_menu').fadeIn();
    return false;
  });

  //searh init
  $('#searh_text').bind('focus', function () {
    if($(this).val() == 'Search')
      $(this).val('');
  });
  $('#searh_text').bind('blur', function () {
    if($(this).val() == '')
      $(this).val('Search');
  });

  $('#logout').bind('click', function () {
    logout();
    return false;
  });

});

var dateFormat = function () {
  var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function (val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) val = "0" + val;
      return val;
    };

  // Regexes and supporting functions are cached through closure
  return function (date, mask, utc) {
    var dF = dateFormat;

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
      mask = date;
      date = undefined;
    }

    // Is it postGresSQL
    var postgresDate = parsePostGreSQL(date);
    // Passing date through Date applies Date.parse, if necessary
    date = postgresDate ? postgresDate : date;
    date = date ? new Date(date) : new Date;

    if (isNaN(date)) throw SyntaxError("invalid date");

    mask = String(dF.masks[mask] || mask || dF.masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }

    var	_ = utc ? "getUTC" : "get",
      d = date[_ + "Date"](),
      D = date[_ + "Day"](),
      m = date[_ + "Month"](),
      y = date[_ + "FullYear"](),
      H = date[_ + "Hours"](),
      M = date[_ + "Minutes"](),
      s = date[_ + "Seconds"](),
      L = date[_ + "Milliseconds"](),
      o = utc ? 0 : date.getTimezoneOffset(),
      flags = {
        d:    d,
        dd:   pad(d),
        ddd:  dF.i18n.dayNames[D],
        dddd: dF.i18n.dayNames[D + 7],
        m:    m + 1,
        mm:   pad(m + 1),
        mmm:  dF.i18n.monthNames[m],
        mmmm: dF.i18n.monthNames[m + 12],
        yy:   String(y).slice(2),
        yyyy: y,
        h:    H % 12 || 12,
        hh:   pad(H % 12 || 12),
        H:    H,
        HH:   pad(H),
        M:    M,
        MM:   pad(M),
        s:    s,
        ss:   pad(s),
        l:    pad(L, 3),
        L:    pad(L > 99 ? Math.round(L / 10) : L),
        t:    H < 12 ? "a"  : "p",
        tt:   H < 12 ? "am" : "pm",
        T:    H < 12 ? "A"  : "P",
        TT:   H < 12 ? "AM" : "PM",
        Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
        o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
      };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  };
}();

// Some common format strings
dateFormat.masks = {
  "default":      "ddd mmm dd yyyy HH:MM:ss",
  shortDate:      "m/d/yy",
  mediumDate:     "mmm d, yyyy",
  longDate:       "mmmm d, yyyy",
  fullDate:       "dddd, mmmm d, yyyy",
  shortTime:      "h:MM TT",
  mediumTime:     "h:MM:ss TT",
  longTime:       "h:MM:ss TT Z",
  isoDate:        "yyyy-mm-dd",
  isoTime:        "HH:MM:ss",
  isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
  dayNames: [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  monthNames: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
  return dateFormat(this, mask, utc);
};

function isString() {
  if (typeof arguments[0] == 'string')
    return true;
  if (typeof arguments[0] == 'object')
  {
    var criterion = arguments[0].constructor.toString().match(/string/i);
    return (criterion != null);
  }
  return false;
}

function parsePostGreSQL(timestamp)
{
 if (isString(timestamp))
  {
    var regex = new RegExp("^([\\d]{4})-([\\d]{2})-([\\d]{2}) ([\\d]{2}):([\\d]{2}):([\\d]{2})(\\.(\\d+))?([\\+\\-])([\\d]{2})(:([\\d]{2}))?$");
    var matches = regex.exec(timestamp);
    if(matches != null)
    {
      var offset = parseInt(matches[10], 10) * 60 + (matches[12] ? parseInt(matches[12], 10) : 0);
      if(matches[9] == "-")
        offset = -offset;

      return new Date(
        Date.UTC(
          parseInt(matches[1], 10),
          parseInt(matches[2], 10) - 1,
          parseInt(matches[3], 10),
          parseInt(matches[4], 10),
          parseInt(matches[5], 10),
          parseInt(matches[6], 10),
          matches[8] ? parseInt(matches[8], 10) : 0
        ) - offset*60*1000
      );
    }
  }

  return null;
}

function roundNumber(num, dec) {
  var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
  return result;
}
function convertToPercent(fraction) {
  return (fraction * 100) ;
}

function mysqlTimeStampToDate(timestamp) {
  //function parses mysql datetime string and returns javascript Date object
  //input has to be in this format: 2007-06-05 15:26:02+02
  var regex=/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?([+-][0-9]+)?$/;
  var parts=timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');
  return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
}



function logout() {


  $( "#dialog:ui-dialog" ).dialog( "destroy" );

  $( "#dialog-logout" ).dialog({
    resizable: false,
    height:150,
    modal: true,
    buttons: {
      "Logout": function() {
        window.location = "/game/logout";
        /*
         $.ajax({
         url: 'logout',
         dataType: 'json',
         cache: false,
         success: function(rdata) {
         if(rdata.success == true)
         {
         $( this ).dialog( "close" );
         window.location = "/game/";
         }
         else
         {
         alert('logout failed');
         }
         }
         });

         */

      },
      Cancel: function() {
        $( this ).dialog( "close" );
      }
    }
  });


  return false;
}

