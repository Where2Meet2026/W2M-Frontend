function PageShell({ children, className = "flex flex-col px-6 py-10", ...rest }) {
  return (
    <div className="flex min-h-screen justify-center bg-[#EFF3F9]">
      <main className={`min-h-screen w-[393px] bg-white text-[#191f28] ${className}`} {...rest}>
        {children}
      </main>
    </div>
  );
}

export default PageShell;
