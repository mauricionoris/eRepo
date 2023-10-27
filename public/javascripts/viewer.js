/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function GotPDF(data)
{
    // Here, data contains "%PDF-1.4 ..." etc.
    alert('here');
    var datauri = 'data:application/pdf;base64,' + Base64.encode(data);
    var win = window.open("", "Your PDF", "width=1024,height=768,resizable=yes,scrollbars=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no");
    win.document.location.href = datauri;
    
    
}