"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

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
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[150px] p-4 bg-white/50 border border-slate-200 rounded-b-lg",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
        {/* Formatting */}
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          className={`p-1.5 rounded ${editor.isActive("bold") ? "bg-slate-200" : "hover:bg-slate-200"}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          className={`p-1.5 rounded ${editor.isActive("italic") ? "bg-slate-200" : "hover:bg-slate-200"}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-300 mx-1" />

        {/* Alignment */}
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("left").run(); }}
          className={`p-1.5 rounded ${editor.isActive({ textAlign: "left" }) ? "bg-slate-200" : "hover:bg-slate-200"}`}
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("center").run(); }}
          className={`p-1.5 rounded ${editor.isActive({ textAlign: "center" }) ? "bg-slate-200" : "hover:bg-slate-200"}`}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("right").run(); }}
          className={`p-1.5 rounded ${editor.isActive({ textAlign: "right" }) ? "bg-slate-200" : "hover:bg-slate-200"}`}
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("justify").run(); }}
          className={`p-1.5 rounded ${editor.isActive({ textAlign: "justify" }) ? "bg-slate-200" : "hover:bg-slate-200"}`}
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-300 mx-1" />

        {/* Fonts */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontFamily(e.target.value).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          className="text-sm border border-slate-200 rounded px-2 py-1 bg-white"
        >
          <option value="">Default Font</option>
          <option value="var(--font-inter)">Inter</option>
          <option value="var(--font-caveat)">Caveat</option>
        </select>

        {/* Color */}
        <input
          type="color"
          onInput={(event) => {
            editor.chain().focus().setColor((event.target as HTMLInputElement).value).run();
          }}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
        />
      </div>
      
      <EditorContent editor={editor} />
    </div>
  );
}
