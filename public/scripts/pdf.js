document.getElementById("generatePDF").addEventListener("click", function() {
    var doc = new jsPDF();

    var elementHTML = $('#yt-transcript-text').html();
    console.log(elementHTML);
    doc.fromHTML(elementHTML, 15, 15, {
        'width': 170,
    });

    // Save the PDF
    timestamp = new Date().getTime().toString();
    doc.save('transcript' + timestamp + '.pdf');
});