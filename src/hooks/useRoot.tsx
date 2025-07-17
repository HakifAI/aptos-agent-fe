"use client";

import { commonAPI } from "@/apis/common";
import { useAuthContext } from "@/providers/AuthProvider";
import { IGetAgentRoles, Token } from "@/types/common.type";
import { useEffect, useState } from "react";

export function useRoot() {

    const { isAuthenticated } = useAuthContext();
    const [listTokens, setListTokens] = useState<Token[]>([]);
    const [agentData, setAgentData] = useState<IGetAgentRoles>({
        roles: [],
        tags: []
    })

    useEffect(() => {
        if (isAuthenticated) {
            const fetchTokens = async () => {
                const tokens = await commonAPI.getListTokens();
                setListTokens(tokens);
            }
            fetchTokens();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchAgentData = async() => {
            const res = await commonAPI.getAgentRoles()
            if (res) {
              setAgentData({
                roles: res.roles
                  .filter(({ isActive }) => isActive)
                  .map((item) => ({
                    ...item,
                    name: item.name || `Agent #${item.id}`,
                  })),
                tags: res.tags,
              });
            }
        }

        fetchAgentData()
    }, [])


    return {
      listTokens,
      agentRoles: agentData.roles,
      agentTags: agentData.tags,
    };
} 