export const DESCRIPTION_MARKER = "NOOR_DESC_V1:";

export type DescriptionBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "divider" }
  | { type: "list"; ordered: boolean; items: string[] }
  | {
      type: "feature";
      icon: string;
      title: string;
      description: string;
    };

export function serializeDescription(blocks: DescriptionBlock[]): string {
  return DESCRIPTION_MARKER + JSON.stringify(blocks);
}

export function parseDescription(
  description: string | null | undefined
): { structured: boolean; blocks: DescriptionBlock[]; plainText: string } {
  if (!description) {
    return { structured: false, blocks: [], plainText: "" };
  }

  if (description.startsWith(DESCRIPTION_MARKER)) {
    try {
      const parsed = JSON.parse(description.slice(DESCRIPTION_MARKER.length));
      if (Array.isArray(parsed)) {
        return {
          structured: true,
          blocks: sanitizeBlocks(parsed),
          plainText: "",
        };
      }
    } catch {
      // fall through to plain text
    }
  }

  return { structured: false, blocks: [], plainText: description };
}

function sanitizeBlocks(input: unknown[]): DescriptionBlock[] {
  const result: DescriptionBlock[] = [];
  for (const raw of input) {
    if (raw && typeof raw === "object") {
      const b = raw as Record<string, unknown>;
      switch (b.type) {
        case "heading":
          if (typeof b.text === "string")
            result.push({ type: "heading", text: b.text });
          break;
        case "subheading":
          if (typeof b.text === "string")
            result.push({ type: "subheading", text: b.text });
          break;
        case "paragraph":
          if (typeof b.text === "string")
            result.push({ type: "paragraph", text: b.text });
          break;
        case "divider":
          result.push({ type: "divider" });
          break;
        case "list": {
          const items = Array.isArray(b.items)
            ? b.items.filter((i): i is string => typeof i === "string")
            : [];
          result.push({ type: "list", ordered: !!b.ordered, items });
          break;
        }
        case "feature":
          if (typeof b.title === "string") {
            result.push({
              type: "feature",
              icon:
                typeof b.icon === "string" && b.icon.trim()
                  ? b.icon
                  : "✦",
              title: b.title,
              description:
                typeof b.description === "string" ? b.description : "",
            });
          }
          break;
        default:
          break;
      }
    }
  }
  return result;
}
