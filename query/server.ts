import { AxiosInstance } from 'axios';

import { WorkflowNode } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-node';

import CreateServerMapRequest from '@/types/request/CreateServerMapRequest';
import CreateServerPluginRequest from '@/types/request/CreateServerPluginRequest';
import { CreateServerRequest } from '@/types/request/CreateServerRequest';
import { UpdateServerPortRequest, UpdateServerRequest } from '@/types/request/UpdateServerRequest';
import { KickInfo } from '@/types/response/KickInfo';
import { Player } from '@/types/response/Player';
import { PlayerInfo } from '@/types/response/PlayerInfo';
import { PostServerResponse } from '@/types/response/PostServerResponse';
import { ServerAdmin } from '@/types/response/ServerAdmin';
import { ServerBuildLog } from '@/types/response/ServerBuildLog';
import { ServerCommandDto } from '@/types/response/ServerCommand';
import { ServerDto } from '@/types/response/ServerDto';
import { ServerEnv } from '@/types/response/ServerEnv';
import { ServerFile } from '@/types/response/ServerFile';
import { ServerLoginLog } from '@/types/response/ServerLoginLog';
import { ServerMap } from '@/types/response/ServerMap';
import { ServerMetric } from '@/types/response/ServerMetric';
import { ServerPlan } from '@/types/response/ServerPlan';
import { ServerPlugin } from '@/types/response/ServerPlugin';
import { ServerSetting } from '@/types/response/ServerSetting';
import { ServerStats } from '@/types/response/ServerStats';
import { GetWorkflowNodeTypeSchema, LoadWorkflow, LoadWorkflowSchema, WorkflowNodeType } from '@/types/response/WorkflowContext';
import { PaginationQuery } from '@/types/schema/search-query';

import { MetricUnit } from '@/lib/metric.utils';
import { toForm } from '@/lib/utils';

import { Edge, ReactFlowInstance } from '@xyflow/react';

import { z } from 'zod/v4';
import { PlayerConnectRoom } from '@/types/response/PlayerConnectRoom';

export async function getPlayerConnectRooms(axios: AxiosInstance, { page }: { page: number }): Promise<PlayerConnectRoom[]> {
    if (page > 0) return []
    
    const result = await axios.get(`/player-connect/rooms`, {
        baseURL: 'https://api.mindustry-tool.com/api/v4/'
    });

    return result.data;
}

export async function deleteServerFile(axios: AxiosInstance, id: string, path: string): Promise<void> {
    const result = await axios.delete(`/servers/${id}/files`, {
        params: { path },
    });

    return result.data;
}

export async function getServerCount(axios: AxiosInstance): Promise<number> {
    const result = await axios.get(`/servers/count`);

    return result.data;
}

export async function getServerPlayers(axios: AxiosInstance, id: string): Promise<Player[]> {
    const result = await axios.get(`/servers/${id}/players`);

    return result.data;
}

export async function getServerState(axios: AxiosInstance, id: string): Promise<any> {
    const result = await axios.get(`/servers/${id}/json`);

    return result.data;
}

export async function getServerMismatch(axios: AxiosInstance, id: string): Promise<string[]> {
    const result = await axios.get(`/servers/${id}/mismatch`);

    return result.data;
}

export async function getServerPlayerInfos(
    axios: AxiosInstance,
    id: string,
    params: {
        page: number;
        size: number;
        banned?: boolean;
        filter?: string;
    },
): Promise<PlayerInfo[]> {
    const result = await axios.get(`/servers/${id}/player-infos`, { params });

    return result.data;
}

export async function getServerKicks(axios: AxiosInstance, id: string): Promise<KickInfo> {
    const result = await axios.get(`/servers/${id}/kicks`);

    return result.data;
}

export async function getServerCommands(axios: AxiosInstance, id: string): Promise<ServerCommandDto[]> {
    const result = await axios.get(`/servers/${id}/commands`);
    return result.data;
}

export async function deleteServerMap(axios: AxiosInstance, id: string, mapId: string): Promise<void> {
    const result = await axios.delete(`/servers/${id}/maps/${mapId}`);

    return result.data;
}

export async function deleteServerPlugin(axios: AxiosInstance, id: string, pluginId: string): Promise<void> {
    const result = await axios.delete(`/servers/${id}/plugins/${pluginId}`);

    return result.data;
}

export async function deleteServer(axios: AxiosInstance, id: string): Promise<void> {
    const result = await axios.delete(`/servers/${id}`);

    return result.data;
}

export async function getServerFiles(axios: AxiosInstance, id: string, path: string): Promise<ServerFile[]> {
    const result = await axios.get(`/servers/${id}/files`, {
        params: { path },
    });

    return result.data;
}

