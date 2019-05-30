// /> exports
export { MaybeUndefined, IndexedMap, MarkedMap, GenericType } from "./base/Common";
export { default as Platform, IPlatform } from "./base/Platform";

// /> interfaces
export { default as IFacade } from "./interfaces/IFacade";
export { default as IMediator } from "./interfaces/IMediator";
export { default as IProxy } from "./interfaces/IProxy";
export { default as IObserver } from "./interfaces/IObserver";
export { default as INotifier } from "./interfaces/INotifier";
export { default as INotification } from "./interfaces/INotification";

// /> implements for interfaces
export { default as Facade } from "./patterns/facade/Facade"
export { default as Observer } from "./patterns/observer/Observer";
export { default as Notifier } from "./patterns/observer/Notifier";
export { default as Notification } from "./patterns/observer/Notification";
// base of mediator and proxy component
export { default as Proxy } from "./patterns/proxy/Proxy";
export { default as Mediator } from "./patterns/mediator/Mediator";

// /> factor service logic
export * from "./app/Types";
// /> mediator
export { default as UserMediator } from "./app/mediatores/UserMediator";
// /> proxy
export { default as UserProxy } from "./app/proxies/UserProxy";
export { default as VolumeProxy } from "./app/proxies/VolumeMaker";

// /> api
export * from "./api";