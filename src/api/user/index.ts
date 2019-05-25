import Facade from "../../patterns/facade/Facade";
import UserProxy from "../../app/proxies/UserProxy";
import UserMediator from "../../app/mediatores/UserMediator";
import { MarkedMap } from "../../base/Common";

import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper, MediatorHelper } from "../Utils";
import Schema from "./Schema";

async function getAll(): Promise<APIReturn> {
    const allUsers = MediatorHelper.UserMediator.getAllUsers();
    return apiSuccess(allUsers.map(value => ({
        id: value.id,
        groupName: value.groupName,
        name: value.name,
        apiKey: value.apiKey,
        apiSecret: value.apiSecret

    })));
}

async function get(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateGetUser(data || {});
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    const user = ProxyHelper.UserProxy.get(data.userId);
    if (user) {
        return apiSuccess({
            id: user.id,
            groupName: user.groupName,
            name: user.name,
            apikey: user.apiKey,
            apiSecret: user.apiSecret
        });
    }

    return apiFailure(`Maybe user with userId(${data.userId}) not exists`);
}

async function add(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateAddUser(data || {});
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    const newUser = ProxyHelper.UserProxy.add(data.groupName, {
        name: data.name,
        apiKey: data.apiKey,
        apiSecret: data.apiSecret
    });
    if (newUser) {
        return apiSuccess({
            id: newUser.id,
            groupName: newUser.groupName,
            name: newUser.name,
            apiKey: newUser.apiKey,
            apiSecret: newUser.apiSecret
        });
    }

    return apiFailure(`Maybe user with name(${data.name}) and group(${data.groupName}) exists`);
}

async function update(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateUpdateUser(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    const updateUser = ProxyHelper.UserProxy.update(data.userId, {
        groupName: data.options.groupName,
        name: data.options.name,
        apiKey: data.options.apiKey,
        apiSecret: data.options.apiSecret
    });
    if (updateUser) {
        return apiSuccess({
            id: updateUser.id,
            groupName: updateUser.groupName,
            name: updateUser.name,
            apiKey: updateUser.apiKey,
            apiSecret: updateUser.apiSecret
        });
    }

    return apiFailure(`Maybe user with userId(${data.userId}) not exists`);
}

async function remove(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateRemoveUser(data);
    if (validation !== undefined) {
        return apiSuccess(validation);
    }

    const removeUser = ProxyHelper.UserProxy.remove(data.userId);
    if (removeUser) {
        return apiSuccess({
            id: removeUser.id,
            groupName: removeUser.groupName,
            name: removeUser.name,
            apiKey: removeUser.apiKey,
            apiSecret: removeUser.apiSecret
        });
    }

    return apiFailure(`Maybe user with userId(${data.userId}) not exists`);
}

export default {
    getAll,
    get,
    add,
    remove,
    update
};