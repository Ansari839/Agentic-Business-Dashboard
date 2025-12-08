import PDFDocument from "pdfkit";

export function generatePDF(data: any[], fields: string[], title: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 30 });
        const buffers: Buffer[] = [];

        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", (err) => reject(err));

        // Header
        doc.fontSize(18).text(title, { align: "center" });
        doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: "center" });
        doc.moveDown();

        // Table Constants
        const startX = 30;
        let startY = doc.y;
        const colWidth = (doc.page.width - 60) / fields.length;

        // Draw Table Header
        doc.font("Helvetica-Bold");
        fields.forEach((field, i) => {
            doc.text(field.toUpperCase(), startX + i * colWidth, startY, {
                width: colWidth,
                align: "left",
            });
        });

        startY += 20;
        doc.moveTo(startX, startY - 5).lineTo(doc.page.width - 30, startY - 5).stroke();

        // Draw Rows
        doc.font("Helvetica");
        data.forEach((row) => {
            if (startY > doc.page.height - 50) {
                doc.addPage();
                startY = 30;
            }

            fields.forEach((field, i) => {
                const value = row[field] !== undefined && row[field] !== null ? String(row[field]) : "";
                doc.text(value, startX + i * colWidth, startY, {
                    width: colWidth,
                    align: "left",
                });
            });
            startY += 20;
        });

        doc.end();
    });
}
