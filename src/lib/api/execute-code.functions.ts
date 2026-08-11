import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const executeInput = z.object({
  language: z.enum(["python", "c++"]),
  code: z.string().min(1).max(50_000),
  accessToken: z.string().min(1),
});

type JudgeResponse = {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string;
  status?: { id: number; description: string };
};

export const executeRemoteCode = createServerFn({ method: "POST" })
  .validator(executeInput)
  .handler(async ({ data }) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase server configuration is missing.");

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: authData, error: authError } = await supabase.auth.getUser(data.accessToken);
    if (authError || !authData.user) throw new Error("Sign in before running remote code.");

    const baseUrl = process.env.CODE_RUNNER_URL ?? "https://ce.judge0.com/submissions";
    const endpoint = new URL(baseUrl);
    endpoint.searchParams.set("base64_encoded", "false");
    endpoint.searchParams.set("wait", "true");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        source_code: data.code,
        language_id: data.language === "c++" ? 54 : 71,
        cpu_time_limit: 3,
        wall_time_limit: 5,
        memory_limit: 128_000,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    const result = (await response.json()) as JudgeResponse;
    if (!response.ok) {
      throw new Error(result.message ?? `Code runner returned HTTP ${response.status}.`);
    }

    const failed = (result.status?.id ?? 0) > 3;
    return {
      stdout: result.stdout ?? "",
      error: failed
        ? result.compile_output || result.stderr || result.message || result.status?.description || "Execution failed."
        : result.stderr || "",
    };
  });
