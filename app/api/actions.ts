"use server"

export async function handleInputs(e: FormData) {
  const url = e.get("threadUrl");
  
  if(!url) {
    console.error("No url provided")
    return "No url provided"
  }

  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL +"=" + url);

  const data = await response.json() as { response: string };
  
  return data.response
}