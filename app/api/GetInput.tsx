"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleInputs } from "./actions";

function GetInput() {
  const [response, setResponse] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  return (
    <div className=" w-full flex flex-col items-center justify-center">
      <form
        className=" w-full flex flex-col items-center justify-center gap-4 mb-8 sm:flex-row"
        action={async (e) => {
          setResponse("")
          setLoading(true);
          const response = await handleInputs(e);
          setLoading(false);
          setResponse(response);
        }}
      >
        <Input
          type="text"
          name="threadUrl"
          placeholder="https://news.ycombinator.com/...."
          className=" w-full max-w-2xl border-slate-800 focus:border-none"
        />
        <Button type="submit">Submit</Button>
      </form>

      {response ? (
        <p className=" w-full max-w-2xl bg-gray-500 rounded-md p-5 flex items-center justify-center">
          {response}
        </p>
      ) : (
        <p className=" w-full max-w-2xl bg-gray-500 rounded-md p-5 flex items-center justify-center">
          {loading ? "Loading..." : "Here will be the context from the comments from the Hacker news thread"}
        </p>
      )}
    </div>
  );
}

export default GetInput;
