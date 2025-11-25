"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/callback?code=${code}`)
        .then(async (r) => {
          let data;
          try { data = await r.json(); } catch { data = {}; }
          if (data.accessToken) {
            const secureFlag = window.location.protocol === 'https:' ? '; secure' : '';
            document.cookie = `token=${data.accessToken}; path=/; max-age=86400${secureFlag}`;
            console.log("Token guardado en cookie", data.accessToken);
            router.replace("/");
          } else {
            alert("No se recibió token válido. Redirigiendo a login.");
            router.replace("/login");
          }
        })
        .catch((err) => {
          console.error("Error durante login callback", err);
          alert("Error durante login. Redirigiendo a login inicial");
          router.replace("/login");
        });
    } else {
      alert("No llegó un code válido por queryString");
      router.replace("/login");
    }
  }, [searchParams, router]);

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
      <span style={{ color: '#5A5A5A' }}>Procesando autenticación...</span>
    </main>
  );
}
