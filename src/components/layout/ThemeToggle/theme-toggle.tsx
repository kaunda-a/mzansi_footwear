"use client";

import { IconBrightness } from "@tabler/icons-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  // Commented out dark mode functionality
  // const { setTheme, resolvedTheme } = useTheme();

  const handleThemeToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      // Commented out dark mode functionality
      // const newMode = resolvedTheme === "dark" ? "light" : "dark";
      // const root = document.documentElement;

      // if (!document.startViewTransition) {
      //   setTheme(newMode);
      //   return;
      // }

      // // Set coordinates from the click event
      // if (e) {
      //   root.style.setProperty("--x", `${e.clientX}px`);
      //   root.style.setProperty("--y", `${e.clientY}px`);
      // }

      // document.startViewTransition(() => {
      //   setTheme(newMode);
      // });
    },
    [], // Removed dependencies
  );

  return (
    <Button
      variant="secondary"
      size="icon"
      className="group/toggle size-8"
      onClick={handleThemeToggle}
      disabled={true} // Disable the button since dark mode is commented out
    >
      <IconBrightness />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
