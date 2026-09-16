  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    // Address of your Python server, e.g. http://localhost:8000
    // Set VITE_API_URL in .env.local, then restart `npm run dev`.
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.warn("VITE_API_URL is not set in .env.local");
      setErrorMessage(`Enquiries aren't connected yet. Please email ${AGENT.email} for now.`);
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    // This object is exactly the JSON your Python server receives.
    const row = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      area: form.area.trim() || null,
      message: form.message.trim() || null,
      listing_type: listingType,
      property_type: propertyType,
      bedrooms: bedrooms === "" ? null : Number(bedrooms),
      budget_aed: budget
    };

    try {
      const res = await fetch(`${apiUrl}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
        // Give up after 15 seconds instead of spinning forever if the server hangs.
        signal: AbortSignal.timeout(15000)
      });

      // fetch only throws when the server can't be reached at all. A 400 or 500
      // reply does NOT throw, so check the status yourself.
      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`Server replied ${res.status}: ${detail}`);
      }

      setSentName(row.full_name.split(" ")[0]);
      setStatus("idle");
      setForm(emptyForm);
      celebrate();
    } catch (err) {
      console.error("Could not send the enquiry to the server:", err);
      setErrorMessage(`That did not send. Please try again, or email ${AGENT.email}.`);
      setStatus("error");
    }
  };