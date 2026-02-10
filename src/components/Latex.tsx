
import React from 'react';
import katex from 'katex';

interface LatexProps {
  content: string;
  className?: string;
}

const Latex: React.FC<LatexProps> = ({ content, className = "" }) => {
  if (!content) return null;

  // Xử lý tiền kỳ dữ liệu từ AI:
  // 1. Chuyển đổi các chuỗi gạch chéo kép dư thừa do escape JSON (ví dụ \\frac -> \frac)
  // 2. Chuyển đổi \n (dạng text) thành ký tự xuống dòng thực tế
  let processedContent = content
    .replace(/\\\\(\w)/g, '\\$1') // Sửa lỗi double backslash cho các command (vd: \\frac -> \frac)
    .replace(/\\\\([{}])/g, '\\$1') // Sửa lỗi cho các ký tự ngoặc
    .replace(/\\\\ /g, '\\ ')      // Sửa lỗi cho khoảng trắng
    .replace(/\\n/g, '\n');            // Chuyển ký tự xuống dòng text thành \n

  // Tách nội dung dựa trên các delimiter $...$ và $$...$$
  // Sử dụng regex với flag 's' (dotAll) để khớp công thức trên nhiều dòng
  const parts = processedContent.split(/(\$\$.*?\$\$|\$.*?\$)/gs);

  return (
    <span className={`latex-renderer ${className}`}>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const formula = part.slice(2, -2);
          try {
            const html = katex.renderToString(formula, {
              displayMode: true,
              throwOnError: false,
              output: 'html'
            });
            return (
              <span
                key={index}
                className="block my-2 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return <span key={index} className="text-red-500">{part}</span>;
          }
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1);
          try {
            const html = katex.renderToString(formula, {
              displayMode: false,
              throwOnError: false,
              output: 'html'
            });
            return (
              <span
                key={index}
                className="inline-block px-0.5"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return <span key={index} className="text-red-500">{part}</span>;
          }
        }

        // Xử lý text thuần: giữ nguyên khoảng trắng và hỗ trợ xuống dòng <br/>
        return (
          <React.Fragment key={index}>
            {part.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < part.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      })}
    </span>
  );
};

export default Latex;
