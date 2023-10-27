/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function(){
        var inf = JSON.parse($("#inf").val());
      
        //console.log(inf);
        showDescription(inf.selected_subject_id);
    
        if (inf.show_modal) {
            $("#myModal3").modal({backdrop: "static"});
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
    
         $('#listSubjects').on('focus', function () {
            // Store the current value on focus and on change
            previous = this.value;
        }).change(function() {
                showDescription(this.value);
        });
            
        function showDescription(id) {
            var item = inf.subjects.filter( function(i) { return i.subject_id===id;});
            $('#detail_show').html("<span>" +  ((typeof item[0] === 'undefined') ? '' : item[0].description)  + "</span>");
            inf.selected_subject_id = id;            
        }

        function returnTo() {
            window.location = inf.launch_presentation_return_url;
            return false;
        }
});

