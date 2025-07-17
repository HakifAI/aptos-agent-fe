import { cn } from "@/lib/utils";
import * as Tabs from "@radix-ui/react-tabs";
import TxnTab from "./txn-tab";
import AssetTabTab from "./asset-tab";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";

type IAssetTab = "assets" | "txn";

const AssetTab = () => {
    const [assetTab, setAssetTab] = useQueryState("assetTab", parseAsString.withDefault("assets"));

    const tabs = [
        {
            label: "Assets",
            value: "assets",
        },
        {
            label: "Txn",
            value: "txn",
        },
    ];


    const handleAssetTabChange = (value: string) => {
        setAssetTab(value as IAssetTab);
    };

    return (
        <Tabs.Root value={assetTab} onValueChange={handleAssetTabChange}>
            <Tabs.List
                className={cn("flex items-center gap-x-4 w-full border-b border-blue-80")}
            >
                {tabs.map((option) => (
                    <Tabs.Trigger value={option.value} className={cn("min-w-[50px] text-base bg-transparent leading-[19px] text-blue-60 py-[14px]", assetTab === option.value && "text-blue-10 border-b border-blue-40 font-semibold")} key={option.value}>
                        {option.label}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
            <Tabs.Content className="mt-8 overflow-y-auto h-[calc(100vh-400px)] pr-2" value="assets">
                <AssetTabTab />
            </Tabs.Content>
            <Tabs.Content className="mt-8 overflow-y-auto h-[calc(100vh-400px)] pr-2" value="txn">
                <TxnTab />
            </Tabs.Content>
        </Tabs.Root>

    )
}

export default AssetTab;