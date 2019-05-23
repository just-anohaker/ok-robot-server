// import UserProxy from "./app/proxies/User";
// import UserMediator from "./app/mediatores/User";

// import Facade from "./patterns/facade/Facade";

// const facade = Facade.getInstance();
// // /> regiter proxy
// facade.registerProxy(new UserProxy());


// // /> register mediator
// facade.registerMediator(new UserMediator());



// /> exports
export * from "./base/Common";

export { default as IFacade } from "./interfaces/IFacade";
export { default as IMediator } from "./interfaces/IMediator";
export { default as IProxy } from "./interfaces/IProxy";
export { default as IObserver } from "./interfaces/IObserver";
export { default as INotifier } from "./interfaces/INotifier";
export { default as INotification } from "./interfaces/INotification";

export { default as Facade } from "./patterns/facade/Facade"
export { default as Mediator } from "./patterns/mediator/Mediator";
export { default as Proxy } from "./patterns/proxy/Proxy";
export { default as Observer } from "./patterns/observer/Observer";
export { default as Notifier } from "./patterns/observer/Notifier";
export { default as Notification } from "./patterns/observer/Notification";

// / user custom
// /> mediator
export { default as UserMediator } from "./app/mediatores/UserMediator";

// /> proxy
export { default as UserProxy } from "./app/proxies/UserProxy";
export { IAccount, IGroup, IQueryOptions, IUpdateAccount } from "./app/proxies/UserProxy";