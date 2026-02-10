
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, BorderStyle, WidthType, VerticalAlign } from 'docx';
import saveAs from 'file-saver';
import { ExamData, SpecRow } from '../types';

/**
 * Giữ nguyên định dạng LaTeX trong Word theo yêu cầu người dùng.
 * Chỉ xử lý ký tự xuống dòng để đảm bảo cấu trúc văn bản.
 */
const formatText = (text: string): string => {
  if (!text) return "";
  return text.replace(/\\\\/g, '\n');
};

const DEFAULT_FONT = "Times New Roman";
const DEFAULT_SIZE = 26; // docx sử dụng half-points: 13pt * 2 = 26
const CM_TO_TWIP = 566.9; // 1cm = 566.9 twips

export const exportToWord = async (examData: ExamData) => {
  const { metadata, matrix_data, specification_data, exam_content, answer_key } = examData;

  const createCommonHeader = (sectionTitle: string, isAnswerKey = false) => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "THCS THỊ TRẤN GIA LỘC", bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "________________", bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 0 }, children: [new TextRun({ text: "MÃ ĐỀ: 101", bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT, border: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } })] }),
              ],
            }),
            new TableCell({
              width: { size: 55, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: isAnswerKey ? "HƯỚNG DẪN CHẤM" : "ĐỀ KIỂM TRA ĐỊNH KỲ", bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: isAnswerKey ? sectionTitle : `NĂM HỌC: 2025 – 2026`, bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: `MÔN: ${metadata.subject.toUpperCase()} – LỚP ${metadata.grade}`, bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: `Thời gian làm bài: ${metadata.time} phút`, size: DEFAULT_SIZE, italics: true, font: DEFAULT_FONT })] }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  const createCell = (text: string, bold = false, alignment: any = AlignmentType.CENTER, rowSpan = 1, colSpan = 1) => {
    return new TableCell({
      verticalAlign: VerticalAlign.CENTER,
      rowSpan,
      columnSpan: colSpan,
      children: [new Paragraph({
        alignment,
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: formatText(text), bold, font: DEFAULT_FONT, size: DEFAULT_SIZE })]
      })]
    });
  };

  const sections: any[] = [];

  // 1. MA TRẬN
  if (metadata.exam_type !== 'Đề thường xuyên' && matrix_data && matrix_data.length > 0) {
    const totals = matrix_data.reduce((acc, row) => ({
      mc: { nb: acc.mc.nb + (row.mc?.nb || 0), th: acc.mc.th + (row.mc?.th || 0), vd: acc.mc.vd + (row.mc?.vd || 0) },
      tf: { nb: acc.tf.nb + (row.tf?.nb || 0), th: acc.tf.th + (row.tf?.th || 0), vd: acc.tf.vd + (row.tf?.vd || 0) },
      sa: { nb: acc.sa.nb + (row.sa?.nb || 0), th: acc.sa.th + (row.sa?.th || 0), vd: acc.sa.vd + (row.sa?.vd || 0) },
      es: { nb: acc.es.nb + (row.es?.nb || 0), th: acc.es.th + (row.es?.th || 0), vd: acc.es.vd + (row.es?.vd || 0) },
      summary: { nb: acc.summary.nb + (row.summary?.nb || 0), th: acc.summary.th + (row.summary?.nb || 0), vd: acc.summary.vd + (row.summary?.vd || 0) },
      percent: acc.percent + (row.percent || 0)
    }), {
      mc: { nb: 0, th: 0, vd: 0 }, tf: { nb: 0, th: 0, vd: 0 }, sa: { nb: 0, th: 0, vd: 0 },
      es: { nb: 0, th: 0, vd: 0 }, summary: { nb: 0, th: 0, vd: 0 }, percent: 0
    });

    const matrixChildren: any[] = [
      createCommonHeader("MA TRẬN ĐỀ KIỂM TRA"),
      new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: "I. MA TRẬN ĐỀ KIỂM TRA", bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }),
    ];

    const matrixTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createCell("TT", true, AlignmentType.CENTER, 3),
            createCell("Chủ đề/ Chương", true, AlignmentType.CENTER, 3),
            createCell("Nội dung/ đơn vị kiến thức", true, AlignmentType.CENTER, 3),
            createCell("Mức độ đánh giá", true, AlignmentType.CENTER, 1, 12),
            createCell("Tổng", true, AlignmentType.CENTER, 2, 3),
            createCell("Tỉ lệ %", true, AlignmentType.CENTER, 3),
          ]
        }),
        new TableRow({
          children: [
            createCell("TNKQ", true, AlignmentType.CENTER, 1, 9),
            createCell("Tự luận", true, AlignmentType.CENTER, 1, 3),
          ]
        }),
        new TableRow({
          children: [
            createCell("Nhiều lựa chọn", true, AlignmentType.CENTER, 1, 3),
            createCell("Đúng-Sai", true, AlignmentType.CENTER, 1, 3),
            createCell("Trả lời ngắn", true, AlignmentType.CENTER, 1, 3),
            createCell("Biết", true), createCell("Hiểu", true), createCell("VD", true),
            createCell("Biết", true), createCell("Hiểu", true), createCell("VD", true),
          ]
        }),
        new TableRow({
          children: [
            createCell(""), createCell(""), createCell(""),
            createCell("NB"), createCell("TH"), createCell("VD"),
            createCell("NB"), createCell("TH"), createCell("VD"),
            createCell("NB"), createCell("TH"), createCell("VD"),
            createCell("NB"), createCell("TH"), createCell("VD"),
            createCell("NB"), createCell("TH"), createCell("VD"),
            createCell(""),
          ]
        }),
        ...matrix_data.map((row, i) => new TableRow({
          children: [
            createCell((i + 1).toString()),
            createCell(formatText(row.topic), true, AlignmentType.LEFT),
            createCell(formatText(row.knowledge_block), false, AlignmentType.LEFT),
            createCell((row.mc?.nb || "").toString()), createCell((row.mc?.th || "").toString()), createCell((row.mc?.vd || "").toString()),
            createCell((row.tf?.nb || "").toString()), createCell((row.tf?.th || "").toString()), createCell((row.tf?.vd || "").toString()),
            createCell((row.sa?.nb || "").toString()), createCell((row.sa?.th || "").toString()), createCell((row.sa?.vd || "").toString()),
            createCell((row.es?.nb || "").toString()), createCell((row.es?.th || "").toString()), createCell((row.es?.vd || "").toString()),
            createCell((row.summary?.nb || "").toString(), true), createCell((row.summary?.th || "").toString(), true), createCell((row.summary?.vd || "").toString(), true),
            createCell(row.percent + "%", true),
          ]
        })),
        new TableRow({
          children: [
            createCell("Tổng", true, AlignmentType.CENTER, 1, 3),
            createCell(totals.mc.nb.toString(), true), createCell(totals.mc.th.toString(), true), createCell(totals.mc.vd.toString(), true),
            createCell(totals.tf.nb.toString(), true), createCell(totals.tf.th.toString(), true), createCell(totals.tf.vd.toString(), true),
            createCell(totals.sa.nb.toString(), true), createCell(totals.sa.th.toString(), true), createCell(totals.sa.vd.toString(), true),
            createCell(totals.es.nb.toString(), true), createCell(totals.es.th.toString(), true), createCell(totals.es.vd.toString(), true),
            createCell(totals.summary.nb.toString(), true), createCell(totals.summary.th.toString(), true), createCell(totals.summary.vd.toString(), true),
            createCell("100%", true),
          ]
        })
      ]
    });
    matrixChildren.push(matrixTable);
    sections.push({ children: matrixChildren });
  }

  // 2. ĐẶC TẢ
  if (specification_data && specification_data.length > 0) {
    const specChildren: any[] = [
      new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: "II. BẢN ĐẶC TẢ ĐỀ KIỂM TRA", bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }),
    ];

    const getFormattedQ = (row: SpecRow) => {
      const qList = [
        row.questions.mc?.nb, row.questions.mc?.th, row.questions.mc?.vd,
        row.questions.tf?.nb, row.questions.tf?.th, row.questions.tf?.vd,
        row.questions.sa?.nb, row.questions.sa?.th, row.questions.sa?.vd,
        row.questions.es?.nb, row.questions.es?.th, row.questions.es?.vd
      ].filter(Boolean);
      if (qList.length === 0) return "-";
      return qList.map(q => `${q} (${row.competency || 'TDLL'})`).join(", ");
    };

    const specTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createCell("TT", true),
            createCell("Chủ đề/ Chương", true),
            createCell("Nội dung", true),
            createCell("Yêu cầu cần đạt", true),
            createCell("Số câu hỏi & Năng lực", true),
          ]
        }),
        ...specification_data.map(row => new TableRow({
          children: [
            createCell(row.stt.toString()),
            createCell(formatText(row.topic), true, AlignmentType.LEFT),
            createCell(formatText(row.knowledge), false, AlignmentType.LEFT),
            createCell(formatText(row.criteria), false, AlignmentType.JUSTIFIED),
            createCell(getFormattedQ(row), true),
          ]
        }))
      ]
    });
    specChildren.push(specTable);
    sections.push({ children: specChildren });
  }

  // 3. ĐỀ THI
  const examChildren: any[] = [
    createCommonHeader("ĐỀ KIỂM TRA CHÍNH THỨC"),
    new Paragraph({ spacing: { before: 240, after: 0 }, children: [new TextRun({ text: "I. PHẦN TRẮC NGHIỆM (7,0 ĐIỂM)", bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }),
  ];

  if (exam_content.part_1 && exam_content.part_1.length > 0) {
    examChildren.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 120, after: 0 }, children: [new TextRun({ text: "Phần 1. Câu trắc nghiệm nhiều phương án chọn", bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }));
    exam_content.part_1.forEach(q => {
      examChildren.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 120, after: 0 },
        children: [
          new TextRun({ text: `${q.id}. `, bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE }),
          new TextRun({ text: formatText(q.question), font: DEFAULT_FONT, size: DEFAULT_SIZE })
        ]
      }));

      const INDENT_VALUE = 0.5 * CM_TO_TWIP; // 0.5cm
      const TAB_SPACING = 4.5 * CM_TO_TWIP; // 4.5cm

      examChildren.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 60, after: 60 },
        indent: { left: INDENT_VALUE }, // Thụt lề A. vào 0.5cm
        tabStops: [
          { type: 'left', position: TAB_SPACING },        // Tab cho B
          { type: 'left', position: TAB_SPACING * 2 },    // Tab cho C
          { type: 'left', position: TAB_SPACING * 3 }     // Tab cho D
        ],
        children: [
          new TextRun({ text: "A. ", bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE }),
          new TextRun({ text: formatText(q.options.A), font: DEFAULT_FONT, size: DEFAULT_SIZE }),

          new TextRun({ text: "\tB. ", bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE }),
          new TextRun({ text: formatText(q.options.B), font: DEFAULT_FONT, size: DEFAULT_SIZE }),

          new TextRun({ text: "\tC. ", bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE }),
          new TextRun({ text: formatText(q.options.C), font: DEFAULT_FONT, size: DEFAULT_SIZE }),

          new TextRun({ text: "\tD. ", bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE }),
          new TextRun({ text: formatText(q.options.D), font: DEFAULT_FONT, size: DEFAULT_SIZE }),
        ]
      }));
    });
  }

  if (exam_content.part_2 && exam_content.part_2.length > 0) {
    examChildren.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 120, after: 0 }, children: [new TextRun({ text: "Phần 2. Câu trắc nghiệm Đúng/Sai", bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }));
    exam_content.part_2.forEach(q => {
      examChildren.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 120, after: 0 }, children: [new TextRun({ text: `${q.id}. `, bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE }), new TextRun({ text: formatText(q.context), font: DEFAULT_FONT, size: DEFAULT_SIZE })] }));
      q.items.forEach(it => {
        examChildren.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: `${it.label}) ${formatText(it.text)}`, font: DEFAULT_FONT, size: DEFAULT_SIZE })], indent: { left: 400 } }));
      });
    });
  }

  if (exam_content.part_3 && exam_content.part_3.length > 0) {
    examChildren.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 120, after: 0 }, children: [new TextRun({ text: "Phần 3. Câu trắc nghiệm trả lời ngắn", bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }));
    exam_content.part_3.forEach(q => {
      examChildren.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 120, after: 0 }, children: [new TextRun({ text: `${q.id}. `, bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE }), new TextRun({ text: formatText(q.question), font: DEFAULT_FONT, size: DEFAULT_SIZE })] }));
      examChildren.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "Trả lời: .........................................................", font: DEFAULT_FONT, size: DEFAULT_SIZE })], indent: { left: 400 } }));
    });
  }

  if (exam_content.essay && exam_content.essay.length > 0) {
    examChildren.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 240, after: 0 }, children: [new TextRun({ text: "II. PHẦN TỰ LUẬN (3,0 ĐIỂM)", bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }));
    exam_content.essay.forEach(q => {
      examChildren.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 120, after: 120 }, children: [new TextRun({ text: `${q.id} (${q.points}). `, bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE }), new TextRun({ text: formatText(q.question), font: DEFAULT_FONT, size: DEFAULT_SIZE })] }));
    });
  }
  sections.push({ children: examChildren });

  // 4. ĐÁP ÁN
  if (answer_key) {
    const answerChildren: any[] = [
      createCommonHeader("HƯỚNG DẪN CHẤM CHI TIẾT", true),
      new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 240, after: 0 }, children: [new TextRun({ text: "I. ĐÁP ÁN PHẦN TRẮC NGHIỆM", bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }),
    ];

    if (answer_key.part_1 && answer_key.part_1.length > 0) {
      answerChildren.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 120, after: 0 }, children: [new TextRun({ text: "1. Đáp án trắc nghiệm nhiều phương án chọn", bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE })] }));
      const p1Table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [createCell("Câu", true), ...answer_key.part_1.map(ans => createCell(ans.id))] }),
          new TableRow({ children: [createCell("Đ/A", true), ...answer_key.part_1.map(ans => createCell(ans.answer, true))] })
        ]
      });
      answerChildren.push(p1Table);
    }

    if (answer_key.part_2 && answer_key.part_2.length > 0) {
      answerChildren.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 120, after: 0 }, children: [new TextRun({ text: "2. Đáp án trắc nghiệm Đúng/Sai", bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE })] }));
      const p2Table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              createCell("Câu", true),
              createCell("Ý a", true), createCell("Ý b", true), createCell("Ý c", true), createCell("Ý d", true)
            ]
          }),
          ...answer_key.part_2.map(ans => new TableRow({
            children: [
              createCell(ans.id, true),
              ...ans.sub_answers.map(sub => createCell(sub.result, true))
            ]
          }))
        ]
      });
      answerChildren.push(p2Table);
    }

    if (answer_key.part_3 && answer_key.part_3.length > 0) {
      answerChildren.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 120, after: 0 }, children: [new TextRun({ text: "3. Đáp án trắc nghiệm trả lời ngắn (Có hướng dẫn giải)", bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE })] }));
      answer_key.part_3.forEach(ans => {
        answerChildren.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 60, after: 0 }, children: [new TextRun({ text: `${ans.id}: `, bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE }), new TextRun({ text: formatText(ans.answer), bold: true, color: "0000FF", font: DEFAULT_FONT, size: DEFAULT_SIZE })] }));
        if (ans.explanation) {
          answerChildren.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "Hướng dẫn giải chi tiết: ", italics: true, font: DEFAULT_FONT, size: DEFAULT_SIZE }), new TextRun({ text: formatText(ans.explanation), font: DEFAULT_FONT, size: DEFAULT_SIZE })], indent: { left: 400 } }));
        }
      });
    }

    if (answer_key.essay && answer_key.essay.length > 0) {
      answerChildren.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 240, after: 0 }, children: [new TextRun({ text: "II. HƯỚNG DẪN CHẤM TỰ LUẬN", bold: true, size: DEFAULT_SIZE, font: DEFAULT_FONT })] }));
      answer_key.essay.forEach(q => {
        answerChildren.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 120, after: 0 }, children: [new TextRun({ text: `${q.id} (${q.score_total})`, bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE })] }));
        const essayTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [createCell("Ý", true, AlignmentType.CENTER, 1, 1), createCell("Nội dung hướng dẫn giải chi tiết", true), createCell("Điểm", true)] }),
            ...q.steps.map(step => new TableRow({ children: [createCell(step.part_label), createCell(formatText(step.content), false, AlignmentType.LEFT), createCell(step.score)] }))
          ]
        });
        answerChildren.push(essayTable);
      });
    }
    sections.push({ children: answerChildren });
  }

  const doc = new Document({
    creator: "AI Exam Generator 2025",
    title: `Đề thi ${metadata.subject} Lớp ${metadata.grade}`,
    sections: sections.map(s => ({
      properties: {
        page: {
          margin: {
            top: 1.5 * CM_TO_TWIP,
            right: 1.5 * CM_TO_TWIP,
            bottom: 1.5 * CM_TO_TWIP,
            left: 2.5 * CM_TO_TWIP
          }
        }
      },
      children: s.children
    }))
  });

  try {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `De_Thi_AI_${metadata.subject}_Lop${metadata.grade}.docx`);
  } catch (err) {
    console.error("Lỗi tạo file Word:", err);
    alert("Có lỗi xảy ra khi tạo file Word.");
  }
};
