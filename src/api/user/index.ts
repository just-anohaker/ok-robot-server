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
        httpKey: value.httpKey,
        httpSecret: value.httpSecret,
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
            httpKey: user.httpKey,
            httpSecret: user.httpKey,
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
        httpKey: data.httpKey,
        httpSecret: data.httpSecret,
        passphrase: data.passphrase
    });
    if (newUser) {
        return apiSuccess({
            id: newUser.id,
            groupName: newUser.groupName,
            name: newUser.name,
            httpKey: newUser.httpKey,
            httpSecret: newUser.httpSecret,
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
        httpKey: data.options.httpKey,
        httpSecret: data.options.httpSecret,
        passphrase: data.options.passphrase
    });
    if (updateUser) {
        return apiSuccess({
            id: updateUser.id,
            groupName: updateUser.groupName,
            name: updateUser.name,
            httpKey: updateUser.httpKey,
            httpSecret: updateUser.httpSecret,
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
            httpKey: removeUser.httpKey,
            httpSecret: removeUser.httpSecret,
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