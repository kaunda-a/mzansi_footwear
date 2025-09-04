import clsx from "clsx";

export default function Logo({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center border border-neutral-200 bg-white",
        {
          "h-[40px] w-[40px] rounded-xl": !size,
          "h-[30px] w-[30px] rounded-lg": size === "sm",
        },
      )}
    >
      <img 
        src="/logo.png" 
        alt="Mzansi Footwear" 
        className={clsx(
          "object-contain",
          {
            "h-[30px] w-[30px]": !size,
            "h-[20px] w-[20px]": size === "sm",
          },
        )}
      />
    </div>
  );
}
