"use client";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/login`;
  };
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="p-8 rounded shadow flex flex-col gap-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9D9D9' }}>
        <h1 className="text-xl font-bold mb-3" style={{ color: '#1A1A1A' }}>Iniciar Sesión</h1>
        <button
          onClick={handleLogin}
          className="text-white px-5 py-2 rounded transition"
          style={{ backgroundColor: '#3A7BD5' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fa3'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3A7BD5'}
        >
          Ingresar con SSO
        </button>
      </div>
    </main>
  );
}
