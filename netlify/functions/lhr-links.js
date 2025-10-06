export async function handler(event, context) {
    try {
        // Use environment variable LINKTREE_USERNAME, default to 'lhrsolar'
        const username = process.env.LINKTREE_USERNAME || "";
        const targetUrl = `https://linktr.ee/${username}`;

        const response = await fetch(targetUrl);
        const html = await response.text();

        // Extract JSON from the page
        const jsonMatch = html.match(
            /<script id="__NEXT_DATA__" type="application\/json"(?: crossorigin="anonymous")?>\s*(.*?)\s*<\/script>/
        );

        if (!jsonMatch) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "No JSON data found on Linktree page" }),
            };
        }

        const jsonData = JSON.parse(jsonMatch[1]);
        const links = jsonData.props?.pageProps?.links || [];

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(
                links.map((l) => ({
                    title: l.title,
                    url: l.url,
                }))
            ),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
