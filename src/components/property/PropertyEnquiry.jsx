import { useState } from "react";
import { CheckCircle2, Loader2, Mail, MessageCircle, Phone, AlertCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useAgent } from "../../context/ContentContext";
import { supabase } from "../../lib/supabase";
import Pill from "../../components/common/Pill";

const digits = (s) => (s || "").replace(/[^0-9+]/g, "");

/**
 * Enquiry panel on a property page. It pre-fills the message with the address
 * and saves the enquiry to the Supabase `inquiries` table — the same table the
 * home-page form uses — taking the area, type, bedrooms and price from the
 * listing itself.
 */
export default function PropertyEnquiry({ property }) {
  const agent = useAgent();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    message: `I'd like to know more about "${property.title}" in ${property.area}.`
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    // Keys must match the column names in the `inquiries` table. The visitor
    // types their name, email, phone and message; the rest comes from the
    // listing they are looking at.
    const row = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      area: property.area,
      // The table has no column for the listing, so its title and page go on
      // the last line of the message. That way the agent knows which property
      // it is about even if the visitor rewrote the message.
      message: [form.message.trim(), `Listing: ${property.title} (/property/${property.id})`]
        .filter(Boolean)
        .join("\n\n"),
      listing_type: property.listing_type || "sale",
      property_type: property.property_type,
      bedrooms: property.bedrooms ?? null,
      budget_aed: property.price_aed
    };

    try {
      // No `.select()` after insert: visitors may add enquiries but not read
      // them back, so asking for the saved row would fail.
      const { error } = await supabase.from("inquiries").insert(row);
      if (error) throw error;
      setStatus("sent");
    } catch (err) {
      console.error("Could not save the property enquiry to Supabase:", err);
      setStatus("error");
    }
  };

  const agentName = property.agent_name || agent.name;
  const agentPhone = property.agent_phone || agent.phone;

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-ink/10 bg-sage">
      <div className="flex items-center gap-4 bg-ink p-6 text-sand">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-sand/30 font-heading text-sm font-semibold tracking-wider">
          {agentName
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div>
          <p className="font-display text-xl leading-tight">{agentName}</p>
          <p className="mt-0.5 font-heading text-[9px] uppercase tracking-label text-sand/55">
            {agent.role} · {agent.licence}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-ink/10 border-b border-ink/10 bg-sand">
        <a
          href={`tel:${digits(agentPhone)}`}
          data-cursor="link"
          className="flex flex-col items-center gap-1.5 py-4 font-heading text-[9px] uppercase tracking-label text-ink-mute transition-colors hover:bg-sage hover:text-ink"
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
        <a
          href={`https://wa.me/${digits(agent.whatsapp).replace("+", "")}?text=${encodeURIComponent(
            `Hi ${agentName}, I'm interested in ${property.title} (${property.area}).`
          )}`}
          target="_blank"
          rel="noreferrer noopener"
          data-cursor="link"
          className="flex flex-col items-center gap-1.5 py-4 font-heading text-[9px] uppercase tracking-label text-ink-mute transition-colors hover:bg-sage hover:text-ink"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href={`mailto:${agent.email}?subject=${encodeURIComponent(property.title)}`}
          data-cursor="link"
          className="flex flex-col items-center gap-1.5 py-4 font-heading text-[9px] uppercase tracking-label text-ink-mute transition-colors hover:bg-sage hover:text-ink"
        >
          <Mail className="h-4 w-4" />
          Email
        </a>
      </div>

      <div className="p-6">
        {status === "sent" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-forest" />
            <p className="mt-5 font-display text-2xl text-ink">Enquiry sent</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-mute">
              I&apos;ll come back to you about this address within one working day.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <p className="eyebrow">Request a viewing</p>

            <div className="space-y-1.5">
              <Label htmlFor="pe-name" className="sr-only">
                Full name
              </Label>
              <Input
                id="pe-name"
                required
                placeholder="Full name"
                value={form.full_name}
                onChange={set("full_name")}
                className="h-11 rounded-xl border-ink/15 bg-sand"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pe-email" className="sr-only">
                Email
              </Label>
              <Input
                id="pe-email"
                type="email"
                required
                placeholder="Email"
                value={form.email}
                onChange={set("email")}
                className="h-11 rounded-xl border-ink/15 bg-sand"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pe-phone" className="sr-only">
                Phone
              </Label>
              {/* Required: the `phone` column in the inquiries table can't be empty. */}
              <Input
                id="pe-phone"
                type="tel"
                required
                placeholder="Phone"
                value={form.phone}
                onChange={set("phone")}
                className="h-11 rounded-xl border-ink/15 bg-sand"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pe-message" className="sr-only">
                Message
              </Label>
              <Textarea
                id="pe-message"
                rows={3}
                value={form.message}
                onChange={set("message")}
                className="resize-none rounded-xl border-ink/15 bg-sand"
              />
            </div>

            {status === "error" && (
              <p role="alert" className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                That didn&apos;t send — please try again, or call or email instead.
              </p>
            )}

            <Pill
              type="submit"
              disabled={status === "sending"}
              arrow={status !== "sending"}
              magnetic={false}
              className="w-full"
            >
              {status === "sending" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending
                </span>
              ) : (
                "Send enquiry"
              )}
            </Pill>
          </form>
        )}
      </div>
    </div>
  );
}
