// Netlify Function: Send cleaning request submissions to Notion
export default async (event) => {
  if (event.httpMethod !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const notionSecret = process.env.NOTION_SECRET;
  const dbId = process.env.NOTION_CLIENT_DB_ID;

  if (!notionSecret || !dbId) {
    return new Response(
      JSON.stringify({ error: "Missing NOTION_SECRET or NOTION_CLIENT_DB_ID" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const { name, phone, email, address, serviceType, size, time, notes } = payload;

    const notionPayload = {
      parent: { database_id: dbId },
      properties: {
        Name: { title: [{ text: { content: name || "Unknown" } }] },
        Phone: { rich_text: [{ text: { content: phone || "N/A" } }] },
        Email: { email: email || "" },
        Address: { rich_text: [{ text: { content: address || "" } }] },
        "Service Type": { select: { name: serviceType || "General Cleaning" } },
        "Home Size": { rich_text: [{ text: { content: size || "" } }] },
        "Preferred Time": { rich_text: [{ text: { content: time || "" } }] },
        Notes: { rich_text: [{ text: { content: notes || "" } }] },
        Source: { select: { name: "Website Form" } },
      },
    };

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionSecret}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(notionPayload),
    });

    if (!res.ok) {
      const detail = await res.text();
      return new Response(
        JSON.stringify({ error: "Notion API error", detail }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Unexpected error", detail: err.message }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
};
