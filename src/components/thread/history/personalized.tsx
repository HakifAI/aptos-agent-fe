import AgentCard from "@/components/ui/agent-card";
import DragScrollWrapper from "@/components/ui/drag-scroll-wrapper";
import Tabs from "@/components/ui/tabs";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRootContext } from "@/providers/RootProvider";
import { useQueryState } from "nuqs";
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";

const Personalized = () => {
  const {agentRoles, agentTags} = useRootContext()
  const {isAuthenticated} = useAuthContext()
  const [agentTab, setAgentTab] = useState("all");
  const [agentSelected, setAgentSelected] = useQueryState("agent");
  

  useEffect(() => {
    if (agentRoles.length && agentTags.length && agentSelected) {
      const agent = agentRoles.find((item) => `${item.id}` === agentSelected);

      if (agent && agent.tags.length) {
        setAgentTab(agent.tags[0]);
      }
    }
  }, [agentSelected, agentRoles, agentTags]);

  const agentTabs = [
    { label: "All", value: "all" },
    ...agentTags.map((tag) => ({ label: tag, value: tag })),
  ];

  const renderContent = () => {
    const list =
      agentTab === "all"
        ? [...agentRoles]
        : agentRoles.filter(({ tags }) => tags.includes(agentTab));

    return list.map(({ name, description, id, imageUrl }, idx) => (
      <AgentCard
        variant={agentSelected === `${id}` ? "active" : "default"}
        key={idx}
        size="sm"
        title={name || ""}
        description={description || ""}
        imgUrl={imageUrl}
        onClick={() => {
          setAgentSelected(`${id}`)
          if (!isAuthenticated) {
            toast.warning("Connect wallet to start using hakifAI")
          }
        }}
      />
    ));
  };

  return (
    <section className="flex-grow overflow-y-auto hide-scrollbar">
      <DragScrollWrapper className="hide-scrollbar mb-4">
        <Tabs
          list={agentTabs}
          activeValue={agentTab}
          onChange={setAgentTab}
          className="w-max"
          type="outline"
        />
      </DragScrollWrapper>

      <div className="mt-8 flex flex-col gap-4 pb-4">{renderContent()}</div>
    </section>
  );
};

export default memo(Personalized);
