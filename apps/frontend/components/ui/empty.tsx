export default function Empty({ message }: { message: string }) {
  return (
    <div
      className="
      mx-auto w-fit rounded-md 
      border border-border/40 
      bg-background/70 px-4 py-1.5 
      text-sm text-muted-foreground 
      backdrop-blur-sm shadow-sm
    "
    >
      {message}
    </div>
  );
}
