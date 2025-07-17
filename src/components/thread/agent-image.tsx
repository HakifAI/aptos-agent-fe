import { memo } from "react";
import Image from "next/image";
import { useQueryState } from "nuqs";
import HakifiBrandIcon from "../icons/hakifi-brand-icon";
import { useRootContext } from "@/providers/RootProvider";

const AgentImage = ({ size = 24 }: { size: number }) => {
  const { agentRoles } = useRootContext();
  const [agent, _] = useQueryState("agent");
  const currentAgent = agentRoles.find(({ id }) => `${id}` === agent);

  return currentAgent?.imageUrl ? (
    <Image
      src={currentAgent.imageUrl}
      width={size}
      height={size}
      alt={currentAgent.name || "agent"}
      className="shrink-0"
    />
  ) : (
    <HakifiBrandIcon
      className="shrink-0"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};

export default memo(AgentImage);
