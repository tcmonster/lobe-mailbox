"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { UserButton } from "@clerk/nextjs";

import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";

import { type Mail } from "@/app/data";
import { useMail } from "@/app/use-mail";
import { cn } from "@/lib/utils";

import { AccountSwitcher } from "./account-switcher";
import { MailDisplay } from "./mail-display";
import { AppSidebar } from "./app-sidebar";
import { Nav } from "./nav";

import { TooltipProvider } from "./ui/tooltip";
import { Input } from "./ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { MailList } from "./mail-list";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  defaultScrollPosition: number;
  navCollapsedSize: number;
  currentAccount?: string;
  currentMailbox?: string;
  currentThread?: string;
}

export function MailLayout({
  accounts,
  mails,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  defaultScrollPosition = 0,
  navCollapsedSize,
  currentAccount,
  currentMailbox,
  currentThread,
}: MailProps) {
  const [layout, setLayout] = React.useState(defaultLayout);
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [mail] = useMail();
  const router = useRouter();

  const handleMailSelect = React.useCallback(
    (id: string) => {
      if (currentAccount && currentMailbox) {
        router.replace(`/${currentAccount}/${currentMailbox}/${id}`);
      }
    },
    [currentAccount, currentMailbox, router]
  );

  // 添加处理 tab 切换的函数
  const handleTabChange = React.useCallback((value: string) => {
    // 清除滚动位置 cookie
    document.cookie = "mail-list-scroll-position=0; path=/; max-age=31536000";
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}; path=/; max-age=31536000`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={layout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={10}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=true; path=/; max-age=31536000`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=false; path=/; max-age=31536000`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <AppSidebar accounts={accounts} isCollapsed={isCollapsed} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={layout[1]} minSize={15}>
          <Tabs
            defaultValue="all"
            className="h-full"
            onValueChange={handleTabChange}
          >
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList
                items={mails}
                onMailSelect={handleMailSelect}
                currentThread={currentThread}
                defaultScrollPosition={defaultScrollPosition}
              />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList
                items={mails.filter((item) => !item.read)}
                onMailSelect={handleMailSelect}
                currentThread={currentThread}
                defaultScrollPosition={defaultScrollPosition}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={layout[2]} minSize={30}>
          {currentThread ? (
            <MailDisplay
              mail={mails.find((item) => item.id === currentThread) || null}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium">Select a message</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a message to read from your inbox
                </p>
              </div>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