export async function getServerLogins(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<ServerLoginLog[]> {
    const result = await axios.get(`/servers/${id}/logins`, {
        params: params,
    });

    return result.data;
}
export async function getServerBuildLog(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<ServerBuildLog[]> {
    const result = await axios.get(`/servers/${id}/build-log`, {
        params: params,
    });

    return result.data;
}

export async function getServerMaps(axios: AxiosInstance, id: string): Promise<ServerMap[]> {
    const result = await axios.get(`/servers/${id}/maps`);

    return result.data;
}

export async function getServerPlugins(axios: AxiosInstance, id: string): Promise<ServerPlugin[]> {
    const result = await axios.get(`/servers/${id}/plugins`);

    return result.data;
}

export async function getServer(axios: AxiosInstance, { id }: { id: string }): Promise<ServerDto> {
    const result = await axios.get(`/servers/${id}`);

    return result.data;
}

export async function getServerStats(axios: AxiosInstance, { id }: { id: string }): Promise<ServerStats> {
    const result = await axios.get(`/servers/${id}/stats`);

    return result.data;
}

export async function getServerSetting(axios: AxiosInstance, { id }: { id: string }): Promise<ServerSetting> {
    const result = await axios.get(`/servers/${id}/setting`);

    return result.data;
}

export async function getServers(
    axios: AxiosInstance,
    params: { official?: boolean; name?: string } & PaginationQuery,
): Promise<ServerDto[]> {
    const result = await axios.get(`/servers`, { params });

    return result.data;
}

export async function createServerFile(axios: AxiosInstance, serverId: string, path: string, file: File): Promise<void> {
    const form = toForm({ file });

    return axios.post(`/servers/${serverId}/files`, form, {
        params: { path },
        data: form,
    });
}

export async function createServerMap(axios: AxiosInstance, serverId: string, data: CreateServerMapRequest): Promise<void> {
    return axios.post(`/servers/${serverId}/maps`, data, {
        data,
    });
}

export async function createServerPlugin(axios: AxiosInstance, serverId: string, data: CreateServerPluginRequest): Promise<void> {
    return axios.post(`/servers/${serverId}/plugins`, data, {
        data,
    });
}

export async function createServer(axios: AxiosInstance, data: CreateServerRequest): Promise<PostServerResponse> {
    const result = await axios.post('/servers', data, {
        data,
    });

    return result.data;
}

export async function createReloadServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
    const result = await axios.post(`/servers/${id}/reload`);

    return result.data;
}

export async function shutdownServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
    const result = await axios.post(`/servers/${id}/shutdown`);

    return result.data;
}

export async function removeServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
    const result = await axios.post(`/servers/${id}/remove`);

    return result.data;
}

export async function pauseServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
    const result = await axios.post(`/servers/${id}/pause`);

    return result.data;
}

export async function stopServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
    const result = await axios.post(`/servers/${id}/stop`);

    return result.data;
}

export async function host(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
    const result = await axios.post(`/servers/${id}/host`);

    return result.data;
}

export async function reloadServer(axios: AxiosInstance, id: string): Promise<PostServerResponse> {
    const result = await axios.post(`/servers/${id}/reload`);

    return result.data;
}

export async function reloadServers(axios: AxiosInstance): Promise<PostServerResponse> {
    const result = await axios.post('/servers/reload');

    return result.data;
}

export async function updateServer(axios: AxiosInstance, serverId: string, data: UpdateServerRequest): Promise<void> {
    return axios.put(`/servers/${serverId}`, data, {
        data,
    });
}

export async function updateServerPort(axios: AxiosInstance, serverId: string, data: UpdateServerPortRequest): Promise<void> {
    return axios.put(`/servers/${serverId}/port`, data, {
        data,
    });
}

export async function getServerAdmin(axios: AxiosInstance, serverId: string): Promise<ServerAdmin[]> {
    const result = await axios.get(`/servers/${serverId}/admin`);

    return result.data;
}

export async function createServerAdmin(axios: AxiosInstance, serverId: string, userId: string): Promise<ServerAdmin> {
    const result = await axios.post(`/servers/${serverId}/admin`, userId, { headers: { 'Content-Type': 'application/json' } });

    return result.data;
}

export async function deleteServerAdmin(axios: AxiosInstance, serverId: string, adminId: string): Promise<void> {
    const result = await axios.delete(`/servers/${serverId}/admin/${adminId}`);

    return result.data;
}
export async function getServerEnv(axios: AxiosInstance, serverId: string): Promise<ServerEnv[]> {
    const result = await axios.get(`/servers/${serverId}/env`);

    return result.data;
}

