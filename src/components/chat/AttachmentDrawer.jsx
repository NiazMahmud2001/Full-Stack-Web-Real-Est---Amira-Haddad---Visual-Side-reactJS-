import React from "react";
import { Mic, Upload } from "lucide-react";

export default function AttachmentDrawer({ open }) {
  if (!open) return null;
  return (
    <div className="absolute bottom-16 left-3 z-20 w-52 rounded-2xl border border-ink/10 bg-sand-light p-3 shadow-lift">
      <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-mute transition-colors hover:bg-sage hover:text-ink">
        <Mic className="w-4 h-4" /> Voice note
      </button>
      <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-mute transition-colors hover:bg-sage hover:text-ink">
        <Upload className="w-4 h-4" /> Upload requirement
      </button>
    </div>
  );
}
