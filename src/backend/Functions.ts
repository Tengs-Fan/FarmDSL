

export class DefaultFunctions {
    echo (message: string): string {
        return message;
    }

    static registerFunctions(): Map<string, Function> {
        const map = new Map<string, Function>();
        const prototype = DefaultFunctions.prototype;

        Object.getOwnPropertyNames(prototype).forEach(name => {
            if(name !== 'constructor' && typeof prototype[name] === 'function') {
                map.set(name, prototype[name]);
            }
        });

        return map;
    }
}
