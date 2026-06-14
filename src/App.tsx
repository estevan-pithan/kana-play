import logo from './assets/logo.png'

function App() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <div className="bg-blob bg-blob--ochre h-96 w-96 -top-24 -left-24" />
      <div className="bg-blob bg-blob--amber h-[28rem] w-[28rem] bottom-0 right-0" />

      <section className="glass-card relative z-10 max-w-md w-full p-10 text-center">
        <img src={logo} alt="KanaPlay logo" className="mx-auto h-28 w-auto mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">
          Kana<span className="accent-brand">Play</span>
        </h1>
        <p className="mt-2 text-sm text-white/70">Curated discovery starts here.</p>
      </section>
    </main>
  )
}

export default App
