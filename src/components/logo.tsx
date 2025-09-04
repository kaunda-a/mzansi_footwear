import clsx from "clsx";
import Image from "next/image";

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
      <Image 
        src="/logo.png" 
        alt="Mzansi Footwear" 
        width={size === "sm" ? 30 : 40}
        height={size === "sm" ? 30 : 40}
        className="object-contain"
      />
    </div>
  );
}
