"use client";

import { useState } from "react";
import {
  Heading1,
  Heading2,
  AlignLeft,
  List,
  ListOrdered,
  Minus,
  Sparkles,
  ChevronDown,
  Trash2,
  Plus,
  MoveUp,
  MoveDown,
  ShieldCheck,
  Truck,
  RefreshCw,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DescriptionBlock,
  serializeDescription,
  parseDescription,
} from "@/lib/product-description";

export const FEATURE_ICONS: Array<{
  name: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}> = [
  { name: "✦", label: "Gold Star" },
  { name: "ShieldCheck", label: "Shield (warranty)", icon: ShieldCheck },
  { name: "Truck", label: "Truck (delivery)", icon: Truck },
  { name: "RefreshCw", label: "Refresh (returns)", icon: RefreshCw },
  { name: "Gem", label: "Gem (quality)" },
  { name: "Clock", label: "Clock" },
  { name: "Check", label: "Checkmark", icon: Check },
  { name: "ChevronRight", label: "Chevron", icon: ChevronRight },
  { name: "Sparkles", label: "Sparkles" },
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function ToolButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-md border px-2 py-1.5 text-[#0D0D0D] transition-colors ${
        active
          ? "border-[#C9A96E] bg-[#C9A96E]/10 text-[#0D0D0D]"
          : "border-[#E0DCD5] bg-white hover:border-[#C9A96E]"
      }`}
    >
      {children}
    </button>
  );
}

function FeatureEditor({
  block,
  onUpdate,
  onRemove,
}: {
  block: Extract<DescriptionBlock, { type: "feature" }>;
  onUpdate: (b: DescriptionBlock) => void;
  onRemove: () => void;
}) {
  const [iconOpen, setIconOpen] = useState(false);
  return (
    <div className="rounded-md border border-[#E0DCD5] bg-[#F7F4EF]/60 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Feature Block
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <input
        value={block.title}
        onChange={(e) => onUpdate({ ...block, title: e.target.value })}
        placeholder="Feature title"
        className="w-full rounded-md border border-[#E0DCD5] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none"
      />
      <div className="relative">
        <button
          type="button"
          onClick={() => setIconOpen((v) => !v)}
          className="flex items-center gap-2 rounded-md border border-[#E0DCD5] bg-white px-3 py-2 text-sm hover:border-[#C9A96E]"
        >
          <span className="text-[#C9A96E]">{block.icon}</span>
          <span className="text-gray-500 text-xs">Icon</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>
        {iconOpen && (
          <div className="absolute z-10 mt-1 w-44 rounded-md border border-[#E0DCD5] bg-white p-1 shadow-lg">
            {FEATURE_ICONS.map((ic) => (
              <button
                key={ic.name}
                type="button"
                onClick={() => {
                  onUpdate({ ...block, icon: ic.name });
                  setIconOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-[#0D0D0D] hover:bg-[#F7F4EF]"
              >
                {ic.icon ? (
                  <ic.icon className="w-4 h-4 text-[#C9A96E]" />
                ) : (
                  <span className="text-[#C9A96E]">{ic.name}</span>
                )}
                <span>{ic.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <textarea
        value={block.description}
        onChange={(e) => onUpdate({ ...block, description: e.target.value })}
        placeholder="Feature description"
        rows={2}
        className="w-full rounded-md border border-[#E0DCD5] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none"
      />
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  error,
}: RichTextEditorProps) {
  const parsed = parseDescription(value);
  const [blocks, setBlocks] = useState<DescriptionBlock[]>(
    parsed.structured ? parsed.blocks : plainTextToBlocks(parsed.plainText)
  );
  function setBlocksAndEmit(next: DescriptionBlock[]) {
    setBlocks(next);
    onChange(serializeDescription(next));
  }

  function addBlock(
    type: DescriptionBlock["type"],
    afterIndex?: number
  ) {
    const base: DescriptionBlock[] = [...blocks];
    let block: DescriptionBlock;
    switch (type) {
      case "heading":
        block = { type: "heading", text: "" };
        break;
      case "subheading":
        block = { type: "subheading", text: "" };
        break;
      case "paragraph":
        block = { type: "paragraph", text: "" };
        break;
      case "divider":
        block = { type: "divider" };
        break;
      case "list":
        block = { type: "list", ordered: false, items: [""] };
        break;
      case "feature":
        block = {
          type: "feature",
          icon: "✦",
          title: "",
          description: "",
        };
        break;
      default:
        return;
    }
    if (typeof afterIndex === "number" && afterIndex >= 0) {
      base.splice(afterIndex + 1, 0, block);
    } else {
      base.push(block);
    }
    setBlocksAndEmit(base);
  }

  function updateBlock(index: number, block: DescriptionBlock) {
    const next = [...blocks];
    next[index] = block;
    setBlocksAndEmit(next);
  }

  function updateListItem(
    blockIndex: number,
    itemIndex: number,
    val: string
  ) {
    const b = blocks[blockIndex];
    if (b.type !== "list") return;
    const items = [...b.items];
    items[itemIndex] = val;
    updateBlock(blockIndex, { ...b, items });
  }

  function removeBlock(index: number) {
    setBlocksAndEmit(blocks.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    setBlocksAndEmit(next);
  }

  function toggleListOrdered(index: number, ordered: boolean) {
    const b = blocks[index];
    if (b.type !== "list") return;
    updateBlock(index, { ...b, ordered });
  }

  function addListItem(blockIndex: number) {
    const b = blocks[blockIndex];
    if (b.type !== "list") return;
    updateBlock(blockIndex, { ...b, items: [...b.items, ""] });
  }

  function removeListItem(blockIndex: number, itemIndex: number) {
    const b = blocks[blockIndex];
    if (b.type !== "list") return;
    updateBlock(blockIndex, {
      ...b,
      items: b.items.filter((_, i) => i !== itemIndex),
    });
  }

  const plain = parsed.plainText;

  return (
    <div className="space-y-3">
      {plain !== null && plain.trim() && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Existing plain‑text description was imported as paragraphs. Add and
          edit blocks below, then save to convert it to the new rich format.
        </div>
      )}
      <div className="rounded-md border border-[#E0DCD5] bg-white">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E0DCD5] bg-[#F7F4EF]/50 p-2">
          <ToolButton onClick={() => addBlock("heading")} title="Add heading">
            <Heading1 className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            onClick={() => addBlock("subheading")}
            title="Add subheading"
          >
            <Heading2 className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            onClick={() => addBlock("paragraph")}
            title="Add paragraph"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolButton>
          <span className="mx-1 h-5 w-px bg-[#E0DCD5]" />
          <ToolButton onClick={() => addBlock("list")} title="Add bullet list">
            <List className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            onClick={() => addBlock("divider")}
            title="Add divider"
          >
            <Minus className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            onClick={() => addBlock("feature")}
            title="Add feature block"
          >
            <Sparkles className="w-4 h-4" />
          </ToolButton>
        </div>

        <div className="p-3 space-y-3">
          {blocks.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-400">
              No content yet. Use the toolbar above to add sections.
            </p>
          )}
          {blocks.map((block, i) => {
            switch (block.type) {
              case "heading":
                return (
                  <EditableRow
                    key={i}
                    index={i}
                    placeholder="Heading"
                    className="font-serif text-xl font-semibold"
                    value={block.text}
                    onChange={(v) => updateBlock(i, { ...block, text: v })}
                    onRemove={() => removeBlock(i)}
                    onMoveUp={() => moveBlock(i, -1)}
                    onMoveDown={() => moveBlock(i, 1)}
                  />
                );
              case "subheading":
                return (
                  <EditableRow
                    key={i}
                    index={i}
                    placeholder="Subheading"
                    className="font-serif text-base font-semibold"
                    value={block.text}
                    onChange={(v) => updateBlock(i, { ...block, text: v })}
                    onRemove={() => removeBlock(i)}
                    onMoveUp={() => moveBlock(i, -1)}
                    onMoveDown={() => moveBlock(i, 1)}
                  />
                );
              case "paragraph":
                return (
                  <EditableRow
                    key={i}
                    index={i}
                    placeholder="Paragraph text"
                    className="text-sm"
                    value={block.text}
                    onChange={(v) => updateBlock(i, { ...block, text: v })}
                    onRemove={() => removeBlock(i)}
                    onMoveUp={() => moveBlock(i, -1)}
                    onMoveDown={() => moveBlock(i, 1)}
                  />
                );
              case "divider":
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-md border border-[#E0DCD5] bg-[#F7F4EF]/40 px-3 py-2"
                  >
                    <span className="h-px flex-1 bg-[#C9A96E]/50" />
                    <span className="text-[#C9A96E] text-xs">✦ Divider</span>
                    <span className="h-px flex-1 bg-[#C9A96E]/50" />
                    <BlockAction
                      onRemove={() => removeBlock(i)}
                      onMoveUp={() => moveBlock(i, -1)}
                      onMoveDown={() => moveBlock(i, 1)}
                    />
                  </div>
                );
              case "list":
                return (
                  <div
                    key={i}
                    className="space-y-2 rounded-md border border-[#E0DCD5] bg-[#F7F4EF]/40 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleListOrdered(i, false)}
                          className={`rounded px-2 py-1 text-xs ${
                            !block.ordered
                              ? "bg-[#C9A96E]/10 text-[#0D0D0D]"
                              : "text-gray-500"
                          }`}
                          title="Bullet list"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleListOrdered(i, true)}
                          className={`rounded px-2 py-1 text-xs ${
                            block.ordered
                              ? "bg-[#C9A96E]/10 text-[#0D0D0D]"
                              : "text-gray-500"
                          }`}
                          title="Numbered list"
                        >
                          <ListOrdered className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-gray-400">
                          {block.ordered ? "Numbered" : "Bullet"}
                        </span>
                      </div>
                      <BlockAction
                        onRemove={() => removeBlock(i)}
                        onMoveUp={() => moveBlock(i, -1)}
                        onMoveDown={() => moveBlock(i, 1)}
                      />
                    </div>
                    <ul className="space-y-1.5">
                      {block.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-[#C9A96E] text-xs">
                            {block.ordered ? `${idx + 1}.` : "•"}
                          </span>
                          <input
                            value={item}
                            onChange={(e) =>
                              updateListItem(i, idx, e.target.value)
                            }
                            placeholder="List item"
                            className="w-full rounded-md border border-[#E0DCD5] bg-white px-2.5 py-1.5 text-sm focus:border-[#C9A96E] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeListItem(i, idx)}
                            className="text-gray-300 hover:text-red-500"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => addListItem(i)}
                      className="flex items-center gap-1 text-xs text-[#C9A96E] hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add item
                    </button>
                  </div>
                );
              case "feature":
                return (
                  <FeatureEditor
                    block={block}
                    onUpdate={(b) => updateBlock(i, b)}
                    onRemove={() => removeBlock(i)}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function EditableRow({
  value,
  onChange,
  placeholder,
  className,
  onRemove,
  onMoveUp,
  onMoveDown,
  index,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  index: number;
}) {
  return (
    <div className="group flex items-start gap-2 rounded-md border border-[#E0DCD5] bg-white p-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent px-1 ${className ?? ""} focus:outline-none`}
      />
      <BlockAction
        onRemove={onRemove}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />
    </div>
  );
}

function BlockAction({
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button
        type="button"
        onClick={onMoveUp}
        title="Move up"
        className="rounded p-1 text-gray-400 hover:bg-[#E0DCD5] hover:text-[#0D0D0D]"
      >
        <MoveUp className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        title="Move down"
        className="rounded p-1 text-gray-400 hover:bg-[#E0DCD5] hover:text-[#0D0D0D]"
      >
        <MoveDown className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        title="Remove"
        className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function plainTextToBlocks(plain: string): DescriptionBlock[] {
  if (!plain || !plain.trim()) return [];
  return plain
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((text) => ({ type: "paragraph", text }));
}
