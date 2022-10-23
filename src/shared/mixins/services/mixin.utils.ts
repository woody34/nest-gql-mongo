import { Mongo } from "../../entities/mongo.entity";

export type Constructor<T = {}> = new (...args: any[]) => T;
export type MixinFunction<T extends Constructor = Constructor, R extends T = T & Constructor> = (Base: T) => R;
export type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never;
export type MixinReturnValue<T extends MixinFunction<any, any>[]> = UnionToIntersection<
  { [K in keyof T]: T[K] extends MixinFunction<any, infer U> ? U : never }[number]
>;

export class BaseMixin {}

export function mixin<M extends MixinFunction<Constructor, any>[] = []>(
  ...mixins: M
): MixinReturnValue<M> {
  return mixins.reduce((mix, applyMixin) => applyMixin(mix), BaseMixin) as MixinReturnValue<M>;
}