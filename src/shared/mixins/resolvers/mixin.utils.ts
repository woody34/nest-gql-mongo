import { Mongo } from "../../entities/mongo.entity";

declare type AbstractConstructor<T = object> = abstract new (...args: any[]) => T;
export type MixinFunction<D extends Mongo, K extends string, T extends AbstractConstructor = AbstractConstructor, R extends T = T & AbstractConstructor> = (Model: D, Key: K, Base: T) => R;
export type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never;
export type MixinReturnValue<D extends Mongo, KEY extends string, T extends MixinFunction<D, KEY>[]> = UnionToIntersection<
  { [K in keyof T]: T[K] extends MixinFunction<D, KEY, infer U> ? U : never }[number]
>;

export class BaseMixin {}

export function resolverMixins<D extends Mongo, K extends string, M extends MixinFunction<D, K, AbstractConstructor, any>[] = []>(
  model: D,
  key: K,
  ...mixins: M
): MixinReturnValue<D, K, M> {
  return mixins.reduce((mixin, applyMixin) => applyMixin(model, key, mixin), BaseMixin) as MixinReturnValue<D, K, M>;
}
