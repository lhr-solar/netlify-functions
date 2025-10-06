import fetch from "node-fetch";

export async function handler(event, context) {
    try {
        const response = await fetch("https://linktr.ee/lhrsolar");
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
                "Access-Control-Allow-Origin": "*", // allows your GitHub Pages frontend to fetch
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
