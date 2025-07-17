import AgentCard from "@/components/ui/agent-card";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRootContext } from "@/providers/RootProvider";
import { useQueryState } from "nuqs";
import { memo } from "react";
import { toast } from "sonner";

interface IProps {
  className?: string;
  onClick?: () => void;
}

const TrendingAgents = ({ className, onClick }: IProps) => {
  const { agentRoles } = useRootContext();
  const [agentSelected, setAgentSelected] = useQueryState("agent");
  const {isAuthenticated} = useAuthContext()

  return (
    <section className={className}>
      <h2 className="text-blue-40 mt-16 mb-8 text-center text-2xl sm:text-[32px] lg:mt-[128px]">
        Trending AI Agents
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-4 pb-[58px]">
        {agentRoles
          .filter((agent) => agent.isTrending)
          .map(({ id, name, description, imageUrl }, idx) => (
            <AgentCard
              key={idx}
              variant={agentSelected === `${id}` ? "active" : "default"}
              title={name || ""}
              imgUrl={imageUrl}
              description={description || ""}
              onClick={() => {
                setAgentSelected(`${id}`);
                onClick?.();
                if (!isAuthenticated) {
                  toast.warning("Connect wallet to start using hakifAI")
                }
              }}
              className="sm:max-w-[333px] lg:max-w-80"
            />
          ))}
      </div>
    </section>
  );
};

export default memo(TrendingAgents);
