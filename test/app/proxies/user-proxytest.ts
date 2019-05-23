import { UserProxy } from "../../../src";

test("user add function", () => {
    const proxy = new UserProxy();
    expect(proxy.add("A", { name: "hello", apiKey: "hello api key", apiSecret: "hello api secret" }) !== undefined).toBe(true);
    expect(proxy.Groups.length).toBe(1);
    expect(proxy.Groups[0].name).toBe("A");
    expect(proxy.Groups[0].accounts.length).toBe(1);

    expect(proxy.add("A", { name: "hello", apiKey: "hello new api key", apiSecret: "hello new api secret" }) === undefined).toBe(true);
    expect(proxy.Groups.length).toBe(1);
    expect(proxy.Groups[0].accounts[0].apiKey === "hello api key").toBe(true);
});

test("user remove function", () => {
    const proxy = new UserProxy();
    const initConfig: { index?: string; name: string; info: { name: string; apiKey: string; apiSecret: string } }[] = [
        { name: "A", info: { name: "hello", apiKey: "hello api key", apiSecret: "hello api secret" } },
        { name: "B", info: { name: "world", apiKey: "world api key", apiSecret: "world api secret" } },
        { name: "B", info: { name: "hello world", apiKey: "hello world api key", apiSecret: "hello world api secret" } }
    ];
    initConfig.forEach((value, index) => {
        const account = proxy.add(value.name, { name: value.info.name, apiKey: value.info.apiKey, apiSecret: value.info.apiSecret });
        expect(account! !== undefined).toBe(true);
        initConfig[index].index = account!.id!;
    });

    initConfig.forEach(value => {
        expect(proxy.remove(value.index!) !== undefined).toBe(true);
        expect(proxy.get(value.index!) === undefined).toBe(true);
    })
});

test("user update function", () => {
    const proxy = new UserProxy();
    const initAccount = proxy.add("B", { name: "hello", apiKey: "hello init api key", apiSecret: "hello init api secret" });
    expect(initAccount !== undefined).toBe(true);
    const newAccount = proxy.add("A", { name: "hello", apiKey: "hello api key", apiSecret: "hello api secret" });
    expect(newAccount !== undefined).toBe(true);
    expect(proxy.query("hello").length === 2).toBe(true);
    expect(proxy.query("hello", "A").length === 1).toBe(true);
    expect(proxy.query("hello", "B").length === 1).toBe(true);
    expect(proxy.query("world", "C").length === 0).toBe(true);
    expect(proxy.query("world").length === 0).toBe(true);

    let updateResult = proxy.update(newAccount!.id!, { groupName: "B" });
    expect(updateResult === undefined).toBe(true);
    expect(proxy.query("hello").length === 2).toBe(true);
    expect(proxy.query("hello", "A").length === 1).toBe(true);
    expect(proxy.query("hello", "B").length === 1).toBe(true);
    expect(proxy.query("world", "C").length === 0).toBe(true);
    expect(proxy.query("world").length === 0).toBe(true);
    updateResult = proxy.get(newAccount!.id!);
    expect(updateResult !== undefined).toBe(true);
    expect(updateResult!.name === "hello").toBe(true);
    expect(updateResult!.groupName === "A").toBe(true);

    updateResult = proxy.update(newAccount!.id!, { groupName: "B", name: "world" });
    expect(updateResult !== undefined).toBe(true);
    expect(updateResult!.name === "world").toBe(true);
    expect(updateResult!.groupName === "B").toBe(true);
    expect(proxy.query("hello").length === 1).toBe(true);
    expect(proxy.query("hello", "A").length === 0).toBe(true);
    expect(proxy.query("hello", "B").length === 1).toBe(true);
    expect(proxy.query("world", "B").length === 1).toBe(true);
    expect(proxy.query("world", "C").length === 0).toBe(true);
    expect(proxy.query("world").length === 1).toBe(true);

    updateResult = proxy.update(newAccount!.id!, { groupName: "C", name: "hello" });
    expect(updateResult !== undefined).toBe(true);
    expect(updateResult!.groupName === "C").toBe(true);
    expect(updateResult!.name === "hello").toBe(true);
    expect(proxy.query("hello").length === 2).toBe(true);
    expect(proxy.query("hello", "A").length === 0).toBe(true);
    expect(proxy.query("hello", "B").length === 1).toBe(true);
    expect(proxy.query("world", "B").length === 0).toBe(true);
    expect(proxy.query("hello", "C").length === 1).toBe(true);
    expect(proxy.query("world").length === 0).toBe(true);
});