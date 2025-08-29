export function deepStringify(value: any) {
        const replacer = (_key: string, val: any) => {
            if (val instanceof Date) return { __type: "Date", value: val.toISOString() };
            if (typeof File !== "undefined" && val instanceof File) {
                return { __type: "File", name: val.name, size: val.size, type: val.type, lastModified: val.lastModified };
            }
            if (typeof FileList !== "undefined" && val instanceof FileList) {
                return Array.from(val).map(f => ({
                    __type: "File",
                    name: f.name,
                    size: f.size,
                    type: f.type,
                    lastModified: f.lastModified
                }));
            }
            if (typeof Blob !== "undefined" && val instanceof Blob) {
                return { __type: "Blob", size: val.size, type: val.type };
            }
            if (val instanceof Map) return { __type: "Map", value: Array.from(val.entries()) };
            if (val instanceof Set) return { __type: "Set", value: Array.from(val.values()) };
            if (typeof val === "bigint") return { __type: "BigInt", value: val.toString() };
            if (typeof val === "function") return { __type: "Function", value: val.name || "anonymous" };
            if (typeof Element !== "undefined" && val instanceof Element) return { __type: "Element", tag: val.tagName };
            return val;
        };

        return JSON.stringify(value, replacer, 2);
    }