"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered } from "lucide-react";

type TiptapEditorProps = {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyleKit.configure({
        color: { types: ['textStyle'] },
        fontFamily: { types: ['textStyle'] },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-pink max-w-none focus:outline-none min-h-[150px] p-4 bg-white border-t-2 border-dashed border-[var(--color-secondary)]/50 rounded-b-xl text-[var(--color-text-body)]",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border-2 border-dashed border-[var(--color-secondary)] rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-[var(--color-primary)] transition-colors">
      <div className="flex flex-wrap items-center gap-1 p-3 bg-[var(--color-bg-paper)]">
        {/* Formatting */}
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          className={`p-2 rounded-lg transition-colors ${editor.isActive("bold") ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-body)] hover:bg-[var(--color-secondary)]/30"}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          className={`p-2 rounded-lg transition-colors ${editor.isActive("italic") ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-body)] hover:bg-[var(--color-secondary)]/30"}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-[var(--color-secondary)] mx-1" />

        {/* Alignment */}
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("left").run(); }}
          className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-body)] hover:bg-[var(--color-secondary)]/30"}`}
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("center").run(); }}
          className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-body)] hover:bg-[var(--color-secondary)]/30"}`}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("right").run(); }}
          className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-body)] hover:bg-[var(--color-secondary)]/30"}`}
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("justify").run(); }}
          className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: "justify" }) ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-body)] hover:bg-[var(--color-secondary)]/30"}`}
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-[var(--color-secondary)] mx-1" />

        {/* Lists */}
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          className={`p-2 rounded-lg transition-colors ${editor.isActive("bulletList") ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-body)] hover:bg-[var(--color-secondary)]/30"}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
          className={`p-2 rounded-lg transition-colors ${editor.isActive("orderedList") ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-body)] hover:bg-[var(--color-secondary)]/30"}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-[var(--color-secondary)] mx-1" />

        {/* Fonts */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontFamily(e.target.value).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          className="text-sm font-bold text-[var(--color-text-body)] border-2 border-dashed border-[var(--color-secondary)] rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[var(--color-primary)]"
        >
          <option value="">Default Font</option>
          <option value="var(--font-nunito)">Nunito</option>
          <option value="var(--font-fredoka)">Fredoka</option>
        </select>

        {/* Color */}
        <input
          type="color"
          onInput={(event) => {
            editor.chain().focus().setColor((event.target as HTMLInputElement).value).run();
          }}
          value={editor.getAttributes('textStyle').color || '#6B4C3B'}
          className="w-9 h-9 p-0 border-0 rounded cursor-pointer bg-transparent"
        />
      </div>
      
      <EditorContent editor={editor} />
    </div>
  );
}
