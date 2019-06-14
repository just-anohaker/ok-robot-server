// 导入数据模型基类
import Proxy from "../../../patterns/proxy/Proxy";

interface IAccount {
    id?: string;
    name: string;
    group: string;
    apiKey: string;
    apiSecret: string;
}

class UserProxy extends Proxy {
    // 定义类对应的tag标识
    static NAME: string = "PROXY_USER";

    // 数据成员
    private users: Map<string, IAccount>;
    private id: number;

    // 构造函数
    constructor() {
        // 调用基类的构造函数，并传入类tag标识
        super(UserProxy.NAME);

        // 初始化数据成员
        this.users = new Map<string, IAccount>();
        this.id = 0;
    }

    // 注册事件回调，用于当组件注册到系统中时的回调
    // 主要作用用于进行一些初始化操作，如从数据库中恢复数据等
    onRegister(): void {

    }

    // 移除事件回调，主要用于当组件被系统移除时的回调
    // 主要作用是进行一下系统清理工作，如释放文件句柄等
    onRemove(): void {

    }

    /////////////////////////////////////////////////////
    // 实现数据模型自己的接口
    add(account: IAccount): boolean {
        // TODO: 判断添加的用户信息是否符合要求
        const id = this.id++;

        account.id = id.toString();
        this.users.set(account.id!, account);
        return true;
    }

    update(/** params */): boolean {
        // TODO
        return false;
    }

    remove(/** params */): boolean {
        // TODO
        return false;
    }

    get(/** params */): any {
        // TODO
        return {};
    }

    getAll(/** params */): any[]{
        return [];
    }

}