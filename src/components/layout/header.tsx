import MenuIcon from "../icons/menu-icon";
import { WalletSelector } from "../connect/WalletSelector";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import Tabs, { ITab } from "../ui/tabs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "../ui/button";
import BoxIcon from "../icons/box-icon";
import UserIcon from "../icons/user-icon";
import { useAuthContext } from "@/providers/AuthProvider";
import { toast } from "sonner";
import HakifiBrandIcon from "../icons/hakifi-brand-icon";
import Link from "next/link";

export function Header() {

  const [tab, _setTab] = useQueryState("tab", parseAsString.withDefault("defai"));
  const { isAuthenticated } = useAuthContext();

  const tabs: ITab[] = [
    {
      label: (
        <>
          <BoxIcon className="size-[18px]" />
          <span>Defai</span>
        </>
      ),
      value: "defai",
    },
    {
      label: (
        <>
          <UserIcon className="size-[18px]" />
          <span>Agent</span>
        </>
      ),
      value: "agent",
    },
  ];

  const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );

  const isTablet = useMediaQuery("(max-width: 1023px)");

  const onTabChange = (value: string) => {
    _setTab(value);
    setChatHistoryOpen(false);
    if(!isAuthenticated) {
      toast.warning("Connect wallet to start using hakiAI")
    }
  };

  return (
    <header
      className={cn(
        "grid grid-cols-2 items-center gap-y-7 px-4 pt-3 pb-4 sm:grid-cols-3 sm:px-8 lg:px-16 sm:pt-16 sm:pb-8",
        chatHistoryOpen && !isTablet && "sm:grid-cols-2",
      )}
    >
      {!chatHistoryOpen && (
        <button
          onClick={() => setChatHistoryOpen((p) => !p)}
          className="p-2 hidden lg:block"
        >
          <HakifiBrandIcon className="w-[33px] h-[25px]" />
        </button>
      )}
      <div className="flex w-full items-center gap-x-3 lg:hidden">
        <Link href="/" className="hover:opacity-70">
          <HakifiBrandIcon className="w-[35px] h-[26px]" />
        </Link>
        <Button onClick={() => setChatHistoryOpen((p) => !p)} variant="ghost" className="text-blue-50 hover:text-blue-20 active:text-blue-80">
          <MenuIcon className="size-6" />
        </Button>
      </div>

      <div
        className={cn(
          "hidden items-center justify-center sm:flex",
          chatHistoryOpen && !isTablet && "justify-start",
        )}
      >
        <Tabs
          list={tabs}
          activeValue={tab}
          onChange={onTabChange}
          className="w-max"
        />
      </div>

      <div className="flex justify-end">
        <WalletSelector />
      </div>
      <div
        className={cn("col-span-2 flex items-center justify-center sm:hidden")}
      >
        <Tabs
          list={tabs}
          activeValue={tab}
          onChange={onTabChange}
          className="w-max"
        />
      </div>
    </header>
  );
}