export async function getServerPlans(axios: AxiosInstance): Promise<ServerPlan[]> {
    const result = await axios.get(`/server-plans`);

    return result.data;
}

export async function updateServerPlan(axios: AxiosInstance, serverId: string, planId: number) {
    const result = await axios.put(`/servers/${serverId}/plans/${planId}`);

    return result.data;
}
export const CreateServerEnvSchema = z.object({
    name: z.string().min(1).max(128),
    value: z.string().min(1).max(1024),
});

export const UpdateServerEnvSchema = z.object({
    name: z.string().min(1).max(128),
    value: z.string().min(1).max(1024),
});
export async function createServerEnv(
    axios: AxiosInstance,
    serverId: string,
    payload: z.infer<typeof CreateServerEnvSchema>,
): Promise<ServerAdmin> {
    const result = await axios.post(`/servers/${serverId}/env`, payload, { headers: { 'Content-Type': 'application/json' } });

    return result.data;
}
export async function updateServerEnv(
    axios: AxiosInstance,
    serverId: string,
    payload: z.infer<typeof UpdateServerEnvSchema>,
): Promise<ServerAdmin> {
    const result = await axios.post(`/servers/${serverId}/env`, payload, { headers: { 'Content-Type': 'application/json' } });

    return result.data;
}

export async function deleteServerEnv(axios: AxiosInstance, serverId: string, envId: string): Promise<void> {
    const result = await axios.delete(`/servers/${serverId}/env/${envId}`);

    return result.data;
}

export async function getServerLoginMetrics(
    axios: AxiosInstance,
    serverId: string,
    params: {
        unit: MetricUnit;
        interval: number;
        start: Date;
    },
): Promise<ServerMetric[]> {
    const result = await axios.get(`/servers/${serverId}/metrics/login`, { params });

    return result.data;
}

export async function getServerWorkflowNodes(axios: AxiosInstance, serverId: string): Promise<Record<string, WorkflowNodeType>> {
    const result = await axios.get(`/servers/${serverId}/workflow/nodes`);

    return GetWorkflowNodeTypeSchema.parse(result.data);
}

export async function getServerWorkflowVersion(axios: AxiosInstance, serverId: string): Promise<number> {
    const result = await axios.get(`/servers/${serverId}/workflow/version`);

    return result.data;
}

export async function loadServerWorkflow(axios: AxiosInstance, serverId: string, payload: LoadWorkflow): Promise<void> {
    const data = LoadWorkflowSchema.parse(payload);

    await axios.post(`/servers/${serverId}/workflow/load`, data, {
        timeout: 10000,
    });
}

export type WorkflowSave = {
    data: ReturnType<ReactFlowInstance<WorkflowNode, Edge>['toObject']>;
    createdAt: number;
    version: number;
};

export async function saveServerWorkflow(axios: AxiosInstance, serverId: string, payload: WorkflowSave): Promise<void> {
    await axios.post(`/servers/${serverId}/workflow`, payload);
}

export async function getServerWorkflow(axios: AxiosInstance, serverId: string): Promise<WorkflowSave> {
    const result = await axios.get(`/servers/${serverId}/workflow`);

    return result.data;
}

export async function updateWorkflowNode(
    axios: AxiosInstance,
    serverId: string,
    nodeId: string,
    payload: WorkflowNodeType,
): Promise<void> {
    await axios.put(`/servers/${serverId}/workflow/nodes/${nodeId}`, payload, {
        data: payload,
    });
}

export async function createWorkflowNode(axios: AxiosInstance, serverId: string, payload: WorkflowNodeType): Promise<void> {
    await axios.post(`/servers/${serverId}/workflow/nodes`, payload, {
        data: payload,
    });
}

export async function deleteWorkflowNode(axios: AxiosInstance, serverId: string, nodeId: string): Promise<void> {
    const result = await axios.delete(`/servers/${serverId}/workflow/nodes/${nodeId}`);

    return result.data;
}

export async function updateWorkflowEdge(axios: AxiosInstance, serverId: string, edge: Edge): Promise<void> {
    const result = await axios.put(`/servers/${serverId}/workflow/edges/${edge.id}`, edge, {
        data: edge,
    });

    return result.data;
}

export async function createWorkflowEdge(axios: AxiosInstance, serverId: string, edge: Edge): Promise<void> {
    const result = await axios.post(`/servers/${serverId}/workflow/edges`, edge, {
        data: edge,
    });

    return result.data;
}

export async function deleteWorkflowEdge(axios: AxiosInstance, serverId: string, edgeId: string): Promise<void> {
    const result = await axios.delete(`/servers/${serverId}/workflow/edges/${edgeId}`);

    return result.data;
}
