import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <div>
        <Header />
        <main
          style={{
            minHeight: "80vh",
            // background:
            //   "url('https://images.unsplash.com/photo-1581168334628-818a1f8aef28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80')",
            // backgroundRepeat: "no-repeat",
            // backgroundSize: "cover",
          }}
        >
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
