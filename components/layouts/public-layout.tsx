import Footer from "../shared/footer";
import Navbar from "../shared/navbar";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>
        Public layout
        {children}
      </main>
      <Footer />
    </>
  );
}

export default PublicLayout;
