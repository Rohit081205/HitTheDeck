import { MainApp } from '@/components/blocks/main-app'

export default function Home() {
  return (
    <>
      <main>
        <MainApp />
      </main>

      <footer className="border-t border-white/8 px-6 py-7">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between flex-wrap gap-2">
          {/* Footer content removed */}
        </div>
      </footer>
    </>
  )
}
