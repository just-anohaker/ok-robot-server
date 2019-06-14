"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 导入数据模型基类
const Proxy_1 = __importDefault(require("../../../patterns/proxy/Proxy"));
class UserProxy extends Proxy_1.default {
    // 构造函数
    constructor() {
        // 调用基类的构造函数，并传入类tag标识
        super(UserProxy.NAME);
        // 初始化数据成员
        this.users = new Map();
        this.id = 0;
    }
    // 注册事件回调，用于当组件注册到系统中时的回调
    // 主要作用用于进行一些初始化操作，如从数据库中恢复数据等
    onRegister() {
    }
    // 移除事件回调，主要用于当组件被系统移除时的回调
    // 主要作用是进行一下系统清理工作，如释放文件句柄等
    onRemove() {
    }
    /////////////////////////////////////////////////////
    // 实现数据模型自己的接口
    add(account) {
        // TODO: 判断添加的用户信息是否符合要求
        const id = this.id++;
        account.id = id.toString();
        this.users.set(account.id, account);
        return true;
    }
    update( /** params */) {
        // TODO
        return false;
    }
    remove( /** params */) {
        // TODO
        return false;
    }
    get( /** params */) {
        // TODO
        return {};
    }
    getAll( /** params */) {
        return [];
    }
}
// 定义类对应的tag标识
UserProxy.NAME = "PROXY_USER";
