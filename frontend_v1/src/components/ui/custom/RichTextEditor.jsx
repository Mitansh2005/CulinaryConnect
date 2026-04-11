import { useState, useRef, useEffect } from 'react';

export function RichTextEditor({ value, onChange, placeholder = "Write your bio..." }) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateToolbarState();
  };

  const updateToolbarState = () => {
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
  };

  const handleInput = () => {
    const content = editorRef.current?.innerHTML || '';
    onChange(content);
    updateToolbarState();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const buttonClass = (isActive) =>
    `p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
      isActive ? 'bg-gray-200 dark:bg-gray-600 text-primary' : 'text-gray-600 dark:text-gray-400'
    }`;

  return (
    <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className={buttonClass(isBold)}
          title="Bold"
        >
          <span className="material-symbols-outlined text-[20px]">format_bold</span>
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className={buttonClass(isItalic)}
          title="Italic"
        >
          <span className="material-symbols-outlined text-[20px]">format_italic</span>
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() => handleFormat('insertUnorderedList')}
          className={buttonClass(false)}
          title="Bullet List"
        >
          <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
        </button>
        <button
          type="button"
          onClick={() => handleFormat('insertOrderedList')}
          className={buttonClass(false)}
          title="Numbered List"
        >
          <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onMouseUp={updateToolbarState}
        onKeyUp={updateToolbarState}
        className="min-h-[200px] max-h-[400px] overflow-y-auto p-4 text-gray-900 dark:text-white focus:outline-none prose prose-sm max-w-none dark:prose-invert"
        data-placeholder={placeholder}
        style={{
          '--placeholder-text': `"${placeholder}"`,
        }}
      />
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgb(156, 163, 175);
          pointer-events: none;
          position: absolute;
        }
      `}</style>
    </div>
  );
}
