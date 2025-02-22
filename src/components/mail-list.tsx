import { ComponentProps } from "react";
import * as React from "react";
import { useRef, useEffect } from "react";
// import formatDistanceToNow from "date-fns/formatDistanceToNow"

import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Mail } from "@/app/data";
import { useMail } from "@/app/use-mail";

interface MailListProps {
  items: Mail[];
  onMailSelect: (id: string) => void;
  currentThread?: string;
  defaultScrollPosition: number;
}

export function MailList({
  items,
  onMailSelect,
  currentThread,
  defaultScrollPosition,
}: MailListProps) {
  const [mail, setMail] = useMail();

  // 创建一个 ref 来引用 ScrollArea
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const scrollTop = target.scrollTop;
    // 保存滚动位置到 cookie
    document.cookie = `mail-list-scroll-position=${scrollTop}; path=/; max-age=31536000`;
  };

  // 恢复滚动位置
  useEffect(() => {
    if (defaultScrollPosition) {
      // 找到真实的滚动容器
      const viewport = scrollAreaRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        requestAnimationFrame(() => {
          viewport.scrollTop = defaultScrollPosition;
          console.log("Restored scroll position:", defaultScrollPosition);
        });
      }
    }
  }, [defaultScrollPosition]);

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="h-[calc(100vh-7rem)] mail-list-scroll"
      onScrollCapture={handleScroll}
    >
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <div
            key={item.id}
            role="button"
            onClick={() => onMailSelect(item.id)}
            className={cn(
              "flex flex-col gap-2 rounded-lg border p-4 cursor-pointer hover:bg-accent",
              currentThread === item.id && "bg-muted",
              !item.read && "font-medium"
            )}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.name}</div>
                  {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    mail.selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {/* {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })} */}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.text.substring(0, 300)}
            </div>
            {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
