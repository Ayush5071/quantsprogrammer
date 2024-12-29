"use client";
import { cn } from "@/lib/utils";
import { CardStack } from "../ui/cardSatck";
export function Cardstack() {
  return (
    <div className="h-auto w-full flex items-center justify-center">
      <CardStack items={CARDS} />
    </div>
  );
}

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold  bg-emerald-400/[0.3] text-emerald-700 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

const CARDS = [
  {
    id: 0,
    name: "Ayush Tiwari",
    designation: "Aspiring Software Engineer",
    content: (
      <p>
        <Highlight>DSA</Highlight> is a powerful tool to optimize your
        development skills. Embrace the process, and it will transform your
        perspective on coding challenges.
      </p>
    ),
  },
  {
    id: 1,
    name: "Ayush Tiwari",
    designation: "Aspiring Software Engineer",
    content: (
      <p>
        Building two projects for a resume might seem challenging, but{" "}
        <Highlight>enjoying the process</Highlight> makes the journey
        worthwhile.
      </p>
    ),
  },
  {
    id: 2,
    name: "Ayush Tiwari",
    designation: "Aspiring Software Engineer",
    content: (
      <p>
        Learn until you can transform any <Highlight>idea in your mind</Highlight>{" "}
        into reality. Creativity and persistence will set you apart.
      </p>
    ),
  },
  {
    id: 3,
    name: "Linus Torvalds",
    designation: "Creator of Linux",
    content: (
      <p>
        Talk is cheap. <Highlight>Show me the code</Highlight>.
      </p>
    ),
  },
  {
    id: 4,
    name: "Martin Fowler",
    designation: "Software Developer and Author",
    content: (
      <p>
        Any fool can write code that a computer understands.{" "}
        <Highlight>Good programmers</Highlight> write code that humans
        understand.
      </p>
    ),
  },
  {
    id: 5,
    name: "Bill Gates",
    designation: "Co-founder of Microsoft",
    content: (
      <p>
        Measuring programming progress by lines of code is like measuring{" "}
        <Highlight>aircraft building</Highlight> by weight.
      </p>
    ),
  },
];
