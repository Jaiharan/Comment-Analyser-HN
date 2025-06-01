"use server"

export async function handleInputs(e: FormData) {
  const url = e.get("threadUrl");

  if (!url) {
    console.error("No url provided");
    return "No url provided";
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}=${url}`);

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const text = await response.text();
      console.error("Fetch failed with status:", response.status, text);
      return `Fetch error: ${text}`;
    }

    // Try to parse JSON safely
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json() as { response: string };
      return data.response;
    } else {
      const text = await response.text();
      console.error("Unexpected content-type:", contentType, text);
      return `Invalid response format: ${text}`;
    }

  } catch (error) {
    console.error("Unexpected error:", error);
    return "Something went wrong while fetching the data.";
  }
}
