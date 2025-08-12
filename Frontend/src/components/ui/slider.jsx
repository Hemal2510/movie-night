import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    {/* Track */}
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-700">
      {/* Filled Range */}
      <SliderPrimitive.Range className="absolute h-full bg-yellow-400" />
    </SliderPrimitive.Track>

    {/* Thumb */}
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-yellow-300 bg-yellow-400 shadow transition hover:shadow-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
  </SliderPrimitive.Root>
))

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
