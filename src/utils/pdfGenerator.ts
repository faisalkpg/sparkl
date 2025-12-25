import { GeneratedWorksheet } from "@/types/worksheet";

export async function generateQuestionPaperPDF(worksheet: GeneratedWorksheet): Promise<void> {
  const { config, questions } = worksheet;
  
  // Create a printable HTML content
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${config.subject} Worksheet - ${config.grade}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Plus Jakarta Sans', Arial, sans-serif;
          font-size: 12pt;
          line-height: 1.6;
          color: #1a1a2e;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          border-bottom: 2px solid #4361ee;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .school-name {
          font-size: 10pt;
          color: #666;
          margin-bottom: 10px;
          border: 1px dashed #ccc;
          padding: 8px;
          display: inline-block;
        }
        
        .title {
          font-size: 18pt;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .meta {
          display: flex;
          justify-content: center;
          gap: 20px;
          font-size: 10pt;
          color: #666;
        }
        
        .instructions {
          background: #f8f9fa;
          border-left: 4px solid #4361ee;
          padding: 15px;
          margin-bottom: 30px;
          font-size: 10pt;
        }
        
        .instructions strong {
          display: block;
          margin-bottom: 8px;
        }
        
        .instructions ul {
          margin-left: 20px;
        }
        
        .question {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        
        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        
        .question-text {
          flex: 1;
        }
        
        .question-number {
          font-weight: 700;
        }
        
        .marks {
          background: #e8eaf6;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 9pt;
          white-space: nowrap;
        }
        
        .answer-space {
          border-bottom: 1px solid #ddd;
          height: 60px;
          margin-top: 15px;
        }
        
        .answer-space.long {
          height: 120px;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          
          .question {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-name">[School Name]</div>
        <h1 class="title">${config.subject} Worksheet</h1>
        <div class="meta">
          <span>${config.grade}</span>
          <span>•</span>
          <span>Max Marks: ${config.totalMarks}</span>
          <span>•</span>
          <span>Time: ${Math.ceil(config.totalMarks * 1.5)} mins</span>
        </div>
      </div>
      
      <div class="instructions">
        <strong>Instructions:</strong>
        <ul>
          <li>Read all questions carefully before answering.</li>
          <li>Write your answers in the space provided.</li>
          <li>Marks for each question are indicated on the right.</li>
        </ul>
      </div>
      
      ${questions.map(q => `
        <div class="question">
          <div class="question-header">
            <div class="question-text">
              <span class="question-number">Q${q.questionNumber}.</span> ${q.questionText}
            </div>
            <span class="marks">[${q.marks} marks]</span>
          </div>
          <div class="answer-space ${q.marks >= 4 ? 'long' : ''}"></div>
        </div>
      `).join('')}
    </body>
    </html>
  `;
  
  // Open in new window for printing/saving
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
}

export async function generateAnswerKeyPDF(worksheet: GeneratedWorksheet): Promise<void> {
  const { config, questions } = worksheet;
  
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Answer Key - ${config.subject} - ${config.grade}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Plus Jakarta Sans', Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.6;
          color: #1a1a2e;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          border-bottom: 2px solid #22c55e;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .answer-key-badge {
          display: inline-block;
          background: #dcfce7;
          color: #16a34a;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 10pt;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .title {
          font-size: 16pt;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .meta {
          display: flex;
          justify-content: center;
          gap: 20px;
          font-size: 10pt;
          color: #666;
        }
        
        .question {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          page-break-inside: avoid;
        }
        
        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        
        .question-text {
          flex: 1;
          font-size: 10pt;
          color: #666;
        }
        
        .question-number {
          font-weight: 700;
        }
        
        .marks {
          background: #e8eaf6;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 9pt;
          white-space: nowrap;
        }
        
        .answer {
          background: #dcfce7;
          border-left: 4px solid #22c55e;
          padding: 12px;
          margin-top: 10px;
        }
        
        .answer-label {
          font-weight: 700;
          color: #16a34a;
          margin-bottom: 5px;
        }
        
        .solution {
          margin-top: 10px;
          padding: 10px;
          background: #f0f9ff;
          border-left: 4px solid #0ea5e9;
          font-size: 10pt;
        }
        
        .solution-label {
          font-weight: 600;
          color: #0284c7;
          margin-bottom: 5px;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          
          .question {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="answer-key-badge">📝 ANSWER KEY</div>
        <h1 class="title">${config.subject} Worksheet</h1>
        <div class="meta">
          <span>${config.grade}</span>
          <span>•</span>
          <span>Max Marks: ${config.totalMarks}</span>
        </div>
      </div>
      
      ${questions.map(q => `
        <div class="question">
          <div class="question-header">
            <div class="question-text">
              <span class="question-number">Q${q.questionNumber}.</span> ${q.questionText}
            </div>
            <span class="marks">[${q.marks} marks]</span>
          </div>
          <div class="answer">
            <div class="answer-label">Answer:</div>
            ${q.answer}
          </div>
          ${q.solution ? `
            <div class="solution">
              <div class="solution-label">Solution:</div>
              ${q.solution}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
}

export async function downloadBothPDFs(worksheet: GeneratedWorksheet): Promise<void> {
  // For a real implementation, we'd generate actual PDF files
  // For now, we'll open both in print dialogs
  await generateQuestionPaperPDF(worksheet);
  
  // Small delay before opening second window
  setTimeout(async () => {
    await generateAnswerKeyPDF(worksheet);
  }, 500);
}
