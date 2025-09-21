document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
});

// Bloquear copiar con Ctrl+C
document.addEventListener("copy", function(e) {
    e.preventDefault();
});

document.getElementById("download").addEventListener("click", async () => {
    const button = document.getElementById("download");
    const originalText = button.innerHTML;
    const notification = document.getElementById("notification");
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando PDF...';
    notification.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando PDF, por favor espere...';
    notification.style.background = "#2196F3";
    notification.classList.add("show");

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4"); // orientación vertical A4
        const pages = document.querySelectorAll(".page"); // todas las páginas del CV

        for (let i = 0; i < pages.length; i++) {
            const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL("image/png", 1.0);

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

            // Agregar una nueva página si NO es la última
            if (i < pages.length - 1) {
                pdf.addPage();
            }
        }

        pdf.save("CV_Juan_Manuel_Choque_Nolasco.pdf");

        notification.innerHTML = '<i class="fas fa-check-circle"></i> CV descargado con éxito';
        notification.style.background = "#4CAF50";

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        notification.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error al generar el PDF';
        notification.style.background = "#F44336";
    } finally {
        button.disabled = false;
        button.innerHTML = originalText;
        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }
});
