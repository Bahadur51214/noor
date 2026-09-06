"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Phone, Mail, MapPin, MessageCircle, Send, Loader2 } from "lucide-react";
import { submitContactMessage } from "@/actions/contact.actions";
import { getPublicStoreSettings } from "@/actions/public.actions";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [settings, setSettings] = useState<{
    email: string;
    phone: string;
    whatsapp: string;
  } | null>(null);

  useEffect(() => {
    getPublicStoreSettings().then((s) =>
      setSettings({ email: s.email, phone: s.phone, whatsapp: s.whatsapp })
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error("Please fill in your name and message");
      return;
    }
    setLoading(true);
    const result = await submitContactMessage(form);
    setLoading(false);
    if (result.success) {
      toast.success("Message sent! We'll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } else {
      toast.error(result.error || "Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Hero */}
      <section className="bg-[#0D0D0D] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-serif mb-4">Get in Touch</h1>
          <p className="text-gray-300 text-base md:text-lg">
            Have a question about an order or a product? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-xl font-serif text-[#0D0D0D] mb-6">Contact Information</h2>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#0D0D0D] rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#C9A96E]" />
                </div>
                <div>
                  <p className="font-medium text-[#0D0D0D]">Phone / WhatsApp</p>
                  <p className="text-gray-500 text-sm">
                    {settings?.phone || "+92 300 1234567"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#0D0D0D] rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#C9A96E]" />
                </div>
                <div>
                  <p className="font-medium text-[#0D0D0D]">Email</p>
                  <p className="text-gray-500 text-sm">
                    {settings?.email || "support@noorwatches.com"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#0D0D0D] rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#C9A96E]" />
                </div>
                <div>
                  <p className="font-medium text-[#0D0D0D]">Address</p>
                  <p className="text-gray-500 text-sm">Lahore, Pakistan</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#0D0D0D] rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-[#C9A96E]" />
                </div>
                <div>
                  <p className="font-medium text-[#0D0D0D]">Response Time</p>
                  <p className="text-gray-500 text-sm">We typically reply within 2-4 hours during business days</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E0DCD5] p-6 md:p-8 space-y-6">
                <h2 className="text-xl font-serif text-[#0D0D0D]">Send us a Message</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-name">Full Name *</Label>
                    <Input
                      id="contact-name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone">Phone Number</Label>
                    <Input
                      id="contact-phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="03XX XXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="contact-message">Message *</Label>
                  <textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-md border border-[#E0DCD5] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none focus:ring-1 focus:ring-[#C9A96E] min-h-[120px]"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-[#0D0D0D] text-white h-12" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
