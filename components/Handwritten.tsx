export default function Handwritten({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={className}
      style={{
        fontFamily: '"Comic Sans MS", "Bradley Hand", "Segoe Print", cursive',
        fontStyle: "italic",
      }}
    >
      {children}
    </p>
  );
}