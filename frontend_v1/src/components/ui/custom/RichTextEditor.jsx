import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

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
    `flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
      isActive 
        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' 
        : 'text-text-sub-light hover:bg-stone-200/50 hover:text-text-main-light dark:text-text-sub-dark dark:hover:bg-white/10 dark:hover:text-text-main-dark'
    }`;

  return (
    <div className="overflow-hidden rounded-[1.2rem] border border-stone-200 bg-stone-50/50 shadow-sm transition-colors focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-1 border-b border-stone-200/80 bg-white/60 p-2 dark:border-white/10 dark:bg-black/20">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className={buttonClass(isBold)}
          title="Bold"
        >
          <Bold className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className={buttonClass(isItalic)}
          title="Italic"
        >
          <Italic className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <div className="mx-1 h-5 w-px bg-border-light/60 dark:bg-border-dark/60"></div>
        <button
          type="button"
          onClick={() => handleFormat('insertUnorderedList')}
          className={buttonClass(false)}
          title="Bullet List"
        >
          <List className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('insertOrderedList')}
          className={buttonClass(false)}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onMouseUp={updateToolbarState}
        onKeyUp={updateToolbarState}
        className="prose prose-sm max-w-none p-4 min-h-[160px] max-h-[400px] overflow-y-auto outline-none dark:prose-invert text-text-main-light dark:text-text-main-dark selection:bg-primary/20"
        data-placeholder={placeholder}
        style={{
          '--placeholder-text': `"${placeholder}"`,
        }}
      />
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgb(168, 162, 158); /* stone-400 equivalent */
          pointer-events: none;
          position: absolute;
        }
        .dark [contenteditable]:empty:before {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
