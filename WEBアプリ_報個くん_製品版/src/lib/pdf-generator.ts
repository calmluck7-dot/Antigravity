import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (elementId: string, fileName: string = "document.pdf") => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element not found: ${elementId}`);
        return;
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // High resolution
            useCORS: true,
            logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4",
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(fileName);
    } catch (error) {
        console.error("PDF generation failed", error);
        alert("PDF作成に失敗しました");
    }
};
