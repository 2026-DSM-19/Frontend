import Footer from "./components/footer";

function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

export default Layout;