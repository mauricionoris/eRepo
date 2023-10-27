/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function(){
        var inf = JSON.parse($("#inf").val());
      
        //console.log(inf);
     
        if (inf.show_modal) {
            $("#myModal3").modal({backdrop: "static"});
            loadobject(getobject(0));    
        }
        
        $('#previous').click(function(){
            var c = getcurrentobject();
            loadobject(getobject(--c));  
        });

        $('#next').click(function(){
            var c = getcurrentobject();
            loadobject(getobject(++c));  
        });

        function getcurrentobject() {
            return $("#currentitem").val();
        }

        function getobject(item) {
            //alert(item);
            var obj = inf.objects.filter( function(i) { return i.order === item;});
            $("#currentitem").val(item);
            return obj[0].url;
        }
    
    
        function loadobject(url) {
            var options = {
  //              width: "600px",
  //              height: "400px",
                pdfOpenParams: { view: 'FitV', page: '1' }
            };
            PDFObject.embed(url,'#div_object',options); 
   
//            $("loading").fadeOut(250,function() {
//            });            
            
        }
        
        $('#return').click(function(){
            returnTo();
	});
        
        $('#returnModal').click(function(){
            returnTo();
	});

        $('#save').click(function(){
                $('#frm_subject').submit();
	});
    
         
            
  

        function returnTo() {
            window.location = inf.launch_presentation_return_url;
            return false;
        }
});