

$(document).ready(function(){
    $( "#submitButton" ).click(function(  ) {
              
        $("#oauth_nonce").val(Date.now() + Math.random() * 100);
        $("#oauth_timestamp").val(Math.round(Date.now() / 1000));
        
        var paramString = {};
        $.each($('#ltiLaunchForm').serializeArray(), function(i,obj) { paramString[obj.name] = obj.value; });
   
        var encUrl = getUrl($('#ltiLaunchForm')) + '&' + percentEncode(cleanParams(paramString));
        
        $("#oauth_signature").val(CryptoJS.HmacSHA1(encUrl, 'supersecret&').toString(CryptoJS.enc.Base64));
        $('#ltiLaunchForm').submit();
        
    });
});

function getUrl(f) {

   var out = []; 
   out.push(f.prop('method').toUpperCase()); 
   out.push(percentEncode(f.prop('action'))); 
   return out.join('&');
};

function percentEncode(str) { return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, '%2A'); };

function  encodeParam(key, val) { return key + "=" + percentEncode(val); };

function cleanParams(params) {
    var i, key, len, val, vals, out = [];
    if (typeof params !== 'object') {
      return;
    }
    for (key in params) {
      vals = params[key];
      if (key === 'oauth_signature') {
        continue;
      }
      if (Array.isArray(vals) === true) {
        for (i = 0, len = vals.length; i < len; i++) {
          val = vals[i];
          out.push(encodeParam(key, val));
        }
      } else {
        out.push(encodeParam(key, vals));
      }
    }
    
    var ret = out.sort().join('&');
    
    return ret;
};

