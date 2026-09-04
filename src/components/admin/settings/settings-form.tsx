"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateHomepageSettings, updateSocialSettings, updatePolicySettings } from "@/actions/settings.actions";

interface SettingsField {
  key: string;
  label: string;
  type?: "text" | "textarea";
  placeholder?: string;
}

interface SettingsFormProps {
  title: string;
  description: string;
  group: "homepage" | "social" | "policy";
  fields: SettingsField[];
}

const actionMap = {
  homepage: updateHomepageSettings,
  social: updateSocialSettings,
  policy: updatePolicySettings,
};

export function SettingsForm({ title, description, group, fields }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const initial: Record<string, string> = {};
    fields.forEach((f) => {
      initial[f.key] = "";
    });
    setValues(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const action = actionMap[group];
      const result = await action(values);
      if (result && "error" in result) {
        toast.error(String(result.error));
      } else {
        toast.success(`${title} saved`);
      }
    } catch {
      toast.error(`Failed to save ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-[#0D0D0D]">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <Label htmlFor={field.key}>{field.label}</Label>
            {field.type === "textarea" ? (
              <textarea
                id={field.key}
                value={values[field.key] || ""}
                onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                rows={5}
                className="mt-1 w-full rounded-md border border-[#E0DCD5] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
              />
            ) : (
              <Input
                id={field.key}
                value={values[field.key] || ""}
                onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="mt-1"
              />
            )}
          </div>
        ))}
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="bg-[#0D0D0D] text-white hover:bg-[#262420]"
      >
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
