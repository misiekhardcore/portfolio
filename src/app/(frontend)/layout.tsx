import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <body className="min-h-full bg-wood-50 text-wood-800">
      <div className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </body>
  );
}
