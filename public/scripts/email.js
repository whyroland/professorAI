$(document).ready(function(){
    $("#email").submit(function(event){
        event.preventDefault()
        var id=$("#address").val()
        var content = $("#transcript-text").val()
        sendEmail(id,content)
    })
    
    function sendEmail(emailID, content) { 
        Email.send({ 
          Host: "smtp.gmail.com", 
          Username: "palaryancs@gmail.com", 
          Password: "bsduagjynwxtwpuc", 
          To: emailID, 
          From: "palaryancs@gmail.com", 
          Subject: "Your personalized study notes from ProfessorAI", 
          Body: content, 
        }) 
          .then(function (message) { 
            alert("Check your inbox for your personalized notes!") 
          }); 
      } 

    
})