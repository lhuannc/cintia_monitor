import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ip } = await req.json();
    
    if (!ip) {
      return new Response(
        JSON.stringify({ error: "IP address is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Use native Deno.connect to test TCP connection
    // We'll try to connect with a short timeout
    try {
      const conn = await Deno.connect({
        hostname: ip,
        port: 7, // Echo protocol port
        transport: "tcp",
      });
      conn.close();
      
      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch {
      return new Response(
        JSON.stringify({ success: false }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});