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
        httpkey: value.httpkey,
        httpsecret: value.httpsecret,
        passphrase: value.passphrase
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
            httpkey: user.httpkey,
            httpsecret: user.httpsecret,
            passphrase: user.passphrase
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
        httpkey: data.httpkey,
        httpsecret: data.httpsecret,
        passphrase: data.passphrase
    });
    if (newUser) {
        return apiSuccess({
            id: newUser.id,
            groupName: newUser.groupName,
            name: newUser.name,
            httpkey: newUser.httpkey,
            httpsecret: newUser.httpsecret,
            passphrase: newUser.passphrase
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
        httpkey: data.options.httpkey,
        httpsecret: data.options.httpsecret,
        passphrase: data.options.passphrase
    });
    if (updateUser) {
        return apiSuccess({
            id: updateUser.id,
            groupName: updateUser.groupName,
            name: updateUser.name,
            httpkey: updateUser.httpkey,
            httpsecret: updateUser.httpsecret,
            passphrase: updateUser.passphrase
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
            httpkey: removeUser.httpkey,
            httpsecret: removeUser.httpsecret,
            passphrase: removeUser.passphrase
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