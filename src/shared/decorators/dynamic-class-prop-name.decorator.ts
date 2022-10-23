export const DynamicClassPropName = (key: string) => {
    return (target: any, memberName: string) => {
        target[key] = target[memberName]
        Object.assign(target[key], target[memberName])
        return target
    };
}